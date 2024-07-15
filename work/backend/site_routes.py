
from flask import render_template,Blueprint
from flask_login import LoginManager
from flask_login import logout_user,login_user,login_required,current_user
from models.Staff import Staff
from app import loginmanager

site=Blueprint('site',__name__)

@loginmanager.user_loader
def load_user(s_ID):
    return Staff.query.get(int(s_ID))



@site.route('/')
def lol():
    staff=Staff.query.filter_by(s_ID='1').first()
    login_user(staff)
    return render_template('loginPage.html')

@site.route('/admin_home')
@login_required
def home():
    logout_user()
    return render_template('admin_dashboard.html')

@site.route("/test")
@login_required
def haha():
    return "haha "+ current_user.s_name

@site.route('/products')
def product():
    return render_template('manage_products.html')

@site.route('/registerStaff')
def signup():
    return render_template('signup.html')


@site.route('/staff')
def staff():
    return render_template('manage_staff.html')

@site.route('/customer')
def customer():
    return render_template('customer_admin.html')

@site.route('/registerCustomer')
def signupCustomer():
    return render_template('customer_registration.html')

@site.route("/transaction")
def transact():
    return render_template('transaction.html')

@site.route("/addTransaction")
def transactionNew():
    return render_template('addTransaction.html')


@site.route('/checkout')
def checkout():
    return render_template('checkout.html')


@site.route('/checkout/addItems')
def addItems():
    return render_template('checkout2.html')