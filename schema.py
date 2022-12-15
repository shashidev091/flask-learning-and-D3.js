from marshmallow import Schema, fields


class PlainItemSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    price = fields.Float(required=True)


class PlainTagSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)


class ItemUpdateSchema(Schema):
    name = fields.Str()
    price = fields.Float()


class PlainStoreSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)


class ItemSchema(PlainItemSchema):
    store_id = fields.Int(required=True, load_only=True)
    store = fields.Nested(PlainItemSchema(), dump_only=True)


class StoreSchema(PlainStoreSchema):
    items = fields.List(fields.Nested(PlainStoreSchema()), dump_only=True)
    tags = fields.List(fields.Nested(PlainTagSchema()), dump_only=True)


class TagSchema(PlainStoreSchema):
    store_id = fields.Int(load_only=True)
    store = fields.Nested(PlainStoreSchema(), dump_only=True)


class UserSchema(Schema):
    user_id = fields.Int(dump_only=True)
    user_first_name = fields.Str(required=True)
    user_middle_name = fields.Str(required=True)
    user_last_name = fields.Str(required=True)
    user_email = fields.Str(required=True)
    user_phone = fields.Str(required=True)
    user_gender = fields.Str(required=True)
    user_password = fields.Str(required=True, load_only=True)


class CredentialSchema(Schema):
    user_email = fields.Str(required=True, load_only=True)
    user_password = fields.Str(required=True, load_only=True)
