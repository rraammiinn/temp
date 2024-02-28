/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4x11g0qexvk47er")

  collection.indexes = [
    "CREATE INDEX `idx_MOivtTV` ON `channelMessages` (\n  `channel`,\n  `created`\n)",
    "CREATE INDEX `idx_D7SrB6A` ON `channelMessages` (`text`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4x11g0qexvk47er")

  collection.indexes = [
    "CREATE INDEX `idx_MOivtTV` ON `channelMessages` (\n  `channel`,\n  `text`,\n  `created`\n)"
  ]

  return dao.saveCollection(collection)
})
