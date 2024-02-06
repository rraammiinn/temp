/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.createRule = "@request.auth.id ?= @request.data.group.blocklist"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.createRule = "not(@request.auth.id:each ?= @request.data.group.blocklist)"

  return dao.saveCollection(collection)
})
