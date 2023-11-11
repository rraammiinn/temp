migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "amjnptqr",
    "name": "j",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ybcfzsqf",
    "name": "field",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 3,
      "values": [
        "a",
        "b",
        "c"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fip0xran",
    "name": "l",
    "type": "url",
    "required": true,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  // remove
  collection.schema.removeField("amjnptqr")

  // remove
  collection.schema.removeField("ybcfzsqf")

  // remove
  collection.schema.removeField("fip0xran")

  return dao.saveCollection(collection)
})
