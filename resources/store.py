from uuid import uuid4
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from db import stores


bluePrint = Blueprint("stores", __name__, description="Operations on Stores")


@bluePrint.route('/stores/<string:store_id>')
class Store(MethodView):
    def get(self, store_id):
        return store_id

    def delete(self, store_id):
        return {"message": "Item Deleted"}

    def put(self, store_id):
        return {"message": "Item Updated"}


@bluePrint.route('/store')
class StoreList(MethodView):
    def get(self):
        return {"store": list(stores.values())}

    def post(self):
        return request.get_json()
