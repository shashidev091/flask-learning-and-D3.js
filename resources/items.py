from uuid import uuid4
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from db import items


bluePrint = Blueprint('items', __name__, description="items of Operations")

@bluePrint.route("/items")
class Items(MethodView):
    def get(self):
        return {"items": items}

    def post(self):
        request_item = request.get_json()
        teest = {}
        for item in teest:
            print("jskdfj")
        for item in items.values():
            print("asjdkasd ")
            if item.get('item') == request_item.get('item'):
                return abort(400, message="Item already present in the list")

        print(items.values())
        return "It ended here"


@bluePrint.route("/items/<string:item_id>")
class Item(MethodView):
    def get(self, item_id):
        for item in items.values():
            print(item)
            if item['item_id'] == item_id:
                return item
            else:
                return abort(404, message="Item not found.")


    def put(self, item_id):
        item_request = request.get_json()
        for item in items:
            if item["item_id"] == item_id:
                item.update(item_request)
                return item
            else:
                return abort(404, message="Item trying to update not found.")
