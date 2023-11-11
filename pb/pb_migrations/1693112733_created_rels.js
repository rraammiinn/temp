migrate((db) => {
  const collection = new Collection({
    "id": "u93t9phvk7f8ydj",
    "created": "2023-08-27 05:05:33.201Z",
    "updated": "2023-08-27 05:05:33.201Z",
    "name": "rels",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bye2dtzs",
        "name": "follower",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "1dymoivr",
        "name": "following",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
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
  const collection = dao.findCollectionByNameOrId("u93t9phvk7f8ydj");

  return dao.deleteCollection(collection);
})
