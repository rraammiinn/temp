/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "users_avatar",
    "name": "avatar",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/gif",
        "image/webp",
        "image/x-xpixmap",
        "image/vnd.adobe.photoshop",
        "image/vnd.mozilla.apng",
        "image/jxl",
        "image/jp2",
        "image/jpx",
        "image/jpm",
        "image/jxs",
        "image/tiff",
        "image/bmp",
        "image/x-icon",
        "image/vnd.djvu",
        "image/bpg",
        "image/vnd.dwg",
        "image/x-icns",
        "image/heic",
        "image/heic-sequence",
        "image/heif",
        "image/heif-sequence",
        "image/vnd.radiance",
        "image/x-xcf",
        "image/x-gimp-pat"
      ],
      "thumbs": [
        "64x64"
      ],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "users_avatar",
    "name": "avatar",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/gif",
        "image/webp"
      ],
      "thumbs": [
        "64x64"
      ],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
