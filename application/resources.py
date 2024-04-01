from flask_restful import Api, Resource, reqparse, marshal
from .models import *

api = Api()

# ================ category variables ===============================
parser = reqparse.RequestParser()
parser.add_argument('c_name')
parser.add_argument('c_description')

class CategoryApi(Resource):
    def get(self):
        categories = Category.query.all()
        all_cat = []
        for cat in categories:
            this_cat = {}
            this_cat["id"] = cat.id
            this_cat["category"] = cat.c_name
            this_cat["description"] = cat.c_description
            all_cat.append(this_cat)
        return all_cat

    def post(self):
        args = parser.parse_args()
        new_cat = Category(c_name = args['c_name'], c_description = args['c_description'])
        db.session.add(new_cat)
        db.session.commit()
        return "Category created successfully!", 201

    def put(self, id):
        args = parser.parse_args()
        this_cat = Category.query.get(id)
        this_cat.c_name = args['c_name']
        this_cat.c_description = args['c_description']
        db.session.commit()
        return "Category updated successfully!", 200

    def delete(self, id):
        this_cat = Category.query.get(id)
        db.session.delete(this_cat)
        db.session.commit()
        return "Category deleted successfully!", 200

api.add_resource(CategoryApi, '/api/categories', '/api/create_category', '/api/update_category/<int:id>', '/api/delete_category/<int:id>') 
