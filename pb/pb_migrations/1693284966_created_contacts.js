migrate((db) => {
  const collection = new Collection({
    "id": "jq36sjkt311u0x6",
    "created": "2023-08-29 04:56:06.878Z",
    "updated": "2023-08-29 04:56:06.878Z",
    "name": "contacts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vu3adhzk",
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
        "id": "umuvczvn",
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
    "listRule": "@request.auth.id = follower.id",
    "viewRule": "@request.auth.id = follower.id",
    "createRule": "@request.auth.id = follower.id",
    "updateRule": "@request.auth.id = follower.id",
    "deleteRule": "@request.auth.id = follower.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("jq36sjkt311u0x6");

  return dao.deleteCollection(collection);
})
