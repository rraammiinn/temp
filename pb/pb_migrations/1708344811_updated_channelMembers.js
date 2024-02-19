/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  collection.listRule = "@request.auth.id = mem.id"
  collection.viewRule = "@request.auth.id = mem.id"
  collection.createRule = "@request.auth.id = mem.id"
  collection.updateRule = "@request.auth.id = mem.id"
  collection.deleteRule = "@request.auth.id = mem.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  collection.listRule = "@request.auth.id = mem"
  collection.viewRule = "@request.auth.id = mem"
  collection.createRule = "@request.auth.id = mem"
  collection.updateRule = "@request.auth.id = mem"
  collection.deleteRule = "@request.auth.id = mem"

  return dao.saveCollection(collection)
})
