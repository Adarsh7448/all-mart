from flask import current_app as app 
from flask import request 
from .database import db
from flask_security import hash_password 

@app.route('/')
def home():
    args = request.args
    username = args['username']
    email = args['email']
    password = args['password']
    new = app.security.datastore.create_user(username=username, email=email, password=hash_password(password))
    db.session.add(new)
    db.session.commit()
    return "Hello World! User Added"
