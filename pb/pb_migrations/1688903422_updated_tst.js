migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  collection.listRule = "@request.auth.email = 'shameraheyaran.gmail.com'"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  collection.listRule = null

  return dao.saveCollection(collection)
})
