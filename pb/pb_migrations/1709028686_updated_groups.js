/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c6ptx6r7mg3vdl7")

  collection.createRule = "owner = @request.auth.id"
  collection.updateRule = "owner = @request.auth.id"
  collection.deleteRule = "owner = @request.auth.id"
  collection.indexes = [
    "CREATE INDEX `idx_2NXwp7x` ON `groups` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c6ptx6r7mg3vdl7")

  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""
  collection.indexes = []

  return dao.saveCollection(collection)
})
