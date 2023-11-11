migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.indexes = [
    "CREATE INDEX `idx_pLDFi5T` ON `messages` (`from`)",
    "CREATE INDEX `idx_ASEf8TY` ON `messages` (`to`)",
    "CREATE UNIQUE INDEX `idx_Dx7zuvZ` ON `messages` (`created`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_pLDFi5T` ON `messages` (`from`)",
    "CREATE UNIQUE INDEX `idx_ASEf8TY` ON `messages` (`to`)",
    "CREATE UNIQUE INDEX `idx_Dx7zuvZ` ON `messages` (`created`)"
  ]

  return dao.saveCollection(collection)
})
