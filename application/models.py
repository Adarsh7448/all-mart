from .database import db 
from flask_security import UserMixin, RoleMixin

#=========================== main models ==============================

class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), primary_key = True)
    username = db.Column(db.String(), unique = True, nullable = False)
    email = db.Column(db.String(), unique = True, nullable = False)
    password = db.Column(db.String(), nullable = False)
    active = db.Column(db.Boolean(),nullable = False)
    fs_uniquifier = db.Column(db.String(), unique = True, nullable = False)
    roles = db.relationship('Role', backref = 'bearer', secondary = 'role_user')
    orders = db.relationship('Order', backref = 'owner')

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key = True)
    name = db.Column(db.String(), unique = True, nullable = False)
    description = db.Column(db.String())

class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer(), primary_key = True)
    c_name = db.Column(db.String(), unique = True, nullable = False)
    c_description = db.Column(db.String())
    items = db.relationship('Product', backref = 'section', secondary = 'category_product')

class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer(), primary_key = True)
    p_name = db.Column(db.String(), unique = True, nullable = False)
    quantity = db.Column(db.Integer(), nullable = False)
    unit = db.Column(db.String())
    price = db.Column(db.Float())

#================ linking tables =====================================

class RoleUser(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))

class CategoryProduct(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    cat_id = db.Column(db.Integer(), db.ForeignKey('category.id'))
    prod_id = db.Column(db.Integer(), db.ForeignKey('product.id'))

class Cart(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    prod_id = db.Column(db.Integer(), db.ForeignKey('product.id'))
    quant = db.Column(db.Integer())

class Order(db.Model):
    id = db.Column(db.String(), primary_key = True)
    amount = db.Column(db.Float(), nullable = False)
    items = db.relationship('OrderProduct')
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))

class OrderProduct(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    prod_id = db.Column(db.Integer(), db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer(), nullable = False)
    price = db.Column(db.Float())    #unit price
    order_id = db.Column(db.Integer(), db.ForeignKey('order.id'))
