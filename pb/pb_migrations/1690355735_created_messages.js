migrate((db) => {
  const collection = new Collection({
    "id": "sw738on8n5iqdj7",
    "created": "2023-07-26 07:15:35.372Z",
    "updated": "2023-07-26 07:15:35.372Z",
    "name": "messages",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "44dqjeg1",
        "name": "from",
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
        "id": "h8vy1b3h",
        "name": "to",
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
        "id": "t8dttqpf",
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
        "id": "y3zaeyfu",
        "name": "seen",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_pLDFi5T` ON `messages` (`from`)",
      "CREATE UNIQUE INDEX `idx_ASEf8TY` ON `messages` (`to`)",
      "CREATE UNIQUE INDEX `idx_Dx7zuvZ` ON `messages` (`created`)"
    ],
    "listRule": "@request.auth.id = from || @request.auth.id = to",
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sw738on8n5iqdj7");

  return dao.deleteCollection(collection);
})
