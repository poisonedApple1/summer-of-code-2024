from app import db

class InventoryItem(db.Model):
    __tablename__="inventoryitem"

    Item_SKU=db.Column(db.Integer,primary_key=True)
    Item_name=db.Column(db.String(),nullable=False)
    Item_description=db.Column(db.String(),nullable=False)
    Item_price=db.Column(db.Integer,nullable=False)
    Item_qty=db.Column(db.Integer,nullable=False)

    def __init__(self, data):
 
        name=data["Item_name"]  
        desc=data["Item_description"]  
        price=data["Item_price"] 
        qty =data["Item_qty"]
 
     
        self.Item_name=name     
        self.Item_description=desc     
        self.Item_price=price       
        self.Item_qty=qty 
    
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
    
    def updateQty(sku,change):
        db_item= InventoryItem.get_by_SKU(sku)
        if db_item:
            db_item.Item_qty+=change
            db.session.commit()
            return db_item
        

    def __repr__(self):
        return f"<InventoryItem SKU: {self.Item_SKU} name: {self.Item_name} desc: {self.Item_description} price: {self.Item_price} qty: {self.Item_qty} >"