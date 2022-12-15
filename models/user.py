from db import db


class UserModel(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True)
    user_first_name = db.Column(db.String(80), unique=False, nullable=False)
    user_middle_name = db.Column(db.String(80), unique=False, nullable=True)
    user_last_name = db.Column(db.String(80), unique=False, nullable=True)
    user_email = db.Column(db.String(80), unique=True, nullable=False)
    user_phone = db.Column(db.String(15), unique=True, nullable=False)
    user_gender = db.Column(db.String(10), unique=False, nullable=False)
    user_password = db.Column(db.String(255), unique=False, nullable=True)
