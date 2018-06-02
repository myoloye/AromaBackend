## Login

**Description**: Gives the user a token to send with future requests that require authorization 

Title | Login
:---------- | :--------------------
**URL** | `/users/token`
**Method** | `POST`
**URL Parameters** | none
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 400 BAD REQUEST
**Sample Request** | ```/users/token```
**Notes** | Email can be either the email or username for the account

### Sample Request
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
### Success Response 200 OK
```json
{
  "error": false,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTI3OTAwNjU2LCJqdGkiOiJhMzVjNjI5YS1lOGI5LTRhOGMtYjIyOS1lYjNiNDVkOTE2ZTMifQ.eHNi9U4QsgCy63yO39kca3z8Q80bm7vlQ1laL7dEzlc"
  }
}
```
### Error Response 400 BAD REQUEST
```json
{
  "error": true,
  "data": {
    "message": "Invalid Credentials"
  }
}
```

Title | Logout
:---------- | :--------------------
**URL** |
**Method** |
**URL Parameters** |
**Success Response** |
**Error Response** |
**Error Response** |
**Sample Request** |
**Notes** |
