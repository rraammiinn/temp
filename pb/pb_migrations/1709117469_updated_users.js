/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.updateRule = "id = @request.auth.id && (@request.auth.verified = true || (@request.data.id:isset = false && @request.data.bio:isset = false && @request.data.name:isset = false && @request.data.email:isset =false && @request.data.avatar:isset = false && @request.data.online:isset = false && @request.data.username:isset =false && @request.data.verified:isset = false && @request.data.emailVisibility:isset = false))"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.updateRule = "id = @request.auth.id"

  return dao.saveCollection(collection)
})
