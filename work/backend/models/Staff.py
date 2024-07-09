from app import db

class Staff(db.Model):
    
    __tablename__="staff"

    s_ID=db.Column(db.Integer,primary_key=True)
    s_name=db.Column(db.String(),nullable=False)
    s_email=db.Column(db.String(),nullable=False)
    s_isAdmin=db.Column(db.Boolean,nullable=False)
    s_contact=db.Column(db.Integer,nullable=False)
    s_password=db.Column(db.String(),nullable=False)

    def __init__(self,data):
        s_name=data["s_name"]
        s_email=data["s_email"]
        s_isAdmin=data["s_isAdmin"]
        s_contact=data["s_contact"]
        s_password=data["s_password"]
        self.s_name = s_name      
        self.s_email = s_email     
        self.s_isAdmin=s_isAdmin   
        self.s_contact = s_contact
        self.s_password=s_password
    
    def register_user_if_not_exist(self):        
        db_staff = Staff.query.filter(Staff.s_contact == self.s_contact).all()
        if not db_staff:
            db.session.add(self)
            db.session.commit()
            return True
        return False
    
    def get_by_contact(s_contact):        
        db_staff = Staff.query.filter(Staff.s_contact == s_contact).first()
        return db_staff

    def __repr__(self):
        return f"<Staff {self.s_contact}>"