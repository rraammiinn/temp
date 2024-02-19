/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7joruwhobymydjb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lkwcutl4",
    "name": "members",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7joruwhobymydjb")

  // remove
  collection.schema.removeField("lkwcutl4")

  return dao.saveCollection(collection)
})
