/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.createRule = "from = @request.auth.id && @request.auth.verified = true"
  collection.updateRule = "from = @request.auth.id && @request.auth.verified = true"
  collection.deleteRule = "from = @request.auth.id && @request.auth.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.createRule = "from = @request.auth.id"
  collection.updateRule = "from = @request.auth.id"
  collection.deleteRule = "from = @request.auth.id"

  return dao.saveCollection(collection)
})
