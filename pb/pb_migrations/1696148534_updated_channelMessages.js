migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4x11g0qexvk47er")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.id = channel.owner"
  collection.updateRule = "@request.auth.id = channel.owner"
  collection.deleteRule = "@request.auth.id = channel.owner"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4x11g0qexvk47er")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
