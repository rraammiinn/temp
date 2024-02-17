/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jq36sjkt311u0x6")

  collection.listRule = "@request.auth.id = follower"
  collection.viewRule = "@request.auth.id = follower"
  collection.createRule = "@request.auth.id = follower"
  collection.updateRule = "@request.auth.id = follower"
  collection.deleteRule = "@request.auth.id = follower"
  collection.indexes = [
    "CREATE INDEX `idx_4VidiNE` ON `contacts` (\n  `follower`,\n  `following`\n)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vu3adhzk",
    "name": "follower",
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
    "id": "umuvczvn",
    "name": "following",
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
  const collection = dao.findCollectionByNameOrId("jq36sjkt311u0x6")

  collection.listRule = "@request.auth.id = follower.id"
  collection.viewRule = "@request.auth.id = follower.id"
  collection.createRule = "@request.auth.id = follower.id"
  collection.updateRule = "@request.auth.id = follower.id"
  collection.deleteRule = "@request.auth.id = follower.id"
  collection.indexes = []

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vu3adhzk",
    "name": "follower",
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
    "id": "umuvczvn",
    "name": "following",
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
