migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0srmckar",
    "name": "image",
    "type": "file",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1000,
      "maxSize": 1000000000000000,
      "mimeTypes": [
        "image/svg+xml",
        "image/vnd.mozilla.apng",
        "image/png",
        "image/jpeg",
        "image/x-icon",
        "image/gif"
      ],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0srmckar",
    "name": "image",
    "type": "file",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1000,
      "maxSize": 1000000000000000,
      "mimeTypes": [
        "image/svg+xml",
        "image/vnd.mozilla.apng",
        "image/png",
        "image/jpeg",
        "image/x-icon"
      ],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
