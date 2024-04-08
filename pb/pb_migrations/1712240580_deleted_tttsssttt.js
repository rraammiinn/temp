/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("2dmnut4yg70rj3c");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "2dmnut4yg70rj3c",
    "created": "2023-09-22 17:15:40.068Z",
    "updated": "2023-09-22 17:15:40.068Z",
    "name": "tttsssttt",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bxemanfu",
        "name": "sides",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 2,
          "maxSelect": 2,
          "displayFields": []
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_Elcjurn` ON `tttsssttt` (`sides`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
