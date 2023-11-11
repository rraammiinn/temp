migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "e0b4219b",
    "name": "channel",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "7joruwhobymydjb",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "e0b4219b",
    "name": "fieldchannel",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "7joruwhobymydjb",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
