/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.createRule = "(@request.auth.id = follower || @request.auth.id = following) && @request.auth.verified = true"
  collection.updateRule = "@request.auth.id = follower && @request.auth.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.createRule = "@request.auth.id = follower || @request.auth.id = following"
  collection.updateRule = "@request.auth.id = follower"

  return dao.saveCollection(collection)
})
