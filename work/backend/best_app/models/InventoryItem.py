from best_app.database import db

class InventoryItem(db.Model):
    __tablename__="InventoryItem"

    Item_SKU=db.Column(db.String(),nullable=False)
    Item_name=db.Column(db.String(),nullable=False)
    Item_description=db.Column(db.String(),nullable=False)
    Item_price=db.Column(db.Integer,nullable=False)
    Item_qty=db.Column(db.Integer,nullable=False)

    def __init__(self, sku,name,desc,price,qty):
        self.Item_SKU=sku      
        self.Item_name=name     
        self.Item_description=desc     
        self.Item_price=price       
        self.Item_qty=qty 
    
    def get_by_SKU(sku):        
        db_item = InventoryItem.query.filter(InventoryItem.Item_SKU == sku).first()
        return db_item

    def __repr__(self):
        return f"<InventoryItem {self.Item_SKU}>"