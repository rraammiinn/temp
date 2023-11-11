migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.id = follower.id"
  collection.updateRule = "@request.auth.id = follower.id"
  collection.deleteRule = "@request.auth.id = follower.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
