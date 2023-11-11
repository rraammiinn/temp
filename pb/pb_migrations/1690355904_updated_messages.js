migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.listRule = "@request.auth.id = from.id || @request.auth.id = to.id"
  collection.viewRule = "@request.auth.id = from.id || @request.auth.id = to.id"
  collection.createRule = "@request.auth.id = from.id"
  collection.updateRule = "@request.auth.id = from.id"
  collection.deleteRule = "@request.auth.id = from.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
