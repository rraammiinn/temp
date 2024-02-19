/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4x11g0qexvk47er")

  collection.createRule = "@request.auth.id = channel.owner.id"
  collection.updateRule = "@request.auth.id = channel.owner.id"
  collection.deleteRule = "@request.auth.id = channel.owner.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4x11g0qexvk47er")

  collection.createRule = "@request.auth.id = channel.owner"
  collection.updateRule = "@request.auth.id = channel.owner"
  collection.deleteRule = "@request.auth.id = channel.owner"

  return dao.saveCollection(collection)
})
