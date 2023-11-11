migrate((db) => {
  const collection = new Collection({
    "id": "ytayg7zfcl2l50u",
    "created": "2023-09-04 07:35:21.642Z",
    "updated": "2023-09-04 07:35:21.642Z",
    "name": "gmems",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "uyxqcuzu",
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
        "id": "lxx1sfix",
        "name": "group",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "c6ptx6r7mg3vdl7",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "ckgkv4u4",
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
  const collection = dao.findCollectionByNameOrId("ytayg7zfcl2l50u");

  return dao.deleteCollection(collection);
})
