/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.createRule = "(@request.auth.id = follower || @request.auth.id = following) && @request.auth.verified = true && @request.data.follower != @request.data.following"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.createRule = "(@request.auth.id = follower || @request.auth.id = following) && @request.auth.verified = true"

  return dao.saveCollection(collection)
})
