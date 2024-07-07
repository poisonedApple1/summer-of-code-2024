from flask import Flask, render_template,request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restx import Api,Resource,reqparse,abort,fields,marshal_with
from flask_cors import CORS


app=Flask(__name__)
api=Api(app)
CORS(app)
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
staff_find.add_argument("s_email",type=str,help="email not provided",required=True)

class StaffData(Resource):

    def put(self):
        data=staff_find.parse_args()
        cont=data["s_contact"]
        staff= Staff.get_by_contact(cont)
        
        if(staff):
            print("Data found!")
            if(staff.s_email==data["s_email"]):
                return {"auth":True},201
            else:
                return {"auth":False , "msg":"Wrong Email!"}
        else:
            return {"auth":False, "msg":"Wrong Password!"},404
    
    def post(self):
        data=staff_in.parse_args()
        staff=Staff(data)
        reg=staff.register_user_if_not_exist()
        if(reg):
            return {"msg":"Done"}
        else:
            return {"msg":"Staff Already exists!"}
        
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
item_upd.add_argument("Item_name",type=str,help="change in name invalid ")
item_upd.add_argument("Item_qty",type=int,help="change in qty invalid ")
item_upd.add_argument("Item_price",type=int,help="change in price invalid ")
item_upd.add_argument("Item_description",type=str,help="change in desc invalid ")

item_del=reqparse.RequestParser()
item_del.add_argument("Item_SKU",type=int,required=True,help="Invalid sku")

class ItemData(Resource):
    def put(self):
        data=item_find.parse_args()
        sku=data["Item_SKU"]
        item=InventoryItem.get_by_SKU(sku)
        if item:
           
            return {
                "Item_name":item.Item_name,
                "Item_price":item.Item_price,
                "Item_qty":item.Item_qty,
                "Item_description":item.Item_description,
                "msg":1
            }
        else:
            return {"msg":"Not Found"}
    
    def post(self):
        data=item_in.parse_args()
        item=InventoryItem(data)
        reg=item.register_if_not_exist()
        if(reg):
            return {"msg":"Done"}
        else:
            return {"msg":"Item Already exists!"}
    
    def delete(self):
        data=item_del.parse_args()
        item=InventoryItem.get_by_SKU(data["Item_SKU"])
        if item:
            db.session.delete(item)
            db.session.commit()
            return {'msg':1}
        return {'msg':0}
        
class ItemUpd(Resource):
    def put(self):
        data=item_upd.parse_args()
        update=InventoryItem.updateQty(data)
        if update:
            return {"msg":f"updated quanity of {data["Item_SKU"]} to {update.Item_qty}"}
        else:
            return {"msg":f"could not find item with SKU {data["Item_SKU"]}"}
    
        
api.add_resource(ItemData,"/item")
api.add_resource(ItemUpd,"/item/update")

# item_list=reqparse.RequestParser()
# item_list.add_argument

item_list=reqparse.RequestParser()
item_list.add_argument("offset",type=int,required=True,help="offset not provided")

class ItemList(Resource):
    def post(self):
        data=item_list.parse_args()
        offset=data["offset"]
        count=InventoryItem.itemCount()
        data=InventoryItem.fetchItem(offset)
        return { "data":data,"count": count}

api.add_resource(ItemList,"/itemData")
#---------------------------------------------------------------------------------------------------------------
if __name__ == "main":
    app.run(debug=True)