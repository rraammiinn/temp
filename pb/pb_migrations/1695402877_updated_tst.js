migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tl66kid1",
    "name": "sides",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": 2,
      "maxSelect": 2,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  // remove
  collection.schema.removeField("tl66kid1")

  return dao.saveCollection(collection)
})
