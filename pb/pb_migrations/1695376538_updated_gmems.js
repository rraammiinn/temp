migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ytayg7zfcl2l50u")

  collection.name = "groupMembers"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ytayg7zfcl2l50u")

  collection.name = "gmems"

  return dao.saveCollection(collection)
})
