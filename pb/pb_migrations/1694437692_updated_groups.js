migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c6ptx6r7mg3vdl7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jm0gofus",
    "name": "about",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c6ptx6r7mg3vdl7")

  // remove
  collection.schema.removeField("jm0gofus")

  return dao.saveCollection(collection)
})
