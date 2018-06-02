## Register

**Description**: Registers a new user

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
    "username": "myoloye",
    "email": "myoloye@scu.edu",
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

**Description**: Gives the user a token to send with future requests that require authorization

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
