from uuid import uuid4
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from db import stores, db
from schema import StoreSchema
from models import StoreModel
from sqlalchemy.exc import SQLAlchemyError

bluePrint = Blueprint("stores", __name__, description="Operations on Stores")


@bluePrint.route('/stores/<string:store_id>')
class Store(MethodView):
    @bluePrint.response(200, StoreSchema(many=True))
    def get(self, store_id):
        return store_id

    @bluePrint.response(200, StoreSchema)
    def delete(self, store_id):
        if stores.get(store_id) != None:
            del stores[store_id]
            return {"message": "Item Deleted"}
        else:
            return abort(404, message=f"Store with store_id({store_id}) not found")

    def put(self, store_id):
        return {"message": "Item Updated"}


@bluePrint.route('/stores')
class StoreList(MethodView):
    @bluePrint.response(200, StoreSchema(many=True))
    def get(self):
        stores = StoreModel.query.all()
        return stores

    @bluePrint.arguments(StoreSchema)
    @bluePrint.response(200, StoreSchema)
    def post(self, store_data):
        # for store in stores.values():
        #     if store.get('name') == store_data.get('name'):
        #         abort(400, message=f"🚫 ⇢ Store with the name {store_data.get('name')} already exists. 🥺")
        
        # stores[uuid4().hex] = store_data
        # print(stores)

        store = StoreModel(**store_data)
        # print(store_data, "++++++ Here ===>>")

        try:
            db.session.add(store)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="Unable to add store")
        return {
            "message": "Store created Successfully 👍🏼",
            "data": store_data
        }
