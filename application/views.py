from flask import current_app as app 
from flask import request, render_template 
from .database import db
from flask_security import hash_password
from werkzeug.security import generate_password_hash, check_password_hash 

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
            return {"auth-token": this_user.get_auth_token()}, 200
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
