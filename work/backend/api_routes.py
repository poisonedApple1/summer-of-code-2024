from flask import Blueprint
from flask_restx import Api,Resource,reqparse
from app import db
from flask_cors import CORS


api_app=Blueprint('api_blueprint',__name__)
api=Api(api_app)
CORS(api_app,resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"]}})

from models.Customer import Customer
from models.Transaction import Transaction
from models.Staff import Staff
from models.InventoryItem import InventoryItem

#manage Customer Data-------------------------------------------------------------------

customer_in=reqparse.RequestParser()
customer_in.add_argument("c_name",type=str,help="Name not provided",required=True)
customer_in.add_argument("c_email",type=str,help="email not provided",required=True)
customer_in.add_argument("c_contact",type=str,help="contact not provided",required=True)

# customer_find=reqparse.RequestParser()
# customer_find.add_argument("c_contact",type=str,help="contact not provided",required=True)

customer_del=reqparse.RequestParser()
customer_del.add_argument("c_ID",type=int,help="id not provided",required=True)

customer_upd=reqparse.RequestParser()
customer_upd.add_argument("c_ID",type=int,help="ID not provided ",required=True)
customer_upd.add_argument("c_name",type=str,help="change in name invalid ")
customer_upd.add_argument("s_isAdmin",type=bool,help="change in role invalid ")
customer_upd.add_argument("c_contact",type=str,help="change in contact invalid ")
customer_upd.add_argument("c_email",type=str,help="change in email invalid ")

customer_find=reqparse.RequestParser()
customer_find.add_argument("c_contact",type=str,help="Id/contact invalid")
customer_find.add_argument("c_ID",type=int,help="Id/contact invalid")
customer_find.add_argument("searchByContact",type=bool,required=True,help="bool not provided")

class CustomerData(Resource):
    # def get(self):
    #     data=customer_find.parse_args()
    #     cont=data["c_contact"]
    #     customer= Customer.get_by_contact(cont)
        
    #     if(customer):
    #         print("Data found!")
    #         return {"msg":"Data found" , "name": customer.c_name},201
    #     else:
    #         return "Data Not found",404
    
    def post(self):
        data=customer_in.parse_args()
        customer=Customer(data)
        reg=customer.register_user_if_not_exist()
        if(reg):
            return {'msg':"Done"}
        else:
            return {'msg':"User Already exists!"}
        
    def patch(self):
        data=customer_upd.parse_args()
        update=Customer.updateCustomer(data)
        if update:
            return {"msg":f"updated data of {data["c_ID"]}"}
        else:
            return {"msg":f"could not find item with id {data["c_ID"]}"}
        
    def delete(self):
        data=customer_del.parse_args()
        customer=Customer.get_by_id(data["c_ID"])
        if customer:
            db.session.delete(customer)
            db.session.commit()
            return {'msg':1}
        return {'msg':0}
    
    def put(self):
        data=customer_find.parse_args()
        if(data["searchByContact"]):
            customer=Customer.get_by_contact(data["c_contact"])
        else:
            customer=Customer.get_by_id(data['c_ID'])
        if customer:
            return {
                'c_ID':customer.c_ID,
                'c_name':customer.c_name,
                'c_email':customer.c_email,
                'c_contact':customer.c_contact,
                'msg':1
            }
        
        return {'msg': 0}

        
api.add_resource(CustomerData,"/customer")


#manage Transaction Data---------------------------------------------------------------------------------
transaction_in=reqparse.RequestParser()
transaction_in.add_argument("c_ID",type=int,help="customer id not provided",required=True)
transaction_in.add_argument("t_amount",type=int,help="transaction amount not provided",required=True)
transaction_in.add_argument("t_category",type=str,help="transaction category not provided",required=True)
transaction_in.add_argument("t_date",type=str,help="contact not provided")

transaction_find=reqparse.RequestParser()
transaction_find.add_argument("t_ID",type=int,help="transaction id not provided",required=True)

transaction_del=reqparse.RequestParser()
transaction_del.add_argument("t_ID",type=int,help="id not provided",required=True)

transaction_upd=reqparse.RequestParser()
transaction_upd.add_argument("t_ID",type=int,help="ID not provided ",required=True)
transaction_upd.add_argument("c_ID",type=int,help="change in name invalid ")
transaction_upd.add_argument("t_amount",type=int,help="change in amount invalid ")
transaction_upd.add_argument("t_category",type=str,help="change in category invalid ")
transaction_upd.add_argument("t_date",type=str,help="change in date invalid ")


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
        if(Customer.get_by_id(data["c_ID"])):
            transaction=Transaction(data)
            transaction.register_transaction_if_not_exist()
            return {'msg':"Done"}
        else:
            return {'msg':'User Doesn\'t Exist'}
    
    def patch(self):
        data=transaction_upd.parse_args()
        update=Transaction.updateTransaction(data)
        if update:
            return {"msg":f"updated data of {data["t_ID"]}"}
        else:
            return {"msg":f"could not find item with id {data["t_ID"]}"}
        
    def delete(self):
        data=transaction_del.parse_args()
        transaction=Transaction.get_by_id(data["t_ID"])
        if transaction:
            db.session.delete(transaction)
            db.session.commit()
            return {'msg':1}
        return {'msg':0}

    

api.add_resource(TransactionData,"/transaction")


transaction_list=reqparse.RequestParser()
transaction_list.add_argument("offset",type=int,required=True,help="offset not provided")

transaction_find=reqparse.RequestParser()
transaction_find.add_argument("t_ID",type=int,required=True,help="Id not provided")

class TransactionList(Resource):
    def post(self):
        data=transaction_list.parse_args()
        offset=data["offset"]
        count=Transaction.transactionCount()
        data=Transaction.fetchTransaction(offset)
        return { "data":data,"count": count}
    

    def put(self):
        data=transaction_find.parse_args()
        transaction=Transaction.get_by_id(data['t_ID'])
        if transaction:
            return {
                't_ID':transaction.t_ID,
                'c_ID':transaction.c_ID,
                't_category':transaction.t_category,
                't_amount':transaction.t_amount,
                't_date':transaction.t_date,
                'msg':1
            }
        
        return {'msg': 0}

api.add_resource(TransactionList,"/transactData")

#manage staff data--------------------------------------------------------------------------------------------------

staff_in=reqparse.RequestParser()
staff_in.add_argument("s_name",type=str,help="Name not provided",required=True)
staff_in.add_argument("s_email",type=str,help="email not provided",required=True)
staff_in.add_argument("s_contact",type=str,help="contact not provided",required=True)
staff_in.add_argument("s_isAdmin",type=bool,help="admin info not provided",required=True)
staff_in.add_argument("s_password",type=str,help="password not provided",required=True)

staff_find=reqparse.RequestParser()
staff_find.add_argument("s_contact",type=str,help="contact not provided",required=True)
staff_find.add_argument("s_email",type=str,help="email not provided",required=True)

staff_del=reqparse.RequestParser()
staff_del.add_argument("s_ID",type=str,help="id not provided",required=True)

staff_upd=reqparse.RequestParser()
staff_upd.add_argument("s_ID",type=int,help="ID not provided ",required=True)
staff_upd.add_argument("s_name",type=str,help="change in name invalid ")
staff_upd.add_argument("s_isAdmin",type=bool,help="change in role invalid ")
staff_upd.add_argument("s_contact",type=str,help="change in contact invalid ")
staff_upd.add_argument("s_email",type=str,help="change in email invalid ")

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
    
    def patch(self):
        data=staff_upd.parse_args()
        update=Staff.updateStaff(data)
        if update:
            return {"msg":f"updated data of {data["s_ID"]}"}
        else:
            return {"msg":f"could not find item with id {data["s_ID"]}"}
        
    def delete(self):
        data=staff_del.parse_args()
        staff=Staff.get_by_id(data["s_ID"])
        if staff:
            db.session.delete(staff)
            db.session.commit()
            return {'msg':1}
        return {'msg':0}
        
api.add_resource(StaffData,"/staff")

staff_list=reqparse.RequestParser()
staff_list.add_argument("offset",type=int,required=True,help="offset not provided")

staff_find=reqparse.RequestParser()
staff_find.add_argument("s_ID",type=int,required=True,help="Id not provided")

class StaffList(Resource):
    def post(self):
        data=staff_list.parse_args()
        offset=data["offset"]
        count=Staff.staffCount()
        data=Staff.fetchStaff(offset)
        return { "data":data,"count": count}
    

    def put(self):
        data=staff_find.parse_args()
        staff=Staff.get_by_id(data['s_ID'])
        if staff:
            return {
                's_ID':staff.s_ID,
                's_name':staff.s_name,
                's_isAdmin':staff.s_isAdmin,
                's_email':staff.s_email,
                's_contact':staff.s_contact
            }
        
        return {'msg': 'No'}

api.add_resource(StaffList,"/staffData")
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
        update=InventoryItem.updateItem(data)
        if update:
            return {"msg":f"updated data of {data["Item_SKU"]}"}
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