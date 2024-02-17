/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.listRule = "@request.auth.id = from || @request.auth.id = to"
  collection.viewRule = "@request.auth.id = from || @request.auth.id = to"
  collection.createRule = "@request.auth.id = from"
  collection.updateRule = "@request.auth.id = from"
  collection.deleteRule = "@request.auth.id = from"
  collection.indexes = [
    "CREATE INDEX `idx_pLDFi5T` ON `chatMessages` (`from`)",
    "CREATE INDEX `idx_ASEf8TY` ON `chatMessages` (`to`)",
    "CREATE UNIQUE INDEX `idx_Dx7zuvZ` ON `chatMessages` (`created`)",
    "CREATE INDEX `idx_6RzbF7P` ON `chatMessages` (`text`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "44dqjeg1",
    "name": "from",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "h8vy1b3h",
    "name": "to",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.listRule = "@request.auth.id = from.id || @request.auth.id = to.id"
  collection.viewRule = "@request.auth.id = from.id || @request.auth.id = to.id"
  collection.createRule = "@request.auth.id = from.id"
  collection.updateRule = "@request.auth.id = from.id"
  collection.deleteRule = "@request.auth.id = from.id"
  collection.indexes = [
    "CREATE INDEX `idx_pLDFi5T` ON `chatMessages` (`from`)",
    "CREATE INDEX `idx_ASEf8TY` ON `chatMessages` (`to`)",
    "CREATE UNIQUE INDEX `idx_Dx7zuvZ` ON `chatMessages` (`created`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "44dqjeg1",
    "name": "from",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "h8vy1b3h",
    "name": "to",
    "type": "relation",
    "required": true,
    "presentable": false,
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
})
