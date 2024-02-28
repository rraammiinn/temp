/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4x11g0qexvk47er")

  collection.indexes = [
    "CREATE INDEX `idx_MOivtTV` ON `channelMessages` (\n  `channel`,\n  `text`,\n  `created`\n)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q9b4xpda",
    "name": "files",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 99,
      "maxSize": 5242880000,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4x11g0qexvk47er")

  collection.indexes = []

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q9b4xpda",
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
