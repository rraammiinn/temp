/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.indexes = [
    "CREATE INDEX `idx_pLDFi5T` ON `chatMessages` (`from`)",
    "CREATE INDEX `idx_ASEf8TY` ON `chatMessages` (`to`)",
    "CREATE INDEX `idx_6RzbF7P` ON `chatMessages` (`text`)",
    "CREATE INDEX `idx_yh6voSM` ON `chatMessages` (`created`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qf5gsrfd",
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
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.indexes = [
    "CREATE INDEX `idx_pLDFi5T` ON `chatMessages` (`from`)",
    "CREATE INDEX `idx_ASEf8TY` ON `chatMessages` (`to`)",
    "CREATE UNIQUE INDEX `idx_Dx7zuvZ` ON `chatMessages` (`created`)",
    "CREATE INDEX `idx_6RzbF7P` ON `chatMessages` (`text`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qf5gsrfd",
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
})
