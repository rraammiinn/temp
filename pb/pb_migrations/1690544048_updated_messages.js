migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "44dqjeg1",
    "name": "from",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "44dqjeg1",
    "name": "from",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "id",
        "name",
        "username"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
