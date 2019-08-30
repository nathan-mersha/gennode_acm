# GenNode ACM

#### Author
Nathan Mersha

### Installation

GennodeACM library is available on npm, type:

`$ npm i gennode_acm`


### Description
This module is a library to be plugged in your server. This library is one part of a cluster modules as defined in [gennode_authorization](https://www.npmjs.com/package/gennode_authorization)
The module is used to set access control model data on an object preferable on a post save hook as illustrated in the example below.

### How to use it

###### 1. Initialize the library with a constructor

```javascript
let gennodeACM = require('gennode_acm');
let gennodeACMInstance = new gennodeACM({
    host        : "localhost",
    port        : 3400,
    endpoint    : "/auth/token/validate",
    connection  : "http"
});
```

| Configuration | Description | Default |
|:------------:|:-----------:|:-----------:|
|host               |Gennode Authorization service host | localhost |
|port               |Gennode Authorization port         | 3400 |
|endpoint           |Token validator endpoint           | /auth/token/validate |
|connection         |Communication type (Current support : http) for future seneca support | http |

###### 2. Define your schema

```javascript
let schema = new Schema(
    // todo : Your Schema goes here
);

```

###### 3. On a post save hook set your acm with default allowed accesses as illustrated below.

```javascript
schema.post('save', function(doc) {
    let objectACM = {
        schemaName : "schemaName", // Defines the schema/model name
        serviceName : "serviceName", // Defines the service name where the schema is located
        object : doc._id, // Defines the object id ( or anything you consider unique )
        accessControl : { // Defines the default access roles on your data
            read : ["any"],
            update : ["Admin 1", "Admin 2", "Admin 3"],
            delete : ["Admin 2"],
        }
    };

    // Set acm here.
    gennodeACMInstance.setACM(objectACM, function (error, response, body) {
        console.log(response);
    });
});
```

###### Response
```json
{
    "acmSubjects": [
        {
            "accessControl": {
                "read": [],
                "update": [
                    "5cee730bb2820d47582e9abd"
                ],
                "delete": []
            },
            "_id": "5d5a958cd9d8663585e8f342",
            "subject": "Admin 3",
            "firstModified": "2019-08-19T12:26:52.223Z",
            "lastModified": "2019-08-19T12:26:52.223Z",
            "__v": 0
        },
        {
            "accessControl": {
                "read": [],
                "update": [
                    "5cee730bb2820d47582e9abd"
                ],
                "delete": [
                    "5cee730bb2820d47582e9abd"
                ]
            },
            "_id": "5d5a958cd9d8663585e8f346",
            "subject": "Admin 2",
            "firstModified": "2019-08-19T12:26:52.232Z",
            "lastModified": "2019-08-19T12:26:52.232Z",
            "__v": 0
        },
        {
            "accessControl": {
                "read": [],
                "update": [
                    "5cee730bb2820d47582e9abd"
                ],
                "delete": []
            },
            "_id": "5d5a958cd9d8663585e8f345",
            "subject": "Admin 1",
            "firstModified": "2019-08-19T12:26:52.232Z",
            "lastModified": "2019-08-19T12:26:52.232Z",
            "__v": 0
        },
        {
            "accessControl": {
                "read": [
                    "5cee730bb2820d47582e9abd"
                ],
                "update": [],
                "delete": []
            },
            "_id": "5d5a958cd9d8663585e8f343",
            "subject": "any",
            "firstModified": "2019-08-19T12:26:52.224Z",
            "lastModified": "2019-08-19T12:26:52.224Z",
            "__v": 0
        }
    ]
}
```
### Contributing
**If you have anything in mind, feel free to create an issue [here](https://github.com/nathan-mersha/gennode_acm), 
or fork the project.**
