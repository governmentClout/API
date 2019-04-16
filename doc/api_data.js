define({ "api": [
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