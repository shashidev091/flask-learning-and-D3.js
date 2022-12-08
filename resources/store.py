from uuid import uuid4
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from db import stores
from schema import StoreSchema


bluePrint = Blueprint("stores", __name__, description="Operations on Stores")


@bluePrint.route('/stores/<string:store_id>')
class Store(MethodView):
    def get(self, store_id):
        return store_id

    def delete(self, store_id):
        return {"message": "Item Deleted"}

    def put(self, store_id):
        return {"message": "Item Updated"}


@bluePrint.route('/stores')
class StoreList(MethodView):
    @bluePrint.response(200, StoreSchema)
    def get(self):
        return {"store": list(stores.values())}

    @bluePrint.arguments(StoreSchema)
    @bluePrint.response(200, StoreSchema)
    def post(self, store_data):
        for store in stores.values():
            if store.get('name') == store_data.get('name'):
                abort(400, message=f"🚫 ⇢ Store with the name {store_data.get('name')} already exists. 🥺")
        
        stores[uuid4().hex] = store_data
        print(stores)
        return {
            "message": "Store created Successfully 👍🏼",
            "data": store_data
        }
