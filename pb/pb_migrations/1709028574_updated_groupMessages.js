/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.createRule = "from = @request.auth.id"
  collection.updateRule = "from = @request.auth.id"
  collection.deleteRule = "from = @request.auth.id"
  collection.indexes = [
    "CREATE INDEX `idx_h7MvPY8` ON `groupMessages` (\n  `group`,\n  `created`\n)",
    "CREATE INDEX `idx_h7B576T` ON `groupMessages` (`text`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8w2aahbg",
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
    "id": "zms257bz",
    "name": "files",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 999,
      "maxSize": 1099511627776,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""
  collection.indexes = [
    "CREATE INDEX `idx_h7MvPY8` ON `groupMessages` (\n  `group`,\n  `created`\n)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8w2aahbg",
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
    "id": "zms257bz",
    "name": "files",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 99,
      "maxSize": 5242880,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
