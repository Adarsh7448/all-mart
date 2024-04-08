from flask_restful import Api, Resource, reqparse, marshal
from .models import *
from flask_security import auth_required, roles_required
import time

api = Api()

# ================ category variables ===============================
parser = reqparse.RequestParser()
parser.add_argument('c_name')
parser.add_argument('c_description')

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
        args = parser.parse_args()
        new_cat = Category(c_name = args['c_name'], c_description = args['c_description'])
        db.session.add(new_cat)
        db.session.commit()
        return "Category created successfully!", 201

    @auth_required('token')
    def put(self, id):
        args = parser.parse_args()
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

api.add_resource(CategoryApi, '/api/categories', '/api/create_category', '/api/update_category/<int:id>', '/api/delete_category/<int:id>') 
