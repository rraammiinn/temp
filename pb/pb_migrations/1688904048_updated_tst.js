migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  collection.listRule = "@request.auth.email = name"
  collection.viewRule = "@request.auth.email = name"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
