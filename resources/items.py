from uuid import uuid4
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from db import items
from schema import ItemSchema, ItemUpdateSchema


bluePrint = Blueprint('items', __name__, description="items of Operations")

@bluePrint.route("/items")
class Items(MethodView):
    @bluePrint.response(200, ItemSchema)
    def get(self):
        return {"items": items}

    @bluePrint.arguments(ItemSchema)
    @bluePrint.response(200, ItemSchema)
    def post(self, item_data):
        for item in items.values():
            print("asjdkasd ")
            if item.get('item') == item_data.get('item'):
                return abort(400, message="Item already present in the list")

        items[uuid4().hex] = item_data
        return items


@bluePrint.route("/items/<string:item_id>")
class Item(MethodView):
    @bluePrint.response(200, ItemSchema)
    def get(self, item_id):
        for item in items.values():
            print(item)
            if item['item_id'] == item_id:
                return item
            else:
                return abort(404, message="Item not found.")


    @bluePrint.arguments(ItemUpdateSchema)
    @bluePrint.response(ItemSchema)
    def put(self, item_id):
        item_request = request.get_json()
        for item in items:
            if item["item_id"] == item_id:
                item.update(item_request)
                return item
            else:
                return abort(404, message="Item trying to update not found.")
