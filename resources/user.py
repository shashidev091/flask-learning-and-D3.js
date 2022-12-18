from flask.views import MethodView
from flask_jwt_extended import create_access_token
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models import UserModel
from schema import UserSchema, CredentialSchema, ForgetPassword, OtpSchema

bluePrint = Blueprint("users", __name__, description="Operations on User")


@bluePrint.route("/login")
class User(MethodView):
    @bluePrint.arguments(CredentialSchema)
    def post(self, user_credentials):
        user = UserModel.query.filter(
            UserModel.user_email == user_credentials["user_email"]).first()
        if user and pbkdf2_sha256.verify(user_credentials["user_password"], user.user_password):
            access_token = create_access_token(identity=user.user_id)

            return {"access_token": access_token}, 201

        abort(401)


@bluePrint.route("/register")
class UserRegister(MethodView):
    @bluePrint.arguments(UserSchema)
    def post(self, user_data):
        found_user = UserModel.query.filter(UserModel.user_email == user_data["user_email"]).first()
        if not found_user:
            user_data["user_password"] = pbkdf2_sha256.hash(user_data["user_password"])
            user = UserModel(**user_data)

            try:
                db.session.add(user)
                db.session.commit()
            except SQLAlchemyError as e:
                abort(500, message=str(e))
        
        return {"message":f"🟢 {user.user_first_name}, Created Successfully"}

@bluePrint.route("/forgetPassword")
class User(MethodView):
    @bluePrint.arguments(ForgetPassword)
    def post(self, user_data):
        user = UserModel.query.filter(
            UserModel.user_email == user_data["user_email"]).first()
        if user.user_phone_number == user_data["user_phone"]:
            print("Sending OTP")
            print("Otp Sent")
            return f"Otp Sent to {user_data['user_phone']}", 201

        abort(401)


@bluePrint.route("/verify-otp")
class User(MethodView):
    @bluePrint.arguments(OtpSchema)
    def post(self, user_data):
        user = UserModel.query.filter(
            UserModel.user_email == user_data["user_email"]).first()
        if user.user_phone_number == user_data["user_phone"]:
            if user_data["user_otp"] == "otp":
                return f"Otp VERIFIED", 201

        abort(401)
