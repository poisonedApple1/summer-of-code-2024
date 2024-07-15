from app import db

class Customer(db.Model):
    __tablename__='customer'

    c_ID=db.Column(db.Integer,primary_key=True)
    c_name=db.Column(db.String(),nullable=False)
    c_email=db.Column(db.String(),nullable=False)
    c_contact=db.Column(db.String(10),nullable=False)

    def __init__(self,data):
        name=data["c_name"]
        email=data["c_email"]
        contact=data["c_contact"]
        self.c_name = name        
        self.c_email = email        
        self.c_contact = contact
    
    def register_user_if_not_exist(self):        
        db_customer = Customer.query.filter(Customer.c_contact == self.c_contact).all()
        if not db_customer:
            db.session.add(self)
            db.session.commit()
            return True
        return False
    
    def get_by_contact(c_contact):        
        db_customer = Customer.query.filter(Customer.c_contact == c_contact).first()
        return db_customer

    def get_by_id(c_ID):        
        db_customer = Customer.query.filter(Customer.c_ID == c_ID).first()
        return db_customer
    
    def updateCustomer(data):
        db_customer= Customer.get_by_id(data["c_ID"])
        if db_customer:
            
            db_customer.c_name=data["c_name"]
        
            db_customer.c_contact=data["c_contact"]
        
            db_customer.c_email=data["c_email"]
            
            db.session.commit()
        return db_customer
    
    def __repr__(self):
        return f"<Customer {self.c_contact}>"