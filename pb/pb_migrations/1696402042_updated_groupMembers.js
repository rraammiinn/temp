migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ytayg7zfcl2l50u")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ytayg7zfcl2l50u")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
