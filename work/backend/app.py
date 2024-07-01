from flask import Flask, render_template,request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql://postgres: @localhost:5432/aman'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False
db=SQLAlchemy(app)

from models.Customer import Customer
from models.Transaction import Transaction
from models.Staff import Staff
from models.InventoryItem import InventoryItem


with app.app_context():
    db.create_all()

migrate=Migrate(app,db)
@app.route("/")
def hello():    
    return "Hello World!"


@app.route("/Customer",methods=['GET','POST'])
def addCustomer():

    if request.method=='POST':
        data=request.get_json()
        customer=Customer(data)
        reg=customer.register_user_if_not_exist()
        if(reg):
            return "Done"
        else:
            return "User Already exists!"
    
    if request.method=='GET':
        data=request.get_json()
        cont=data["c_contact"]
        customer= Customer.get_by_contact(cont)
        
        if(customer):
            print("Data found!")
            return {"msg":"Data found" , "name": customer.c_name},201
        else:
            return "Data Not found",404

@app.route("/transaction",methods=['GET','POST','PUT'])
def transact():
    if request.method=='POST':
        data=request.get_json()
        transaction=Transaction(data)
        transaction.register_transaction_if_not_exist()
        return "Done!"
    
    if request.method=='GET':
        data=request.get_json()
        id=data["t_id"]
        transaction=Transaction.get_by_tID(id)
        if(transaction):
             return {"msg":"Transaction found" , "name": transaction.t_name},201
        else:
            return "Not Done"

@app.route("/staff",methods=['GET','POST'])
def addStaff():
    if request.method=='POST':
        data=request.get_json()
        staff=Staff(data)
        reg=staff.register_user_if_not_exist()
        if(reg):
            return "Done"
        else:
            return "Staff Already exists!"
    
    if request.method=='GET':
        data=request.get_json()
        cont=data["s_contact"]
        staff= Staff.get_by_contact(cont)
        
        if(staff):
            print("Data found!")
            return {"msg":"Data found" , "name": staff.s_name},201
        else:
            return "Data Not found",404
        
@app.route("/item",methods=['GET','POST','PUT'])
def items():
    if(request.method=='POST'):
        data=request.get_json()
        item=InventoryItem(data)
        reg=item.register_if_not_exist()
        if(reg):
            return "Done"
        else:
            return "Item Already exists!"

    if(request.method=='GET'):
        data=request.get_json()
        sku=data["Item_SKU"]
        item=InventoryItem.get_by_SKU(sku)
        if item:
           
            return item.__repr__()
        else:
            return "Not Found"

    if(request.method=='PUT'):
        data=request.get_json()
        sku=data["Item_SKU"]
        change=data["Item_change"]
        update=InventoryItem.updateQty(sku,change)
        if update:
            return f"updated quanity of {sku} to {update.Item_qty}"
        else:
            return f"could not find item with SKU {sku}"

if __name__ == "main":
    app.run(debug=True)