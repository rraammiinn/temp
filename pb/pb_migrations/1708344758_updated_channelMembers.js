/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  // remove
  collection.schema.removeField("gpabaerw")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gpabaerw",
    "name": "active",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
