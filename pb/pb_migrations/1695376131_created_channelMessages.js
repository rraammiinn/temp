migrate((db) => {
  const collection = new Collection({
    "id": "4x11g0qexvk47er",
    "created": "2023-09-22 09:48:51.706Z",
    "updated": "2023-09-22 09:48:51.706Z",
    "name": "channelMessages",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fx8qgrpe",
        "name": "channel",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "7joruwhobymydjb",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "exmb5v9o",
        "name": "text",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "q9b4xpda",
        "name": "files",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 99,
          "maxSize": 5242880,
          "mimeTypes": [],
          "thumbs": [],
          "protected": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4x11g0qexvk47er");

  return dao.deleteCollection(collection);
})
