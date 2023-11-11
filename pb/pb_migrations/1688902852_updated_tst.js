migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  collection.listRule = "@request.method = 'GET' && @request.auth.id = '64ak5e0vrkb3rpo'"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  collection.listRule = null

  return dao.saveCollection(collection)
})
