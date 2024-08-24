
from flask import abort,render_template,Blueprint,request,send_file,redirect,make_response,flash
from flask_login import LoginManager
from api_routes import logout_user,login_user,login_required,current_user
from models.Staff import Staff
from app import loginmanager,bcrypt
from flask_cors import CORS
from flask_restx import Api,Resource,reqparse
from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField,SubmitField
from wtforms.validators import InputRequired  ,Length,ValidationError
from functools import wraps


site=Blueprint('site',__name__)
# api=Api(site)
# CORS(site)
CORS(site,resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"]}})


@site.route('/pdf')
def  pdf():
    return render_template('pdf.html')


def admin_required(isAdmin):
    def decorator(func):
        @wraps(func)
        def decorated_view(*args, **kwargs):
            if current_user.s_isAdmin != isAdmin:
                return abort(403)  
            return func(*args, **kwargs)
        return decorated_view
    return decorator


     

staff_login=reqparse.RequestParser()
staff_login.add_argument("s_email",type=str,help="email not provided",required=True)
staff_login.add_argument("s_password",type=str,help="password not provided",required=True)

class LoginForm(FlaskForm):
    email = StringField(validators=[
                           InputRequired(), Length(min=4, max=50)], render_kw={"placeholder": "Email"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=2, max=50)], render_kw={"placeholder": "Password"})

    submit = SubmitField('Login')

@site.route('/',methods=['GET','POST'])
def lol():
    if current_user.is_authenticated:
        return redirect('/admin_home')
    form=LoginForm()
    
    if form.validate_on_submit():
        
        staff= Staff.query.filter(Staff.s_email==form.email.data).first()

        if staff and bcrypt.check_password_hash(staff.s_password,form.password.data):
            # login_user(staff)
            login_user(staff)
            if staff.s_isAdmin:
                return redirect('/admin_home')
            else:
                return redirect('/checkout')
        else:
            # staff=Staff.query.filter_by(s_ID='1').first()
            # login_user(staff,force=True)
            flash('Invalid Email or password')
    return render_template('loginPage.html',form=form)        


@site.route('/admin_home')
@login_required
@admin_required(True)
def home():
    # logout_user()
    return render_template('admin_dashboard.html')

@site.route('/logout')
@login_required
def logout():
    logout_user()
    return render_template('logout.html')

@site.route("/test")
@login_required
def haha():
    return "haha "+ current_user.s_name

@site.route('/products')
@login_required
@admin_required(True)
def product():
    return render_template('manage_products.html')

@site.route('/registerStaff')
@login_required
@admin_required(True)
def signup():
    return render_template('signup.html')


@site.route('/staff')
@login_required
@admin_required(True)
def staff():
    return render_template('manage_staff.html')

@site.route('/customer')
@login_required
@admin_required(True)
def customer():
    return render_template('customer_admin.html')

@site.route('/registerCustomer')
@login_required
@admin_required(True)
def signupCustomer():
    return render_template('customer_registration.html')

@site.route("/transaction")
@login_required
@admin_required(True)
def transact():
    return render_template('transaction.html')

@site.route("/addTransaction")
def transactionNew():
    return render_template('addTransaction.html')


@site.route('/checkout')
@login_required
def checkout():
    return render_template('checkout.html',name=current_user.s_name,email=current_user.s_email)


@site.route('/addItems')
def addItems():
    name = request.args.get('name')
    contact = request.args.get('contact')
    return render_template('checkout2.html',c_name=name,c_contact=contact)

@site.route('/pdfDownload')
def download():
    # html = render_template('invoice.html')
    # pdf = HTML(string=html).write_pdf(page_size='A4')
    # return send_file(pdf, as_attachment=True, attachment_filename='hello.pdf')
    return render_template('invoice.html')