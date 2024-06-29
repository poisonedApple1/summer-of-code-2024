from best_app.database import db

class Customer(db.Model):
    __tablename__="Customer"

    c_ID=db.Column(db.Integer,primary_key=True,autoIncrement=True)
    c_name=db.Column(db.String(),nullable=False)
    c_email=db.Column(db.String(),nullable=False)
    c_contact=db.Column(db.Integer,nullable=False)

    def __init__(self, c_name, c_email, c_contact):
        self.c_name = c_name        
        self.c_email = c_email        
        self.c_contact = c_contact
    
    def register_user_if_not_exist(self):        
        db_customer = Customer.query.filter(Customer.c_contact == self.c_contact).all()
        if not db_customer:
            db.session.add(self)
            db.session.commit()
        
        return True
    
    def get_by_contact(c_contact):        
        db_customer = Customer.query.filter(Customer.c_contact == c_contact).first()
        return db_customer

    def __repr__(self):
        return f"<Customer {self.c_contact}>"