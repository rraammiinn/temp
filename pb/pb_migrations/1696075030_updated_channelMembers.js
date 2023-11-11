migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_MFGmx3x` ON `channelMembers` (\n  `mem`,\n  `channel`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  collection.indexes = []

  return dao.saveCollection(collection)
})
