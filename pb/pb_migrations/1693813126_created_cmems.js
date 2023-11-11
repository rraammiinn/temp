migrate((db) => {
  const collection = new Collection({
    "id": "3udf5n9ifbxgvl4",
    "created": "2023-09-04 07:38:46.306Z",
    "updated": "2023-09-04 07:38:46.306Z",
    "name": "cmems",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "dmboe01v",
        "name": "mem",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "e0b4219b",
        "name": "fieldchannel",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "7joruwhobymydjb",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "njmjagf7",
        "name": "lastseen",
        "type": "date",
        "required": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id = mem",
    "viewRule": "@request.auth.id = mem",
    "createRule": "@request.auth.id = mem",
    "updateRule": "@request.auth.id = mem",
    "deleteRule": "@request.auth.id = mem",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3udf5n9ifbxgvl4");

  return dao.deleteCollection(collection);
})
