migrate((db) => {
  const collection = new Collection({
    "id": "8j3dwfrv6nu3qoc",
    "created": "2023-07-09 11:10:58.795Z",
    "updated": "2023-07-09 11:10:58.795Z",
    "name": "tst",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "atixficz",
        "name": "name",
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
        "id": "onkrgqka",
        "name": "text",
        "type": "editor",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "0srmckar",
        "name": "image",
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
    "listRule": "@request.method = 'GET'",
    "viewRule": null,
    "createRule": "",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("8j3dwfrv6nu3qoc");

  return dao.deleteCollection(collection);
})
