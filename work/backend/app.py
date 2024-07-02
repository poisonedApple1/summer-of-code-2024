from flask import Flask, render_template,request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restx import Api,Resource,reqparse,abort,fields,marshal_with


app=Flask(__name__)
api=Api(app)
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

class home(Resource):
    def get():    
        return "Hello World!"

api.add_resource(home,"/")

#manage Customer Data-------------------------------------------------------------------

customer_in=reqparse.RequestParser()
customer_in.add_argument("c_name",type=str,help="Name not provided",required=True)
customer_in.add_argument("c_email",type=str,help="email not provided",required=True)
customer_in.add_argument("c_contact",type=str,help="contact not provided",required=True)

customer_find=reqparse.RequestParser()
customer_find.add_argument("c_contact",type=str,help="contact not provided",required=True)

class CustomerData(Resource):
    def get(self):
        data=customer_find.parse_args()
        cont=data["c_contact"]
        customer= Customer.get_by_contact(cont)
        
        if(customer):
            print("Data found!")
            return {"msg":"Data found" , "name": customer.c_name},201
        else:
            return "Data Not found",404
    
    def post(self):
        data=customer_in.parse_args()
        customer=Customer(data)
        reg=customer.register_user_if_not_exist()
        if(reg):
            return "Done"
        else:
            return "User Already exists!"
        
api.add_resource(CustomerData,"/customer")

#manage Transaction Data---------------------------------------------------------------------------------
transaction_in=reqparse.RequestParser()
transaction_in.add_argument("c_id",type=int,help="customer id not provided",required=True)
transaction_in.add_argument("t_amount",type=int,help="transaction amount not provided",required=True)
transaction_in.add_argument("t_category",type=str,help="transaction category not provided",required=True)
transaction_in.add_argument("t_date",type=str,help="contact not provided")

transaction_find=reqparse.RequestParser()
transaction_find.add_argument("t_id",type=int,help="transaction id not provided",required=True)

class TransactionData(Resource):
    def get(self):
        data=transaction_find.parse_args()
        id=data["t_id"]
        transaction=Transaction.get_by_tID(id)
        if(transaction):
             return {"msg":"Transaction found" , "amount": transaction.t_amount},201
        else:
            return "Not Found"
    
    def post(self):
        data=transaction_in.parse_args()
        transaction=Transaction(data)
        transaction.register_transaction_if_not_exist()
        return "Done!"
    

api.add_resource(TransactionData,"/transaction")


#manage staff data--------------------------------------------------------------------------------------------------

staff_in=reqparse.RequestParser()
staff_in.add_argument("s_name",type=str,help="Name not provided",required=True)
staff_in.add_argument("s_email",type=str,help="email not provided",required=True)
staff_in.add_argument("s_contact",type=str,help="contact not provided",required=True)
staff_in.add_argument("s_isAdmin",type=bool,help="admin info not provided",required=True)

staff_find=reqparse.RequestParser()
staff_find.add_argument("s_contact",type=str,help="contact not provided",required=True)

class StaffData(Resource):
    def get(self):
        data=staff_find.parse_args()
        cont=data["s_contact"]
        staff= Staff.get_by_contact(cont)
        
        if(staff):
            print("Data found!")
            return {"msg":"Data found" , "name": staff.s_name},201
        else:
            return "Data Not found",404
    
    def post(self):
        data=staff_in.parse_args()
        staff=Staff(data)
        reg=staff.register_user_if_not_exist()
        if(reg):
            return "Done"
        else:
            return "Staff Already exists!"
        
api.add_resource(StaffData,"/staff")

#manage item data----------------------------------------------------------------------------------------------

item_in=reqparse.RequestParser()
item_in.add_argument("Item_name",type=str,help="Name not provided",required=True)
item_in.add_argument("Item_description",type=str,help="desc not provided",required=True)
item_in.add_argument("Item_price",type=int,help="price not provided",required=True)
item_in.add_argument("Item_qty",type=int,help="qty not provided",required=True)

item_find=reqparse.RequestParser()
item_find.add_argument("Item_SKU",type=str,help="sku not provided",required=True)

item_upd=reqparse.RequestParser()
item_upd.add_argument("Item_SKU",type=int,help="SKU not provided ",required=True)
item_upd.add_argument("Item_change",type=int,help="change in qty not provided ",required=True)


class ItemData(Resource):
    def get(self):
        data=item_find.parse_args()
        sku=data["Item_SKU"]
        item=InventoryItem.get_by_SKU(sku)
        if item:
           
            return item.__repr__()
        else:
            return "Not Found"
    
    def post(self):
        data=item_in.parse_args()
        item=InventoryItem(data)
        reg=item.register_if_not_exist()
        if(reg):
            return "Done"
        else:
            return "Item Already exists!"

    def put(self):
        data=item_upd.parse_args()
        sku=data["Item_SKU"]
        change=data["Item_change"]
        update=InventoryItem.updateQty(sku,change)
        if update:
            return f"updated quanity of {sku} to {update.Item_qty}"
        else:
            return f"could not find item with SKU {sku}"
        
api.add_resource(ItemData,"/item")
        
#---------------------------------------------------------------------------------------------------------------
if __name__ == "main":
    app.run(debug=True)