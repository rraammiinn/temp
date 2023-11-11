migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zudk3gxs",
    "name": "lastseen",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  // remove
  collection.schema.removeField("zudk3gxs")

  return dao.saveCollection(collection)
})
