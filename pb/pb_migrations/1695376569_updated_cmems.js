migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  collection.name = "channelMembers"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4")

  collection.name = "cmems"

  return dao.saveCollection(collection)
})
