/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.createRule = "@request.auth.id = from && @request.auth.verified = true"
  collection.updateRule = "@request.auth.id = from && @request.auth.verified = true"
  collection.deleteRule = "@request.auth.id = from && @request.auth.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.createRule = "@request.auth.id = from"
  collection.updateRule = "@request.auth.id = from"
  collection.deleteRule = "@request.auth.id = from"

  return dao.saveCollection(collection)
})
