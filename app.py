from flask import Flask
from application.config import LocalDevelopmentConfig 
from application.database import db
from flask_security import Security, SQLAlchemyUserDatastore 
from application.models import User, Role, Product, OrderProduct
from application.resources import api
from application.make_celery import celery_init_app
from application.tasks import mailer

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

celery = celery_init_app(app)

#creating a scheduler
@celery.on_after_finalize.connect
def setup_periodic_task(sender, **kwargs):
    sender.add_periodic_task(5, mailer.s(), name='run after every 5 sec')

from application.views import *

if __name__ == '__main__':
    app.run(port=9000)