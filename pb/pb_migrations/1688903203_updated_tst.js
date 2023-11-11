migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  collection.createRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc")

  collection.createRule = ""

  return dao.saveCollection(collection)
})
