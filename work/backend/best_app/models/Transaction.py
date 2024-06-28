from best_app.database import db
from sqlalchemy import ForeignKeyConstraint
from best_app.models import Customer

class Transaction(db.Model):
    __tablename__="Transaction"

    t_ID=db.Column(db.Integer,primary_key=True,autoIncrement=True)
    c_ID=db.Column(db.Integer,nullable=False)
    t_date=db.Column(db.Integer,nullable=False)
    t_amount=db.Column(db.Integer,nullable=False)
    t_category=db.Column(db.String(),nullable=False)

    __table_args__ = (        
        ForeignKeyConstraint([c_ID], [Customer.c_ID], ondelete='NO ACTION'),        
    )


    def __init__(self, c_ID,date,amt,cat):
        self.c_ID=c_ID
        self.t_date=date
        self.t_amount=amt
        self.t_category=cat    

   
    def get_by_tID(tID):        
        db_transaction = Transaction.query.filter(Transaction.t_ID == tID).first()
        return db_transaction

    def __repr__(self):
        return f"<transaction {self.c_contact}>"