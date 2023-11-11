migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.name = "chatMessages"
  collection.indexes = [
    "CREATE INDEX `idx_pLDFi5T` ON `chatMessages` (`from`)",
    "CREATE INDEX `idx_ASEf8TY` ON `chatMessages` (`to`)",
    "CREATE UNIQUE INDEX `idx_Dx7zuvZ` ON `chatMessages` (`created`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.name = "messages"
  collection.indexes = [
    "CREATE INDEX `idx_pLDFi5T` ON `messages` (`from`)",
    "CREATE INDEX `idx_ASEf8TY` ON `messages` (`to`)",
    "CREATE UNIQUE INDEX `idx_Dx7zuvZ` ON `messages` (`created`)"
  ]

  return dao.saveCollection(collection)
})
