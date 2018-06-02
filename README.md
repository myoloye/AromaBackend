## Register

**Description**: Registers a new user. Returns the id of the newly created user.

Title | Register
:---------- | :--------------------
**URL** | ```/users```
**Method** | ```POST```
**URL Parameters** | none
**Success Response** | 200 OK
**Error Response** | 400 BAD REQUEST
**Notes** |

### Sample Request JSON
```json
{
  "user": {
    "username": "username",
    "email": "email@example.com",
    "password": "password"
  }
}
```

### Success Request JSON 200 OK
```json
{
  "error": false,
  "data": {
    "id": 3
  }
}
```

### Error Response JSON 400 BAD REQUEST
coming soon

## Login

**Description**: Logs in the user. Returns a token to send with future requests to the server.

Title | Login
:---------- | :--------------------
**URL** | `/users/token`
**Method** | `POST`
**URL Parameters** | none
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 400 BAD REQUEST
**Notes** | Email can be either the email or username for the account

### Sample Request JSON
```json
{
  "user": {
    "email": "email@example.com",
    "password": "password"
  }
}
```
OR
```json
{
  "user": {
    "email": "username",
    "password": "password"
  }
}
```

### Success Response JSON 200 OK
```json
{
  "error": false,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTI3OTAwNjU2LCJqdGkiOiJhMzVjNjI5YS1lOGI5LTRhOGMtYjIyOS1lYjNiNDVkOTE2ZTMifQ.eHNi9U4QsgCy63yO39kca3z8Q80bm7vlQ1laL7dEzlc"
  }
}
```

### Error Response JSON 400 BAD REQUEST
```json
{
  "error": true,
  "data": {
    "message": "Invalid Credentials"
  }
}
```

## Logout

**Description**: Logs out the user by invalidating the token given at login

Title | Logout
:---------- | :--------------------
**URL** | ```/users/logout```
**Method** | ```POST```
**URL Parameters** | none
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 401 UNAUTHORIZED
**Notes** |

### Sample Request JSON
none

### Success Request JSON 200 OK
```json
{
  "error": false
}
```

### Error Response JSON 401 UNAUTHORIZED
```json
{
  "error": true,
  "data": {
    "message": "Missing Authorization Header"
  }
}
```

## Get User Profile

**Description**: Get the profile of a specific user by their user id.

Title | Get User Profile
:---------- | :--------------------
**URL** | ```/users/:id```
**Method** | ```GET```
**URL Parameters** | **Required**<br>```id=[integer]```
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 404 NOT FOUND
**Sample Request** | ```/users/1```
**Notes** |

### Sample Request JSON
none

### Success Request JSON 200 OK
```json
{
  "error": false,
  "data": {
    "user": {
      "username": "username",
      "about": "user about me goes here"
    }
  }
}
```

### Error Response JSON 404 NOT FOUND
```json
{
  "error": false,
  "data": {
    "message": "User does not exist"
  }
}
```

## Get User's Subscriptions

**Description**: Get the list of recipe categories that the given user is subscribed to

Title | Get User's Subscriptions
:---------- | :--------------------
**URL** | ```/users/:id/subscriptions```
**Method** | ```GET```
**URL Parameters** | **Required**<br>```id=[integer]```
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 401 UNAUTHORIZED
**Error Response** | **Code**: 403 FORBIDDEN
**Error Response** | **Code**: 404 NOT FOUND
**Sample Request** | ```/users/1/subscriptions```
**Notes** |

### Sample Request JSON
none

### Success Request JSON 200 OK
```json
{
  "error": false,
  "data": {
    "categories": [{
      "id": 31,
      "name": "american"
    }, {
      "id": 38,
      "name": "caribbean"
    }]
  }
}
```

### Error Response JSON 401 UNAUTHORIZED
```json
{
  "error": true,
  "data": {
    "message": "Missing Authorization Header"
  }
}
```

### Error Response JSON 403 FORBIDDEN
```json
{
  "error": true,
  "data": {
    "message": "You are unauthorized"
  }
}
```

### Error Response JSON 404 NOT FOUND
```json
{
  "error": false,
  "data": {
    "message": "User does not exist"
  }
}
```

## Subscribe or Unsubscribe to a Category

**Description**: Subscribes or unsubscribes the given user to the given category

Title | Subscribe or Unsubscribe
:---------- | :--------------------
**URL** | ```/users/:userId/subscriptions/:categoryId```
**Method** | ```POST```
**URL Parameters** | **Required**<br>```userId=[integer]```<br>```categoryId=[integer]```<br>```action=['subscribe' or 'unsubscribe']```
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 401 UNAUTHORIZED
**Error Response** | **Code**: 403 FORBIDDEN
**Error Response** | **Code**: 404 NOT FOUND
**Sample Request** | ```/users/1/subscriptions/1?action=subscribe```
**Notes** |

### Sample Request JSON
none

### Success Request JSON 200 OK
```json
{
  "error": false,
  "data": {
    "category_id": "1"
  }
}
```

### Error Response JSON 401 UNAUTHORIZED
```json
{
  "error": true,
  "data": {
    "message": "Missing Authorization Header"
  }
}
```

### Error Response JSON 403 FORBIDDEN
```json
{
  "error": true,
  "data": {
    "message": "You are unauthorized"
  }
}
```

### Error Response JSON 404 NOT FOUND
```json
{
  "error": false,
  "data": {
    "message": "User does not exist"
  }
}
```
OR
```json
{
  "error": false,
  "data": {
    "message": "Category does not exist"
  }
}
```
