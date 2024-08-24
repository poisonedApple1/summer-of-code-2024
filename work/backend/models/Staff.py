from app import db,bcrypt
from flask_login import UserMixin

class Staff(UserMixin,db.Model):
    
    __tablename__="staff"

    s_ID=db.Column(db.Integer,primary_key=True)
    s_name=db.Column(db.String(),nullable=False)
    s_email=db.Column(db.String(),nullable=False)
    s_isAdmin=db.Column(db.Boolean,nullable=False)
    s_contact=db.Column(db.String(),nullable=False)
    s_password=db.Column(db.String(),nullable=False)

    def get_id(self):
        return self.s_ID
    


    def __init__(self,data):
        print(data)
        s_name=data["s_name"]
        s_email=data["s_email"]
        s_isAdmin=data["s_isAdmin"]
        s_contact=data["s_contact"]
        s_password=data["s_password"]
        self.s_name = s_name      
        self.s_email = s_email     
        self.s_isAdmin=s_isAdmin   
        self.s_contact = s_contact
        self.s_password=bcrypt.generate_password_hash(s_password).decode('utf-8')
    
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
    
    def get_by_id(s_ID):        
        db_staff = Staff.query.filter(Staff.s_ID == s_ID).first()
        return db_staff
    
    def staffCount():
        count=db.session.query(Staff).count()
        return count
    
    def fetchStaff(offset):
        data=Staff.query.offset(offset).limit(10).all()
        staffList=[{'s_ID': staff.s_ID,
                    's_name': staff.s_name,
                    's_isAdmin':staff.s_isAdmin,
                    's_contact':staff.s_contact,
                    's_email':staff.s_email} for staff in data]
        return staffList

    def updateStaff(data):
        db_staff= Staff.get_by_id(data["s_ID"])
        if db_staff:
            
            db_staff.s_name=data["s_name"]
        
            
            db_staff.s_isAdmin=data["s_isAdmin"]
        
            db_staff.s_contact=data["s_contact"]
        
            db_staff.s_email=data["s_email"]
            
            db.session.commit()
        return db_staff
    

    
    def __repr__(self):
        return f"<Staff {self.s_contact}>"
    
