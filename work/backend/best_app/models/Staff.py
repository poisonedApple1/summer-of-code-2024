from best_app.database import db

class Staff(db.Model):
    
    __tablename__="Staff"

    s_ID=db.Column(db.Integer,primary_key=True,autoIncrement=True)
    s_name=db.Column(db.String(),nullable=False)
    s_email=db.Column(db.String(),nullable=False)
    s_isAdmin=db.Column(db.Boolean,nullable=False)
    s_contact=db.Column(db.Integer,nullable=False)

    def __init__(self, s_name, s_email,s_isAdmin, s_contact):
        self.s_name = s_name      
        self.s_email = s_email     
        self.s_isAdmin=s_isAdmin   
        self.s_contact = s_contact
    
    def register_user_if_not_exist(self):        
        db_staff = Staff.query.filter(Staff.s_contact == self.s_contact).all()
        if not db_staff:
            db.session.add(self)
            db.session.commit()
        
        return True
    
    def get_by_contact(s_contact):        
        db_staff = Staff.query.filter(Staff.s_contact == s_contact).first()
        return db_staff

    def __repr__(self):
        return f"<Staff {self.s_contact}>"