migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.listRule = "@request.auth.id = follower.id || @request.auth.id = following.id"
  collection.viewRule = "@request.auth.id = follower.id || @request.auth.id = following.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
