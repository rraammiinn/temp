/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.indexes = [
    "CREATE INDEX `idx_h7MvPY8` ON `groupMessages` (\n  `group`,\n  `created`\n)",
    "CREATE INDEX `idx_h7B576T` ON `groupMessages` (`text`)",
    "CREATE INDEX `idx_eOuvbc9` ON `groupMessages` (`updated`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.indexes = [
    "CREATE INDEX `idx_h7MvPY8` ON `groupMessages` (\n  `group`,\n  `created`\n)",
    "CREATE INDEX `idx_h7B576T` ON `groupMessages` (`text`)"
  ]

  return dao.saveCollection(collection)
})
