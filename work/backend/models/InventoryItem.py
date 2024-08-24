from app import db
from flask import jsonify

class InventoryItem(db.Model):
    __tablename__="inventoryitem"

    Item_SKU=db.Column(db.Integer,primary_key=True)
    Item_name=db.Column(db.String(),nullable=False)
    Item_description=db.Column(db.String(),nullable=False)
    Item_price=db.Column(db.Integer,nullable=False)
    Item_qty=db.Column(db.Integer,nullable=False)
    Item_category=db.Column(db.String())

    def __init__(self, data):
 
        name=data["Item_name"]  
        desc=data["Item_description"]  
        price=data["Item_price"] 
        qty =data["Item_qty"]
             
        self.Item_name=name     
        self.Item_description=desc     
        self.Item_price=price       
        self.Item_qty=qty
        if(data["Item_category"]):
            self.Item_category=data["Item_category"]
        else:
            self.Item_category="Others"
            
    
    def register_if_not_exist(self):
        item=InventoryItem.query.filter(InventoryItem.Item_SKU==self.Item_SKU).all()
        if not item:
            db.session.add(self)
            db.session.commit()
            return True
        return False
    
    def get_by_SKU(sku):        
        db_item = InventoryItem.query.filter(InventoryItem.Item_SKU == sku).first()
        return db_item
    
    def updateItem(data):
        db_item= InventoryItem.get_by_SKU(data["Item_SKU"])
        if db_item:
            if data["Item_name"]:
                db_item.Item_name=data["Item_name"]
            if data["Item_qty"]:
                db_item.Item_qty=data["Item_qty"]
            if data["Item_price"]:
                db_item.Item_price=data["Item_price"]
            if data["Item_description"]:
                db_item.Item_description=data["Item_description"]
            
            db.session.commit()
        return db_item
    
    def itemCount():
        count=db.session.query(InventoryItem).count()
        return count
    
    def fetchItem(offset):
        data=InventoryItem.query.offset(offset).limit(10).all()
        itemList=[{'Item_SKU': item.Item_SKU,
                    'Item_name': item.Item_name,
                    'Item_price':item.Item_price,
                    'Item_description':item.Item_description,
                    'Item_qty':item.Item_qty} for item in data]
        return itemList

    def __repr__(self):
        return f"<InventoryItem SKU: {self.Item_SKU} name: {self.Item_name} desc: {self.Item_description} price: {self.Item_price} qty: {self.Item_qty} >"
    
    def getCategory():
        db_cat=db.session.query(InventoryItem.Item_category).distinct().all()
        cat=[category[0] for category in db_cat ]
        return {"categories": cat}
    
    def getCatList(category):
        if(category!='All'):
            db_list=InventoryItem.query.filter(InventoryItem.Item_category==category).all()
        else:
            db_list=InventoryItem.query.all()
        itemList=[{'Item_SKU': item.Item_SKU,
            'Item_name': item.Item_name,
            'Item_price':item.Item_price,
            'Item_description':item.Item_description,
            'Item_qty':item.Item_qty} for item in db_list]
        return itemList

    def updByName(name,qty):
        item=InventoryItem.query.filter(InventoryItem.Item_name==name).first()
        item.Item_qty-=qty
        db.session.commit()
        return item 