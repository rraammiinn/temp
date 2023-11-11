migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  collection.indexes = []

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_u1EUBZe` ON `tst` (`name`)"
  ]

  return dao.saveCollection(collection)
})
