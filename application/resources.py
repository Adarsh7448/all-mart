from flask_restful import Api, Resource, reqparse, marshal
from .models import *
from flask_security import auth_required, roles_required
import time

api = Api()

# ================ category variables ===============================

cat_parser = reqparse.RequestParser()
cat_parser.add_argument('c_name')
cat_parser.add_argument('c_description')

# ====================== category api ===============================

class CategoryApi(Resource):
    @auth_required('token')
    def get(self):
        categories = Category.query.all()
        time.sleep(0.2)
        if categories:
            all_cat = []
            for cat in categories:
                this_cat = {}
                this_cat["id"] = cat.id
                this_cat["category"] = cat.c_name
                this_cat["description"] = cat.c_description
                all_cat.append(this_cat)
            return all_cat, 200
        else:
            return {"message": "No categories found"}, 404

    @auth_required('token')
    def post(self):
        args = cat_parser.parse_args()
        new_cat = Category(c_name = args['c_name'], c_description = args['c_description'])
        db.session.add(new_cat)
        db.session.commit()
        return "Category created successfully!", 201

    @auth_required('token')
    def put(self, id):
        args = cat_parser.parse_args()
        this_cat = Category.query.get(id)
        this_cat.c_name = args['c_name']
        this_cat.c_description = args['c_description']
        db.session.commit()
        return "Category updated successfully!", 200

    @auth_required('token')
    def delete(self, id):
        this_cat = Category.query.get(id)
        if this_cat:
            db.session.delete(this_cat)
            db.session.commit()
            return "Category deleted successfully!", 200
        else:
            return "No category found", 404

# ====================== product variables ==========================

prod_parser = reqparse.RequestParser()
prod_parser.add_argument('p_name')
prod_parser.add_argument('quantity')
prod_parser.add_argument('unit')
prod_parser.add_argument('price')

# ====================== product api ===============================

class ProductApi(Resource):
    @auth_required('token')
    def get(self, id):
        this_section = Category.query.get(id)
        if this_section:
            products = []
            for product in this_section.items:
                this_prod = {}
                this_prod["id"] = product.id
                this_prod["p_name"] = product.p_name  
                this_prod["quantity"] = product.quantity 
                this_prod["unit"] = product.unit
                this_prod["price"] = product.price
                products.append(this_prod)
            return {
                    "section": this_section.c_name,
                    "products": products
                    }, 200
        else:
            return "Category not found!", 404

    @auth_required('token')
    def post(self, id):
        args = prod_parser.parse_args()
        new_prod = Product(p_name = args['p_name'], quantity = args['quantity'], unit = args['unit'], price = args['price'])
        db.session.add(new_prod)
        db.session.commit()

        this_cat = Category.query.get(id)
        this_cat.items.append(new_prod)
        db.session.commit()
        return "Product added successfully!", 201

    @auth_required('token')
    def put(self, id):
        args = prod_parser.parse_args()
        this_prod = Product.query.get(id)
        this_prod.p_name = args['p_name']
        this_prod.quantity = args['quantity']
        this_prod.unit = args['unit']
        this_prod.price = args['price']
        db.session.commit()
        return "Product details updated!"

    @auth_required('token')
    def delete(self, id):
        this_prod = Product.query.get(id)
        if this_prod:
            db.session.delete(this_prod)
            db.session.commit()
            return "Product deleted successfully!", 200
        else:
            return "No product found", 404
    

api.add_resource(CategoryApi, '/api/categories', '/api/create_category', '/api/update_category/<int:id>', '/api/delete_category/<int:id>') 
api.add_resource(ProductApi, '/api/products/<int:id>', '/api/create_product/<int:id>', '/api/update_product/<int:id>', '/api/delete_product/<int:id>') 


