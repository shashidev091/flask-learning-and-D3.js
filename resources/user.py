from flask.views import MethodView
from flask_jwt_extended import create_access_token
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models import UserModel
from schema import UserSchema, CredentialSchema

bluePrint = Blueprint("users", __name__, description="Operations on User")


@bluePrint.route("/login")
class User(MethodView):
    @bluePrint.arguments(CredentialSchema)
    def post(self, user_credentials):
        user = UserModel.query.filter(
            UserModel.user_email == user_credentials["user_email"]).first()
        if user and pbkdf2_sha256.verify(user.user_password, user_credentials["user_password"]):
            user_token = create_access_token(identity=user.user_id)

            return {"Authorization": user_token}, 201

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
