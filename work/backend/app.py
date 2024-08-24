from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager,login_user

import reportlab.fonts 


app=Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql://postgres: @localhost:5432/aman'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False
app.config['SECRET_KEY']='shh_this_is_a_secret'

db=SQLAlchemy(app)
bcrypt=Bcrypt(app)
migrate=Migrate(app,db)

loginmanager=LoginManager()
loginmanager.init_app(app)
# loginmanager.login_view = 'site.lol'

from api_routes import api_app
app.register_blueprint(api_app,url_prefix='/api')

with app.app_context():
    db.create_all()

from site_routes import site
app.register_blueprint(site)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]}})

from models.Staff import Staff

@loginmanager.user_loader
def load_user(s_ID):
    return Staff.query.get(int(s_ID))

# @loginmanager.request_loader
# def req_loader(request):
#     return Staff.query.get(int())

# staff1=Staff.query.filter_by(s_ID='1').first()
# login_user(staff1)

# from weasyprint import HTML
# @app.route('/pdf')
# def pdf():
#     with app.test_request_context(base_url="http://localhost:3000/"):
#         pdf=HTML('/pdfDownload').write_pdf('idk.pdf')
#         return ('stuff.html')
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4


w,h = A4

c=canvas.Canvas('Hello.pdf')

c.setStrokeColorRGB(0.5,0.5,0.5)
c.setFillColorRGB(0.75 , 0.5 , 0.5)
c.roundRect(50,50,w-100,h-100,10)

heading= c.beginText(w/2-25,h-75)
heading.textLine("INVOICE")
heading.setFont("Times-Roman",12)

c.drawText(heading)

c.grid([80,100,400,w-80],[h-90,h-110,h-150])
c.showPage()
c.save()


if __name__ == "main":
    app.run(debug=True)
    