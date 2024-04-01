from flask import Flask
from application.config import LocalDevelopmentConfig 
from application.database import db
from flask_security import Security, SQLAlchemyUserDatastore 
from application.models import User, Role
from application.resources import api

app = None 

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    return app 

app = create_app()

from application.views import *

if __name__ == '__main__':
    app.run(port=9000)