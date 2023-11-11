migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.deleteRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.deleteRule = "@request.auth.id = follower.id"

  return dao.saveCollection(collection)
})
