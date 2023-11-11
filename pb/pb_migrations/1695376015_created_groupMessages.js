migrate((db) => {
  const collection = new Collection({
    "id": "tnbtnhf2ihhp4r8",
    "created": "2023-09-22 09:46:55.628Z",
    "updated": "2023-09-22 09:46:55.628Z",
    "name": "groupMessages",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "8w2aahbg",
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
        "id": "ornm0io5",
        "name": "group",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "c6ptx6r7mg3vdl7",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "tcmjt3gt",
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
        "id": "zms257bz",
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
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8");

  return dao.deleteCollection(collection);
})
