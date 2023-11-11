migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_q9LBuXr` ON `rels` (\n  `follower`,\n  `following`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.indexes = []

  return dao.saveCollection(collection)
})
