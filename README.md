# Table of Contents

* [Register](#register)
* [Login](#login)
* [Logout](#logout)
* [Edit User About Me](#edit-abou)
* [Get User Profile](#get-user-profile)
* [Get User's Subscriptions](#get-user-subscriptions)
* [Subscribe or Unsubscribe](#subscribe-unsubscribe)
* [Get Recipes Related to User](#get-user-related-recipes)
* [Save, Unsave, or Vote on a Recipe](#save-unsave-vote)

## <a name="register"></a> Register

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

## <a name="login"></a>Login

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

## <a name="logout"></a>Logout

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

## <a name="edit-about"></a> Edit User About Me

**Description**: Lets the user edit the about me for their profile

Title | Edit User About Me
:---------- | :--------------------
**URL** | ```/users/:id```
**Method** | ```POST```
**URL Parameters** | **Required**<br>```id=[integer]```
**Success Response** | **Code**: 200 OK
**Sample Request** | ```/users/1```
**Notes** | Only for changing the about section, but could add more things in the future

### Sample Request JSON
```json
{
  "about": "add bio here"
}
```

### Success Request JSON 200 OK
```json
{
  "error": false,
  "data": {
    "about": "add bio here"
  }
}
```

### Error Response JSON 400 BAD REQUEST
```json
{
  "error": true,
  "data": {
    "message": "About should be a string of length greater than 0"
  }
}
```
OR
```json
{
  "error": true,
  "data": {
    "message": "Specify an about field"
  }
}
```

## <a name="get-user-profile"></a>Get User Profile

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

## <a name="get-user-subscriptions"></a>Get User's Subscriptions

**Description**: Get the list of recipe categories that the given user is subscribed to

Title | Get User's Subscriptions
:---------- | :--------------------
**URL** | ```/users/:id/subscriptions```
**Method** | ```GET```
**URL Parameters** | **Required**<br>```id=[integer]```
**Success Response** | **Code**: 200 OK
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

### Error Response JSON 404 NOT FOUND
```json
{
  "error": false,
  "data": {
    "message": "User does not exist"
  }
}
```

## <a name="subscribe-unsubscribe"></a>Subscribe or Unsubscribe to a Category

**Description**: Subscribes or unsubscribes the given user to the given category

Title | Subscribe or Unsubscribe
:---------- | :--------------------
**URL** | ```/users/:userId/subscriptions/:categoryId```
**Method** | ```POST```
**URL Parameters** | **Required**<br>```userId=[integer]```<br>```categoryId=[integer]```<br>```action=['subscribe' or 'unsubscribe']```
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 400 BAD REQUEST
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

### Error Response JSON 404 NOT FOUND
```json
{
  "error": true,
  "data": {
    "message": "Invalid action. Valid values are 'subscribe' and 'unsubscribe'."
  }
}
```
OR
```json
{
  "error": true,
  "data": {
    "message": "Specify the action. Valid values are 'subscribe' and 'unsubscribe'."
  }
}
```
OR
```json
{
  "error": true,
  "data": {
    "message": "Enter only one action"
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

## <a name="get-user-related-recipes"></a>Get Recipes Related to User

**Description**: Gets the list of recipes that are related to the user. Can either be the saved, liked, disliked, or user-uploaded recipes

Title | Get Recipes Related to User
:---------- | :--------------------
**URL** | ```/users/:id/recipes```
**Method** | ```GET```
**URL Parameters** | **Required**<br>```id=[integer]```<br>```type=['saved', 'liked', 'disliked', or 'uploaded']```
**Success Response** | **Code**: 200 0K
**Error Response** | **Code**: 404 NOT FOUND
**Sample Request** | ```/users/1/recipes```
**Notes** |

### Sample Request JSON
none

### Success Request JSON 200 OK
```json
{
  "error": false,
  "data": {
    "recipes": [{
      "id": 2,
      "title": "Fresh Corn Cakes",
      "image_url": "https://spoonacular.com/recipeImages/605183-556x370.jpg",
      "likes": 1,
      "dislikes": 0,
      "score": 0.75
    }, {
      "id": 5,
      "title": "Pumpkin Cheesecake Crumb Bars",
      "image_url": "https://spoonacular.com/recipeImages/617089-556x370.jpg",
      "likes": 1,
      "dislikes": 0,
      "score": 0.75
    }]
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

## <a name="save-unsave-vote"></a>Save, Unsave, or Vote on a Recipe

**Description**: Allows the user to save, unsave, like, dislike, or neutralize their vote on a recipe

Title | Save, Unsave, or Vote on a Recipe
:---------- | :--------------------
**URL** | ```/users/:userId/recipes/:recipeId```
**Method** | ```POST```
**URL Parameters** | **Required**<br>```userId=[integer]```<br>```recipeId=[integer]```<br>```action=['like', 'dislike', 'neutralize', 'save', or 'unsave']```
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 404 NOT FOUND
**Error Response** | **Code**: 400 BAD REQUEST
**Sample Request** | ```/users/1/recipes/1?action=dislike```
**Notes** |

### Sample Request JSON
none

### Success Request JSON 200 OK
```json
{
  "error": false,
  "data": {
    "recipe": "1"
  }
}
```

### Error Response JSON 400 BAD REQUEST
```json
{
  "error": true,
  "data": {
    "message": "Invalid action. Valid values are Valid values are 'like', 'dislike', 'neutralize', 'save', and 'unsave'."
  }
}
```
OR
```json
{
  "error": true,
  "data": {
    "message": "Specify the action. Valid values are 'like', 'dislike', 'neutralize', 'save', and 'unsave'."
  }
}
```
OR
```json
{
  "error": true,
  "data": {
    "message": "Enter only one action"
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
    "message": "Recipe does not exist"
  }
}
```
