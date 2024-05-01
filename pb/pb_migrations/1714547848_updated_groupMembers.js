/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ytayg7zfcl2l50u")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_d3gCQdz` ON `groupMembers` (\n  `group`,\n  `mem`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ytayg7zfcl2l50u")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_EHtidLj` ON `groupMembers` (\n  `mem`,\n  `group`\n)"
  ]

  return dao.saveCollection(collection)
})
