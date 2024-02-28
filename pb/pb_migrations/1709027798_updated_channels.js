/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7joruwhobymydjb")

  collection.createRule = "owner = @request.auth.id"
  collection.updateRule = "owner = @request.auth.id"
  collection.deleteRule = "owner = @request.auth.id"
  collection.indexes = [
    "CREATE INDEX `idx_Fohj3A5` ON `channels` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7joruwhobymydjb")

  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""
  collection.indexes = []

  return dao.saveCollection(collection)
})
