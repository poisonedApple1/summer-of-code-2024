from app import db
from sqlalchemy import ForeignKeyConstraint
from models.Customer import Customer
from datetime import datetime,timezone


class Transaction(db.Model):
    __tablename__="transaction"

    t_ID=db.Column(db.Integer,primary_key=True)
    c_ID=db.Column(db.Integer,nullable=False)
    t_date=db.Column(db.String(),nullable=False)
    t_amount=db.Column(db.Integer,nullable=False)
    t_category=db.Column(db.String(),nullable=False)

    __table_args__ = (        
        ForeignKeyConstraint([c_ID], [Customer.c_ID], ondelete='NO ACTION'),        
    )


    def __init__(self,data):
        cust_id=data["c_id"]
        amount=data["t_amount"]
        category=data["t_category"]
        try:
            date=datetime.strptime(data["t_date"], "%m-%d-%Y  %H-%M:%S" )
        except:
            date=datetime.now(timezone.utc)
        try:
            self.c_ID=cust_id
            self.t_date=date
            self.t_amount=amount
            self.t_category=category
        except KeyError:
            print(KeyError)

    
    def register_transaction_if_not_exist(self):
        db_transaction = Transaction.query.filter(Transaction.t_ID == self.t_ID).all()
        if not db_transaction:
            db.session.add(self)
            db.session.commit()
            return True
        return False
      

   
    def get_by_tID(tID):        
        db_transaction = Transaction.query.filter(Transaction.t_ID == tID).first()
        return db_transaction

    def __repr__(self):
        return f"<transaction {self.c_contact}>"