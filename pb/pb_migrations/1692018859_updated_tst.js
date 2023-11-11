migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "atixficz",
    "name": "name",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ybcfzsqf",
    "name": "field",
    "type": "select",
    "required": false,
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fip0xran",
    "name": "l",
    "type": "url",
    "required": false,
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "atixficz",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
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

  // update
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
})
