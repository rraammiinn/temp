/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7joruwhobymydjb")

  collection.createRule = "owner = @request.auth.id && @request.auth.verified = true"
  collection.updateRule = "owner = @request.auth.id && @request.auth.verified = true"
  collection.deleteRule = "owner = @request.auth.id && @request.auth.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7joruwhobymydjb")

  collection.createRule = "owner = @request.auth.id"
  collection.updateRule = "owner = @request.auth.id"
  collection.deleteRule = "owner = @request.auth.id"

  return dao.saveCollection(collection)
})
