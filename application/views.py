from flask import current_app as app 
from flask import request, render_template, send_from_directory 
from .database import db
from .models import Category, Product, User, Cart, Order, OrderProduct
from .tasks import display, export_csv
from flask_security import hash_password
from flask_security import auth_required, roles_required
from werkzeug.security import generate_password_hash, check_password_hash 
import string
import random
import csv
from celery import result

 
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/user-login', methods = ['POST'])
def user_login():
    user_data = request.json
    email = user_data.get('email')
    password = user_data.get('password')

    if not email:
        return {"message": "no email provided"}, 400
    
    this_user = app.security.datastore.find_user(email = email)

    if this_user:
        if check_password_hash(this_user.password, password):
            return {
                "auth_token": this_user.get_auth_token(), 
                "role": this_user.roles[0].name,
                "id": this_user.id
                }, 200
        else:
            return {"message": "incorrect password for the user"}, 400
    else:
        return {"message": "User not found!"}, 404

@app.route('/load_data')
def load_test_data():
    args = request.args
    username = args['username']
    email = args['email']
    password = args['password']
    new = app.security.datastore.create_user(username=username, email=email, password=generate_password_hash(password))
    db.session.commit()
    return "data added successfully", 201

@app.route('/user-register', methods = ['POST'])
def register_new_user():
    user_data = request.json
    username = user_data.get('username')
    email = user_data.get('email')
    password = user_data.get('password')

    if not email:
        return {"message": "no email provided"}, 400

    this_user = app.security.datastore.find_user(email = email)
    if this_user:
        return {"message": "user email already exist, try another one"}, 400
    
    app.security.datastore.create_user(username=username, email=email, password=generate_password_hash(password))
    db.session.commit()
    return {"message": "New user registered!"}, 201

@app.get('/get_category/<int:id>')
def get_cat(id):
    this_cat = Category.query.get(id)
    if this_cat:
        return {
        "c_name" : this_cat.c_name,
        "c_description" : this_cat.c_description
        }
    else:
        return {"message": "Category not found"}, 404

@app.get('/get_product/<int:id>')
def get_prod(id):
    this_prod = Product.query.get(id)
    if this_prod:
        return {
        "p_name" : this_prod.p_name,
        "quantity": this_prod.quantity,
        "unit": this_prod.unit,
        "price": this_prod.price,
        "section": this_prod.section[0].id
        }
    else:
        return {"message": "Product not found"}, 404


@app.route('/user/<int:uid>/cart', methods=['GET', 'POST'])
@auth_required('token')
def cart(uid):
    if request.method == 'POST':
        data = request.json
        user = User.query.get(uid)
        new_carting = Cart(user_id = uid, prod_id = data['prod_id'], quant = data['quant'])
        db.session.add(new_carting)
        db.session.commit()
        return {
            "message": "Added to cart successfully!"
        }, 200
    get_cart = Cart.query.filter_by(user_id = uid).all()
    if get_cart:
        user_cart = []
        for item in get_cart:
            product = Product.query.get(item.prod_id)
            this_prod = {}
            this_prod['cart_id'] = item.id
            this_prod['user_id'] = item.user_id
            this_prod['prod_id'] = item.prod_id
            this_prod['prod_name'] = product.p_name
            this_prod['ava_quant'] = product.quantity
            this_prod['unit_price'] = product.price
            this_prod['req_quant'] = item.quant
            user_cart.append(this_prod)
        return user_cart, 200
    else:
        return {"message": "error loading cart"}, 404


@app.route('/delete/cart/<int:cart_id>')
@auth_required('token')
def delete_cart_item(cart_id):
    this_item = Cart.query.get(cart_id)
    if this_item:
        db.session.delete(this_item)
        db.session.commit()
        return {
            "message": "Item removed from cart!"
        }, 200
    else:
        return {
            "message": "No item found!"
        }, 404 

@app.post('/order/<int:user_id>/create')
def create_order(user_id):
    order_pre = "ODR-"+str(user_id)+"-"
    order_post = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
    order_key = order_pre + order_post
    print(order_key)
    order_details = request.json
    new_order = Order(id = order_key, amount = order_details['amount'], user_id = user_id)
    db.session.add(new_order)
    db.session.commit()

    for prod in order_details['products']:
        product_obj = Product.query.filter_by(p_name = prod['prod_name']).first()
        product_obj.quantity -= prod['req_quant']
        db.session.commit()
        prod_order_obj = OrderProduct(prod_id = product_obj.id, quantity = prod['req_quant'], price = prod['unit_price'], order_id = order_key)
        db.session.add(prod_order_obj)
        db.session.commit()
    return {
        "message": "order created"
    }, 201 

@app.get('/orders/<int:user_id>')
def get_orders(user_id):
    this_user = User.query.get(user_id)
    if this_user:
        user_orders = []
        for order in this_user.orders:
            print(order)
            this_order = {}
            this_order['order_id'] = order.id
            order_items = []
            for item in order.items:
                this_item = {}
                product = Product.query.get(item.prod_id)
                this_item['product_name'] = product.p_name
                this_item['quantity'] = item.quantity
                this_item['price'] = item.price
                order_items.append(this_item)
            this_order['items'] = order_items
            this_order['amount'] = order.amount
            user_orders.append(this_order)
        return user_orders, 200
    else:
        return {
            "message":"User not found"
        }, 404

# @app.get('/export')
# def export_csv():
#     all_products = Product.query.all()
#     with open('static/products.csv', 'w', newline='') as csvfile:
#         sr_no = 1
#         products_csv = csv.writer(csvfile, delimiter=',')
#         products_csv.writerow(['Sr No', 'Product Name', 'Units Available', 'Units Sold', 'Unit Price'])
#         for product in all_products:
#             orders = OrderProduct.query.filter_by(prod_id = product.id).all()
#             sold = 0
#             for order in orders:
#                 sold += order.quantity
            
#             this_prod = [sr_no, product.p_name, product.quantity, sold, product.price]
#             products_csv.writerow(this_prod)
#             sr_no += 1
        
#     return send_from_directory("static","products.csv")

@app.route('/display')
def display_trigger():
    job = display.delay()
    return "Running async celery task! " + str(job.get())

@app.route('/export')
def export_trigger():
    job = export_csv.delay()
    return {
        "task_id": job.id
    }

@app.route('/download_report/<id>')
def download_csv(id):
    res = result.AsyncResult(id)
    if res.ready():
        return send_from_directory("static", res.result)
    else:
        return {
            "message": "response not ready yet"
        }, 404
         


