/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.createRule = "@request.data.group.blocklist ?= @request.data.from"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.createRule = "@request.data.group.blocklist:each ?= @request.data.from"

  return dao.saveCollection(collection)
})
