/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c6ptx6r7mg3vdl7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cbwhx3mk",
    "name": "blocklist",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c6ptx6r7mg3vdl7")

  // remove
  collection.schema.removeField("cbwhx3mk")

  return dao.saveCollection(collection)
})
