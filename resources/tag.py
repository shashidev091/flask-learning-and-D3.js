from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models import TagModel, StoreModel
from schema import TagSchema

bluePrint = Blueprint('Tags', __name__, description="Operations on tags")


bluePrint.route("/store/<string:store_id>/tag")
class TagsInStore(MethodView):
    @bluePrint.response(200, TagSchema(many=True))
    def get(self, store_id):
        store = StoreModel.query.get_or_404(store_id)

        return store.tags.all()

    
    @bluePrint.arguments(TagSchema)
    @bluePrint.response(200, TagSchema)
    def post(self, tag_data, store_id):
        # if TagModel.query.filter(TagModel.store.store_id == store_id, TagModel.name == tag_data["name"]).first():
        #     abort(400, message="A tag with the name already exists in that store")

        tag = TagModel(**tag_data, store_id= store_id)

        try:
            db.session.add(tag)
            db.session.commit()
        except SQLAlchemyError as e:
            return abort(500, message=str(e))
        
        return tag  