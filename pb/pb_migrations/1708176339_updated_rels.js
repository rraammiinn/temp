/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.listRule = "@request.auth.id = follower || @request.auth.id = following"
  collection.viewRule = "@request.auth.id = follower || @request.auth.id = following"
  collection.createRule = "@request.auth.id = follower || @request.auth.id = following"
  collection.updateRule = "@request.auth.id = follower"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bye2dtzs",
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
    "id": "1dymoivr",
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
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.listRule = "@request.auth.id = follower.id || @request.auth.id = following.id"
  collection.viewRule = "@request.auth.id = follower.id || @request.auth.id = following.id"
  collection.createRule = "@request.auth.id = follower.id || @request.auth.id = following.id"
  collection.updateRule = "@request.auth.id = follower.id"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bye2dtzs",
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
    "id": "1dymoivr",
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
