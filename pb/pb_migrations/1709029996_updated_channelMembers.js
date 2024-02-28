/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  collection.createRule = "@request.auth.id = mem && @request.auth.verified = true"
  collection.updateRule = "@request.auth.id = mem && @request.auth.verified = true"
  collection.deleteRule = "@request.auth.id = mem && @request.auth.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  collection.createRule = "@request.auth.id = mem"
  collection.updateRule = "@request.auth.id = mem"
  collection.deleteRule = "@request.auth.id = mem"

  return dao.saveCollection(collection)
})
