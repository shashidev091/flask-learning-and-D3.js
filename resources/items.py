from uuid import uuid4
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from db import items, db
from schema import ItemSchema, ItemUpdateSchema
from models import ItemModel
from sqlalchemy.exc import SQLAlchemyError


bluePrint = Blueprint('items', __name__, description="items of Operations")


@bluePrint.route("/items")
class Items(MethodView):
    @bluePrint.response(200, ItemSchema(many=True))
    def get(self):
        items = ItemModel.query.all()
        return items

    @bluePrint.arguments(ItemSchema)
    @bluePrint.response(200, ItemSchema)
    def post(self, item_data):
        # for item in items.values():
        #     print("asjdkasd ")
        #     if item.get('item') == item_data.get('item'):
        #         return abort(400, message="Item already present in the list")

        # items[uuid4().hex] = item_data

        item = ItemModel(**item_data)

        try:
            db.session.add(item)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="An error occured while inserting the item")
        return item


@bluePrint.route("/items/<string:item_id>")
class Item(MethodView):
    @bluePrint.response(200, ItemSchema)
    def get(self, item_id):
        item = ItemModel.query.get_or_404(item_id)
        return item

    @bluePrint.arguments(ItemUpdateSchema)
    @bluePrint.response(200, ItemSchema)
    def put(self, item_request, item_id):
        item = ItemModel.query.get(item_id)
        if item:
            item.price = item_request["price"]
            item.name = item_request["name"]
        else:
            item = ItemModel(id=item_id, **item_request)

        db.session.add(item)
        db.session.commit()

        return item

    @bluePrint.response(200, ItemSchema)
    def delete(self, item_id):
        item = ItemModel.query.get(item_id)
        if item:
            db.session.delete(item)
            db.session.commit()
        else:
            return abort(404, message="Item trying to delete does not exist")

        return item
