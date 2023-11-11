migrate((db) => {
  const collection = new Collection({
    "id": "c6ptx6r7mg3vdl7",
    "created": "2023-09-04 07:22:02.489Z",
    "updated": "2023-09-04 07:22:02.489Z",
    "name": "groups",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "rmyszjcq",
        "name": "owner",
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
        "id": "iozj5smy",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "onjsks6h",
        "name": "avatar",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/x-xpixmap",
            "image/vnd.adobe.photoshop",
            "image/png",
            "image/vnd.mozilla.apng",
            "image/jpeg",
            "image/jxl",
            "image/jp2",
            "image/jpx",
            "image/jpm",
            "image/jxs",
            "image/gif",
            "image/webp",
            "image/tiff",
            "image/bmp",
            "image/x-icon",
            "image/vnd.djvu",
            "image/bpg",
            "image/vnd.dwg",
            "image/x-icns",
            "image/heic",
            "image/heic-sequence",
            "image/heif",
            "image/heif-sequence",
            "image/vnd.radiance",
            "image/x-xcf",
            "image/x-gimp-pat",
            "image/x-gimp-gbr",
            "image/avif",
            "image/jxr",
            "image/svg+xml"
          ],
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
  const collection = dao.findCollectionByNameOrId("c6ptx6r7mg3vdl7");

  return dao.deleteCollection(collection);
})
