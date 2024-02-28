/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jq36sjkt311u0x6")

  collection.createRule = "@request.auth.id = follower && @request.auth.verified = true"
  collection.updateRule = "@request.auth.id = follower && @request.auth.verified = true"
  collection.deleteRule = "@request.auth.id = follower && @request.auth.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jq36sjkt311u0x6")

  collection.createRule = "@request.auth.id = follower"
  collection.updateRule = "@request.auth.id = follower"
  collection.deleteRule = "@request.auth.id = follower"

  return dao.saveCollection(collection)
})
