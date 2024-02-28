/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.indexes = [
    "CREATE INDEX `idx_pLDFi5T` ON `chatMessages` (\n  `from`,\n  `to`,\n  `created`\n)",
    "CREATE INDEX `idx_6RzbF7P` ON `chatMessages` (`text`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.indexes = [
    "CREATE INDEX `idx_pLDFi5T` ON `chatMessages` (`from`)",
    "CREATE INDEX `idx_ASEf8TY` ON `chatMessages` (`to`)",
    "CREATE INDEX `idx_6RzbF7P` ON `chatMessages` (`text`)",
    "CREATE INDEX `idx_yh6voSM` ON `chatMessages` (`created`)"
  ]

  return dao.saveCollection(collection)
})
