import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask,request
from datetime import datetime,timezone


CREATE_CUSTOMER_TABLE=("CREATE TABLE IF NOT EXISTS  customer(c_id SERIAL PRIMARY KEY,c_name TEXT,c_email TEXT,c_contact INTEGER);")
CREATE_TRANSACTION_TABLE=("CREATE TABLE IF NOT EXISTS transaction(t_id SERIAL PRIMARY KEY,c_id INTEGER,t_date TEXT,t_amount INTEGER,       t_category TEXT,FOREIGN KEY(c_id) REFERENCES customer(c_id) ON DELETE CASCADE);")
CREATE_STAFF_TABLE=("CREATE TABLE IF NOT EXISTS  staff(s_id SERIAL PRIMARY KEY,s_name TEXT,s_email TEXT,s_contact INTEGER,s_isAdmin INTEGER);")
CREATE_INVENTORY_TABLE=("CREATE TABLE IF NOT EXISTS  InventoryItem(item_sku SERIAL PRIMARY KEY,item_name TEXT,item_description TEXT,item_price INTEGER,item_qty INTEGER);")

INSERT_CUSTOMER=("INSERT INTO customer (c_name,c_email,c_contact) VALUES (%s,%s,%s) RETURNING c_id;")
INSERT_TRANSACTION=("INSERT INTO transaction (c_id,t_date,t_amount,t_category) VALUES (%s,%s,%s,%s) RETURNING t_id;")
INSERT_STAFF=("INSERT INTO staff (s_name,s_email,s_contact,s_isAdmin) VALUES (%s,%s,%s,%s) RETURNING s_id;")
INSERT_ITEM=("INSERT INTO InventoryItem (item_name,item_description,item_price,item_qty) VALUES (%s,%s,%s,%s) RETURNING item_sku;")
CHECK_SKU=("SELECT EXISTS (SELECT 1 FROM InventoryItem WHERE item_sku = %s);")
UPDATE_ITEM_QTY=("UPDATE InventoryItem SET item_qty = item_qty + (%s) WHERE item_sku = %s RETURNING item_qty")

load_dotenv()

app=Flask(__name__)
url=os.getenv("DATABASE_URL")
connection=psycopg2.connect(url)



@app.get("/")
def home():
    return "Hello World!"

@app.post("/customerData")
def inCustData():
    data=request.get_json()
    name=data["c_name"]
    email=data["c_email"]
    contact=data["c_contact"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_CUSTOMER_TABLE)
            cursor.execute(INSERT_CUSTOMER,(name,email,contact))
            customer_id=cursor.fetchone()[0]
    return {"id": customer_id,"message":f"Customer {name} created!"},201


@app.post("/addTransaction")
def transact():
    data=request.get_json()
    cust_id=data["c_id"]
    amount=data["t_amount"]
    category=data["t_category"]
    try:
        date=datetime.strptime(data["t_date"], "%m-%d-%Y  %H-%M:%S" )
    except KeyError:
        date=datetime.now(timezone.utc)

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TRANSACTION_TABLE)
            cursor.execute(INSERT_TRANSACTION,(cust_id,date,amount,category))
            t_id=cursor.fetchone()[0]
    return {"id": t_id,"message":"Transaction Done!"},201


@app.post("/staffData")
def inStaffData():
    data=request.get_json()
    name=data["s_name"]
    email=data["s_email"]
    contact=data["s_contact"]
    isAdm=data["s_isAdmin"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_STAFF_TABLE)
            cursor.execute(INSERT_STAFF,(name,email,contact,isAdm))
            staff_id=cursor.fetchone()[0]
    return {"id": staff_id,"message":f"Staff {name} created!"},201


@app.post("/itemData")
def initemData():
    data=request.get_json()
    name=data["item_name"]
    desc=data["item_description"]
    price=data["item_price"]
    qty=data["item_qty"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_INVENTORY_TABLE)
            cursor.execute(INSERT_ITEM,(name,desc,price,qty))
            sku=cursor.fetchone()[0]
    return {"id": sku,"message":f"Item {name} created!"},201

@app.post("/updateQty")
def updateQty():
    data=request.get_json()
    change=data["change"]
    sku=data["sku"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CHECK_SKU,sku)
            exists=cursor.fetchone()[0]
            if exists:
                cursor.execute(UPDATE_ITEM_QTY,(change,sku))
                qty=cursor.fetchone()[0]
                return {"id": sku,"message":f"Quantity updated to {qty}"},201
# CREAT_INVENTORY_TABLE=("CREATE TABLE IF NOT EXISTS  InventoryItem(item_sku SERIAL PRIMARY KEY,item_name TEXT, TEXT, INTEGER, INTEGER);")
# INSERT_ITEM=("INSERT INTO InventoryItem (item_name,item_description,item_price,item_qty) VALUES (%s,%s,%s,%s);")
# UPDATE_ITEM_QTY=("UPDATE InventoryItem item_qty = item_qty + %s WHERE item_sku = %s").

