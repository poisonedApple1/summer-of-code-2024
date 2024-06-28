from flask import Flask
from best_app.modules import hello,goodbye
from best_app.config import Aconfig
from best_app.database import db
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

def create_app():    
    app = Flask(__name__)        
    app.config.from_mapping(
        SECRET_KEY = "amandegala"
    )

    app.config.from_object(Aconfig)

    db.init(app)
    # from best_app.models import Customer
    # from best_app.models import Transaction
    # migrate=Migrate(app,db)




    app.register_blueprint(hello.blueprint)
    app.register_blueprint(goodbye.blueprint)     
    
    return app