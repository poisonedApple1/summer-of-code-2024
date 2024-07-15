from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager


app=Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]}})
app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql://postgres: @localhost:5432/aman'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False
app.config['SECRET_KEY']='shh_this_is_a_secret'

db=SQLAlchemy(app)
bcrypt=Bcrypt(app)
migrate=Migrate(app,db)

loginmanager=LoginManager()
loginmanager.init_app(app)
loginmanager.login_view = 'site.lol'

from api_routes import api_app
app.register_blueprint(api_app,url_prefix='/api')

with app.app_context():
    db.create_all()

from site_routes import site
app.register_blueprint(site)

if __name__ == "main":
    app.run(debug=True)