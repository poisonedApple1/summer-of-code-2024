from app import db
from sqlalchemy import ForeignKeyConstraint
from models.Customer import Customer
from datetime import datetime,timezone


class Transaction(db.Model):
    __tablename__="transaction"

    t_ID=db.Column(db.Integer,primary_key=True)
    c_ID=db.Column(db.Integer,nullable=True)
    t_date=db.Column(db.String(),nullable=False)
    t_amount=db.Column(db.Integer,nullable=False)
    t_category=db.Column(db.String(),nullable=False)

    __table_args__ = (        
        ForeignKeyConstraint([c_ID], [Customer.c_ID], ondelete='SET NULL'),        
    )


    def __init__(self,data):
        cust_id=data["c_ID"]
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
    
    def get_by_id(t_ID):        
        db_t =Transaction.query.filter(Transaction.t_ID == t_ID).first()
        return db_t
      
    def updateTransaction(data):
        db_t= Transaction.get_by_id(data["t_ID"])
        if db_t:
            
            db_t.c_ID=data["c_ID"]
        
            
            db_t.t_amount=data["t_amount"]
            
            
            db_t.t_category=data["t_category"]
        
            
            db_t.t_date=data["t_date"]
            
            db.session.commit()
        return db_t

   
    def get_by_tID(tID):        
        db_transaction = Transaction.query.filter(Transaction.t_ID == tID).first()
        return db_transaction

    def __repr__(self):
        return f"<transaction {self.c_contact}>"
    
    def transactionCount():
        count=db.session.query(Transaction).count()
        return count
    
    def fetchTransaction(offset):
        data=Transaction.query.offset(offset).limit(10).all()
        transactionList=[{'t_ID': transaction.t_ID,
                    'c_ID': transaction.c_ID,
                    't_amount':transaction.t_amount,
                    't_category':transaction.t_category,
                    't_date':transaction.t_date} for transaction in data]
        return transactionList