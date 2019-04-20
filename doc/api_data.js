define({ "api": [
  {
    "type": "post",
    "url": "/friends",
    "title": "Accept Friend Request",
    "name": "createFriend",
    "group": "Friends",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID .</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint send friend request</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request_uuid",
            "description": "<p>the uuid of the request to be accepted</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"Success\": \"Friend Request Accepted\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n    \"Error\": \"Bad Request\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/friends.js",
    "groupTitle": "Friends"
  },
  {
    "type": "delete",
    "url": "/friends/:uuid",
    "title": "Delete Friend",
    "name": "deleteFriend",
    "group": "Friends",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint deletes a friend from a user list of friends</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>uuid of the friend to be deleted</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"Success\": \"Friend Deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"Error\": [\n      \"Friend uuid not valid\"\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Bad Request\n{\n  \"Error\": [\n      \"Relationship not found\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/friends.js",
    "groupTitle": "Friends"
  },
  {
    "type": "delete",
    "url": "/friendrequests/:uuid",
    "title": "Delete Friend Request",
    "name": "deleteFriendRequest",
    "group": "Friends",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint rejects / deletes a friend request</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>uuid of the request to be deleted</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"Success\": \"Friend Request Deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"Error\": [\n      \"Friend Request uuid not valid\"\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Bad Request\n{\n  \"Error\": [\n      \"Friend Request not found\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/friendrequests.js",
    "groupTitle": "Friends"
  },
  {
    "type": "get",
    "url": "/friendrequests/:uuid",
    "title": "Get Pending Friend Request",
    "name": "getPendingFriendRequest",
    "group": "Friends",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID .</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint send friend request</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>uuid of the user</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"for\": [\n        {   \n            \"uuid\": \"34dee2a7-7b19-49a1-b853-e4b6eaa84969\",\n            \"user\": [\n                {\n                    \"id\": 1,\n                    \"uuid\": \"84b98718-04df-4d4b-a6ac-e8b9981fb5ba\",\n                    \"email\": \"franko4don@gmail.com\",\n                    \"password\": \"70d57cc1f61eeec2306a9775a369a1641bd8bee62751554f0e638c06974eb1d6\",\n                    \"phone\": \"07037219055\",\n                    \"dob\": \"04/05/2018\",\n                    \"tosAgreement\": 1,\n                    \"provider\": \"email\",\n                    \"created_at\": \"2019-02-20T21:37:14.000Z\",\n                    \"updated_at\": \"2019-02-20T21:37:14.000Z\",\n                    \"status\": 1\n                }\n            ],\n            \"profile\": [\n                {\n                    \"id\": 2,\n                    \"uuid\": \"84b98718-04df-4d4b-a6ac-e8b9981fb5ba\",\n                    \"nationality_origin\": \"Nigeria\",\n                    \"nationality_residence\": \"Nigeria\",\n                    \"state\": \"Delta\",\n                    \"lga\": \"Lga of residence\",\n                    \"firstName\": \"franklin\",\n                    \"lastName\": \"Nwanze\",\n                    \"photo\": \"https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714823/zjb0nopimvhefa2nbuc6.jpg\",\n                    \"created_at\": \"2019-02-21T01:59:30.000Z\",\n                    \"updated_at\": \"2019-03-22T08:57:10.000Z\",\n                    \"background\": \"https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714782/epa7arhqgv8fpapb7wje.jpg\"\n                }\n            ]\n        },\n        {\n            \"uuid\": \"34dee2a7-7b19-49a1-b853-e4b6eaa84969\",\n            \"user\": [\n                {\n                    \"id\": 1,\n                    \"uuid\": \"84b98718-04df-4d4b-a6ac-e8b9981fb5ba\",\n                    \"email\": \"franko4don@gmail.com\",\n                    \"password\": \"70d57cc1f61eeec2306a9775a369a1641bd8bee62751554f0e638c06974eb1d6\",\n                    \"phone\": \"07037219055\",\n                    \"dob\": \"04/05/2018\",\n                    \"tosAgreement\": 1,\n                    \"provider\": \"email\",\n                    \"created_at\": \"2019-02-20T21:37:14.000Z\",\n                    \"updated_at\": \"2019-02-20T21:37:14.000Z\",\n                    \"status\": 1\n                }\n            ],\n            \"profile\": [\n                {\n                    \"id\": 2,\n                    \"uuid\": \"84b98718-04df-4d4b-a6ac-e8b9981fb5ba\",\n                    \"nationality_origin\": \"Nigeria\",\n                    \"nationality_residence\": \"Nigeria\",\n                    \"state\": \"Delta\",\n                    \"lga\": \"Lga of residence\",\n                    \"firstName\": \"franklin\",\n                    \"lastName\": \"Nwanze\",\n                    \"photo\": \"https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714823/zjb0nopimvhefa2nbuc6.jpg\",\n                    \"created_at\": \"2019-02-21T01:59:30.000Z\",\n                    \"updated_at\": \"2019-03-22T08:57:10.000Z\",\n                    \"background\": \"https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714782/epa7arhqgv8fpapb7wje.jpg\"\n                }\n            ]\n        }\n    ],\n    \"from\": [\n        {\n            \"uuid\": \"34dee2a7-7b19-49a1-b853-e4b6eaa84969\",\n            \"user\": [\n                {\n                    \"id\": 1,\n                    \"uuid\": \"84b98718-04df-4d4b-a6ac-e8b9981fb5ba\",\n                    \"email\": \"franko4don@gmail.com\",\n                    \"password\": \"70d57cc1f61eeec2306a9775a369a1641bd8bee62751554f0e638c06974eb1d6\",\n                    \"phone\": \"07037219055\",\n                    \"dob\": \"04/05/2018\",\n                    \"tosAgreement\": 1,\n                    \"provider\": \"email\",\n                    \"created_at\": \"2019-02-20T21:37:14.000Z\",\n                    \"updated_at\": \"2019-02-20T21:37:14.000Z\",\n                    \"status\": 1\n                }\n            ],\n            \"profile\": [\n                {\n                    \"id\": 2,\n                    \"uuid\": \"84b98718-04df-4d4b-a6ac-e8b9981fb5ba\",\n                    \"nationality_origin\": \"Nigeria\",\n                    \"nationality_residence\": \"Nigeria\",\n                    \"state\": \"Delta\",\n                    \"lga\": \"Lga of residence\",\n                    \"firstName\": \"franklin\",\n                    \"lastName\": \"Nwanze\",\n                    \"photo\": \"https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714823/zjb0nopimvhefa2nbuc6.jpg\",\n                    \"created_at\": \"2019-02-21T01:59:30.000Z\",\n                    \"updated_at\": \"2019-03-22T08:57:10.000Z\",\n                    \"background\": \"https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714782/epa7arhqgv8fpapb7wje.jpg\"\n                }\n            ]\n        }\n    ]\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n    \"for\": [\n        {\n            \"user\": [\n                {\n                    \"id\": 5,\n                    \"uuid\": \"9b494e70-3f93-4181-bcd3-87f0ce1332ec\",\n                    \"email\": \"everistusolumese@gmail.com\",\n                    \"password\": \"2231306d33a58824b362898c6a1a0eb5907c74cd76928960df85d501eba90fcb\",\n                    \"phone\": \"09031866339\",\n                    \"dob\": \"1980-01-31T23:00:00.000Z\",\n                    \"tosAgreement\": 1,\n                    \"provider\": \"email\",\n                    \"created_at\": \"2019-03-10T08:52:28.000Z\",\n                    \"updated_at\": \"2019-03-10T08:52:28.000Z\",\n                    \"status\": 1\n                }\n            ],\n            \"profile\": [\n                {\n                    \"id\": 3,\n                    \"uuid\": \"9b494e70-3f93-4181-bcd3-87f0ce1332ec\",\n                    \"nationality_origin\": \"Vanuatu\",\n                    \"nationality_residence\": \"Nigeria\",\n                    \"state\": \"N/A\",\n                    \"lga\": \"N/A\",\n                    \"firstName\": \"Everistus\",\n                    \"lastName\": \"Olumese\",\n                    \"photo\": \"https://res.cloudinary.com/xyluz/image/upload/v1553172303/WEB/chelsea_ksbydb.png\",\n                    \"created_at\": \"2019-03-21T12:45:04.000Z\",\n                    \"updated_at\": \"2019-03-21T12:45:04.000Z\",\n                    \"background\": \"false\"\n                }\n            ]\n        }\n    ],\n    \"from\": []\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     []\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Bad Request\n{\n    \"Error\": [\n        \"You need to provide user uuid as a parameter\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/friendrequests.js",
    "groupTitle": "Friends"
  },
  {
    "type": "get",
    "url": "/friends/:uuid",
    "title": "Get Friends",
    "name": "getSingleUserFriend",
    "group": "Friends",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID .</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint returns all associated friends with the user</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>uuid of the usedr</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"user\": [\n            {\n                \"id\": 3,\n                \"uuid\": \"48e1f9d6-fc31-40db-bfa9-3ad41dbb9cdf\",\n                \"email\": \"frank4merry@gmail.com\",\n                \"password\": \"70d57cc1f61eeec2306a9775a369a1641bd8bee62751554f0e638c06974eb1d6\",\n                \"phone\": \"07037219054\",\n                \"dob\": \"04/05/2018\",\n                \"tosAgreement\": 1,\n                \"provider\": \"email\",\n                \"created_at\": \"2019-02-21T02:14:54.000Z\",\n                \"updated_at\": \"2019-02-21T02:14:54.000Z\",\n                \"status\": 1\n            }\n        ],\n        \"profile\": []\n    },\n    {\n        \"user\": [\n            {\n                \"id\": 3,\n                \"uuid\": \"48e1f9d6-fc31-40db-bfa9-3ad41dbb9cdf\",\n                \"email\": \"frank4merry@gmail.com\",\n                \"password\": \"70d57cc1f61eeec2306a9775a369a1641bd8bee62751554f0e638c06974eb1d6\",\n                \"phone\": \"07037219054\",\n                \"dob\": \"04/05/2018\",\n                \"tosAgreement\": 1,\n                \"provider\": \"email\",\n                \"created_at\": \"2019-02-21T02:14:54.000Z\",\n                \"updated_at\": \"2019-02-21T02:14:54.000Z\",\n                \"status\": 1\n            }\n        ],\n        \"profile\": []\n    }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n    \"Error\": [\n        \"You need to provide user uuid as a parameter\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/friends.js",
    "groupTitle": "Friends"
  },
  {
    "type": "post",
    "url": "/friendrequests",
    "title": "Send New Friend Request",
    "name": "sendFriendRequest",
    "group": "Friends",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID .</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint send friend request</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request_sender",
            "description": "<p>uuid of the user sending the friend request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "request_receiver",
            "description": "<p>uuid of the user to receive the friend request</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"Success\": \"Friend Request Sent\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 405 Bad Request\n{\n    \"Error\": \"Request already exists, close that request first before sending another\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/friendrequests.js",
    "groupTitle": "Friends"
  },
  {
    "type": "post",
    "url": "/petitions",
    "title": "Create Petition",
    "name": "createPetition",
    "group": "Petitions",
    "description": "<p>The endpoint creates a new petition</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "targeted_office",
            "description": "<p>Office the petition is targetted at.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "petition_class",
            "description": "<p>Class of this petition</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "petition_title",
            "description": "<p>Title of this petition</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Published 1, don't publish 0.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "petition",
            "description": "<p>Content of the petition</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"Success\": \"Petition Created\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"Error\": [\n      \"Petition content is required\"\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"Error\": [\n      \"Petition Title is required\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/petitions.js",
    "groupTitle": "Petitions"
  },
  {
    "type": "delete",
    "url": "/petitions/:uuid",
    "title": "Delete Petition",
    "name": "deletePetition",
    "group": "Petitions",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint deletes a petition</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"Success\": \"Petition Deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"Error\": [\n      \"Petition uuid not valid\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/petitions.js",
    "groupTitle": "Petitions"
  },
  {
    "type": "get",
    "url": "/petitions?page=:page&limit=:limit&sort=:sort",
    "title": "get All Petitions",
    "name": "getAllPetitions",
    "group": "Petitions",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID .</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint get all petitions created by the user</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "page",
            "description": "<p>page you wish to get (pagination)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limit",
            "description": "<p>result count per page you wish to get (pagination)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sort",
            "description": "<p>result sort [ASC | DESC] (pagination)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"petitions\": {\n            \"id\": 2,\n            \"uuid\": \"99262d0a-9c35-472f-b757-fb9f89c2faf9\",\n            \"user\": \"08390ed2-7796-41bf-bbbd-72b176ffe309\",\n            \"targeted_office\": \"President\",\n            \"petition_class\": \"className\",\n            \"petition_title\": \"For the gods!\",\n            \"attachment\": \"null\",\n            \"created_at\": \"2019-04-16T21:28:15.000Z\",\n            \"updated_at\": \"2019-04-16T21:28:15.000Z\",\n            \"status\": 0\n        },\n        \"responses\": [],\n        \"user\": []\n    },\n    {\n        \"petitions\": {\n            \"id\": 3,\n            \"uuid\": \"f4af8c49-c91b-4cee-bcc7-9eed63cf0249\",\n            \"user\": \"08390ed2-7796-41bf-bbbd-72b176ffe309\",\n            \"targeted_office\": \"President\",\n            \"petition_class\": \"className\",\n            \"petition_title\": \"For the gods!\",\n            \"attachment\": \"null\",\n            \"created_at\": \"2019-04-16T21:56:54.000Z\",\n            \"updated_at\": \"2019-04-16T21:56:54.000Z\",\n            \"status\": 0\n        },\n        \"responses\": [],\n        \"user\": []\n    },\n    {\n        \"petitions\": {\n            \"id\": 4,\n            \"uuid\": \"fbfcbe13-d06a-4456-8020-640d571081cd\",\n            \"user\": \"08390ed2-7796-41bf-bbbd-72b176ffe309\",\n            \"targeted_office\": \"President\",\n            \"petition_class\": \"className\",\n            \"petition_title\": \"For the gods!\",\n            \"attachment\": \"null\",\n            \"created_at\": \"2019-04-16T21:56:56.000Z\",\n            \"updated_at\": \"2019-04-16T21:56:56.000Z\",\n            \"status\": 0\n        },\n        \"responses\": [],\n        \"user\": []\n    }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Bad Request\n{\n    \"petitions\": [],\n    \"responses\": []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/petitions.js",
    "groupTitle": "Petitions"
  },
  {
    "type": "get",
    "url": "/petitions/:uuid",
    "title": "get Single Petition",
    "name": "getSinglePetition",
    "group": "Petitions",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint deletes a petition</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>UUID of the pedition</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"petitions\": [\n        {\n            \"id\": 2,\n            \"uuid\": \"99262d0a-9c35-472f-b757-fb9f89c2faf9\",\n            \"user\": \"08390ed2-7796-41bf-bbbd-72b176ffe309\",\n            \"targeted_office\": \"President\",\n            \"petition_class\": \"className\",\n            \"petition_title\": \"For the gods!\",\n            \"attachment\": \"null\",\n            \"created_at\": \"2019-04-16T21:28:15.000Z\",\n            \"updated_at\": \"2019-04-16T21:28:15.000Z\",\n            \"status\": 0\n        }\n    ],\n    \"responses\": []\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Bad Request\n{\n    \"petitions\": [],\n    \"responses\": []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/petitions.js",
    "groupTitle": "Petitions"
  },
  {
    "type": "get",
    "url": "/petitions?user=:uuid&page=:page&limit=:limit&sort=:sort",
    "title": "get Single User Petitions",
    "name": "getSingleUserPetitions",
    "group": "Petitions",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID .</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint get all petitions created by the user</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>User that owns the petitions</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "page",
            "description": "<p>page you wish to get (pagination)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limit",
            "description": "<p>result count per page you wish to get (pagination)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sort",
            "description": "<p>result sort [ASC | DESC] (pagination)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"petitions\": [\n        {\n            \"id\": 2,\n            \"uuid\": \"99262d0a-9c35-472f-b757-fb9f89c2faf9\",\n            \"user\": \"08390ed2-7796-41bf-bbbd-72b176ffe309\",\n            \"targeted_office\": \"President\",\n            \"petition_class\": \"className\",\n            \"petition_title\": \"For the gods!\",\n            \"attachment\": \"null\",\n            \"created_at\": \"2019-04-16T21:28:15.000Z\",\n            \"updated_at\": \"2019-04-16T21:28:15.000Z\",\n            \"status\": 0\n        }\n    ],\n    \"responses\": []\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Bad Request\n{\n    \"petitions\": [],\n    \"responses\": []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/petitions.js",
    "groupTitle": "Petitions"
  },
  {
    "type": "post",
    "url": "/signatures",
    "title": "Sign Petition",
    "name": "signPetition",
    "group": "Petitions",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID .</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint signs a petition</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>uuid of the user signing</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "petition",
            "description": "<p>uuid of the petition to be signed</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"Success\": \"Petition Signed\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 405 Bad Request\n{\n    \"Error\": \"User already signed this petition\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/signatures.js",
    "groupTitle": "Petitions"
  },
  {
    "type": "get",
    "url": "/signatures/:uuid",
    "title": "Get single petition signatures",
    "name": "singlePetitionSignature",
    "group": "Petitions",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID .</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint signs a petition</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>uuid of the petition</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"signatures\": [\n        {\n            \"id\": 2,\n            \"uuid\": \"2bebbf3e-dd44-4574-86ad-be9fff37a665\",\n            \"petition\": \"99262d0a-9c35-472f-b757-fb9f89c2faf9\",\n            \"user\": \"08390ed2-7796-41bf-bbbd-72b176ffe309\",\n            \"created_at\": \"2019-04-17T12:36:31.000Z\",\n            \"updated_at\": \"2019-04-17T12:36:31.000Z\",\n            \"status\": 0\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Bad Request\n{\n    []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/signatures.js",
    "groupTitle": "Petitions"
  },
  {
    "type": "delete",
    "url": "/signatures",
    "title": "Remove Signature from Petition",
    "name": "unsignPetition",
    "group": "Petitions",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>Authorization UUID .</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Authorization Token.</p>"
          }
        ]
      }
    },
    "description": "<p>The endpoint signs a petition</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>uuid of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "petition",
            "description": "<p>uuid of the petition to be unsigned</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"Success\": \"Petition Un Signed\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Bad Request\n{\n    \"Error\": \"User Signed Petition Not Found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/signatures.js",
    "groupTitle": "Petitions"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Create User (Email)",
    "name": "createUser",
    "group": "Users",
    "description": "<p>The endpoint creates a new user using Email provider</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "phone",
            "optional": false,
            "field": "phone",
            "description": "<p>User Phone number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User Email address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User Password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>User Date of Birth.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "tosAgreement",
            "description": "<p>TOS Agreement.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "provider",
            "description": "<p>User method of signup, either email, or any of the social media (twitter|facebook|linkedin|google).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"Token\": \"UX4LmqktGgC7Ilib9qmpHTRnYxEjr7eMTiD6QUUhRSHI70nT482boFClYmB7FmM7ulcgqcE388grQLUg9IfD2Ol9mPPqM8kImoFF\",\n\t\"uuid\": \"055e8860-cbe9-11e8-98f8-4fae0909dc0e\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n \"Error\": \"Provider is required\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n\"Error\": [\n\t\"Phone number is missing or invalid format\",\n\t\"Email is missing or invalid format\",\n\t\"DOB is missing or invalid format\",\n\t\"Password is missing or invalid format\",\n\t\"tosAgreement cannot be false\"\n],\n\t\"Message\": []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "components/users.js",
    "groupTitle": "Users"
  }
] });
