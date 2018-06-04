# Table of Contents

* [Downloading & Installing](#download-install)
* [Setting up the Database](#database)
* [Authorization & Authentication](#authorization)
* [User API Calls](#user-api)
  * [Register](#register)
  * [Login](#login)
  * [Logout](#logout)
  * [Edit User About Me](#edit-about)
  * [Get User Profile](#get-user-profile)
  * [Get User's Subscriptions](#get-user-subscriptions)
  * [Subscribe or Unsubscribe](#subscribe-unsubscribe)
  * [Get Recipes Related to User](#get-user-related-recipes)
  * [Save, Unsave, or Vote on a Recipe](#save-unsave-vote)
* [Recipe API Calls](#recipe-api)
  * [Search for Recipes](#search-recipe)
  * [Get Recipe Details](#recipe-details)
  * [Post a Comment on a Recipe](#post-comment)
  * [Get Recipe Comments](#get-comments)
* [Ingredient API Calls](#ingredient-api)
  * [Get Ingredients](#get-ingredients)
* [Category API Calls](#category-api)
  * [Get Categories](#get-categories)

# <a name="download-install"></a>Downloading & Installing

This is a node.js project. You will need npm to run it. You will also need an apache setup for running a local MySQL database.

Once you have downloaded the project, run ```npm install``` to install related libraries.

To run, type ```npm start```. The app will run on localhost:3000.

# <a name="database"></a>Setting up the database
To set up the database tables, first, make sure that you create a database called "aroma". run the sql queries in the ```aromadb.sql``` file to create the tables and supporting triggers and functions.

To pre-populate the database with recipes, categories, and ingredients, import the following files in the database, included in the sqlfiles folder IN ORDER:
* ingredients.sql
* similaringredients.sql
* categories.sql
* recipes.sql
* category_recipe.sql
* ingredient_recipe.sql
* instructions.sql

# <a name="authorization"></a>Authorization & Authentication

Most API calls require a user to be logged in. When making a request to one of these endpoints, make sure you have the Authorization header:

```Authorization: Bearer <token>```

Example: ```Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTI4MDY1OTkzLCJqdGkiOiIwMGVjMjJiNy0wOGNjLTQ2YzctODA3OS0zM2E4YWQ4MjNkMWUifQ.kQRlU9NMmFPgiE2kZr6d9ORG20oua-oH21hLPqcBkDo```

You can get a token by making a call to ```/users/token``` with the user's credentials.

API calls that require credentials will be marked with *

Two responses you might see if there is no authorization header or the token is invalid:

**401 UNAUTHORIZED**
```json
{
  "error": true,
  "data": {
    "message": "Missing Authorization Header"
  }
}
```

**403 FORBIDDEN**
```json
{
  "error": true,
  "data": {
    "message": "You are unauthorized"
  }
}
```

# <a name="user-api"></a>User API Calls
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

### Success Response JSON 200 OK
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTI3OTAwNjU2LCJqdGkiOiJhMzVjNjI5YS1lOGI5LTRhOGMtYjIyOS1lYjNiNDVkOTE2ZTMifQ.eHNi9U4QsgCy63yO39kca3z8Q80bm7vlQ1laL7dEzlc",
    "user": 1
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

## <a name="logout"></a>Logout *

**Description**: Logs out the user by invalidating the token given at login

Title | Logout
:---------- | :--------------------
**URL** | ```/users/logout```
**Method** | ```POST```
**URL Parameters** | none
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 401 UNAUTHORIZED
**Notes** |

### Success Response JSON 200 OK
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

## <a name="edit-about"></a> Edit User About Me *

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

### Success Response JSON 200 OK
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

## <a name="get-user-profile"></a>Get User Profile *

**Description**: Get the profile of a specific user by their user id, along with the recipes they have uploaded

Title | Get User Profile
:---------- | :--------------------
**URL** | ```/users/:id```
**Method** | ```GET```
**URL Parameters** | **Required**<br>```id=[integer]```
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 404 NOT FOUND
**Sample Request** | ```/users/1```
**Notes** | If the user is viewing their own profile, the result json will include their email

### Success Response JSON 200 OK (Viewing Own Profile)
```json
{
  "error": false,
  "data": {
    "user": {
      "id": 1,
      "username": "username",
      "about": "add bio here",
      "email": "email@example.com",
      "uploaded_recipes": [{
        "id": 1,
        "title": "Chicken-Fried Steak & Gravy",
        "image_url": "https://spoonacular.com/recipeImages/775736-556x370.jpg",
        "likes": 0,
        "dislikes": 0,
        "score": 0.6
      }]
    }
  }
}
```

### Success Response JSON 200 OK (Viewing Someone Else's Profile)
```json
{
  "error": false,
  "data": {
    "user": {
      "id": 1,
      "username": "username",
      "about": "add bio here",
      "uploaded_recipes": [{
        "id": 1,
        "title": "Chicken-Fried Steak & Gravy",
        "image_url": "https://spoonacular.com/recipeImages/775736-556x370.jpg",
        "likes": 0,
        "dislikes": 0,
        "score": 0.6
      }]
    }
  }
}
```

### Error Response JSON 404 NOT FOUND
```json
{
  "error": true,
  "data": {
    "message": "User does not exist"
  }
}
```

## <a name="get-user-subscriptions"></a>Get User's Subscriptions *

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

### Success Response JSON 200 OK
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
  "error": true,
  "data": {
    "message": "User does not exist"
  }
}
```

## <a name="subscribe-unsubscribe"></a>Subscribe or Unsubscribe to a Category *

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

### Success Response JSON 200 OK
```json
{
  "error": false,
  "data": {
    "category_id": "1"
  }
}
```

### Error Response JSON 400 BAD REQUEST
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
  "error": true,
  "data": {
    "message": "User does not exist"
  }
}
```
OR
```json
{
  "error": true,
  "data": {
    "message": "Category does not exist"
  }
}
```

## <a name="get-user-related-recipes"></a>Get Recipes Related to User *

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

### Success Response JSON 200 OK
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
  "error": true,
  "data": {
    "message": "User does not exist"
  }
}
```

## <a name="save-unsave-vote"></a>Save, Unsave, or Vote on a Recipe *

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

### Success Response JSON 200 OK
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
  "error": true,
  "data": {
    "message": "User does not exist"
  }
}
```
OR
```json
{
  "error": true,
  "data": {
    "message": "Recipe does not exist"
  }
}
```

# <a name="recipe-api"></a>Recipe API Calls

## <a name="search-recipe"></a>Search for Recipes
**Description**: Searches for recipes in three modes: Search by category and keyword, search by ingredients that the recipe includes or excludes, and search by popular recipes. This function will return a maximum of 25 recipes at once, you can get more by specifying the page number

Title | Search for Recipes
:---------- | :--------------------
**URL** | ```/recipes```
**Method** | ```GET```
**URL Parameters** | **Required**<br>```search=['category', 'ingredient', or 'popular']```<br>**If search=category**<br>At least one of:<br>```category=[integer]``` (see the category api for the list of category ids)<br>```keyword=[string]```<br>**If search=ingredient**<br>At least one of:<br>```includes=[string]```<br>```excludes=[string]```<br>(see the ingredient api for the list of searchable ingredients)<br>**Optional**<br>```page=[integer]```
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 400 BAD REQUEST
**Sample Requests** | Get the first 25 popular recipes<br>```/recipes?search=popular```<br><br>Get the second 25 popular recipes<br>```/recipes?search=popular&page=2```<br><br>Get recipes in the vegetarian category<br>```/recipes?search=category&category=1```<br><br>Get recipes in the vegetarian category that also match the keyword 'cake'<br>```/recipes?search=category&category=1&keyword=cake```<br><br>Get recipes that are in both the vegetarian and side dish categories<br>```/recipes?search=category&category=1&category=6```<br><br>Get recipes that include eggs<br>```/recipes?search=ingredient&includes=egg```<br><br>Get recipes that don't have eggs<br>```/recipes?search=ingredient&excludes=egg```<br><br>Get recipes that have eggs and milk, but don't have butter<br>```/recipes?search=ingredient&includes=egg&includes=milk&excludes=butter```
**Notes** | The 'vote' and 'saved' parameters are only displayed in the response if the request is sent with authorization. These fields represent the user's vote for that recipe (l = like, d = dislike, n = no vote) and if the user has saved the recipe, respectively.

### Success Response JSON 200 OK
```json
{
  "error": false,
  "data": {
    "recipes": [{
      "id": 582,
      "title": "Cheesecake Tart With Berries",
      "image_url": "https://spoonacular.com/recipeImages/356471-556x370.jpeg",
      "likes": 0,
      "dislikes": 0,
      "score": 0.6,
      "saved": 0,
      "vote": "n"
    }, {
      "id": 367,
      "title": "Cheesecake Walnut Caramel Apple Crisp Bars",
      "image_url": "https://spoonacular.com/recipeImages/611679-556x370.jpg",
      "likes": 0,
      "dislikes": 0,
      "score": 0.6,
      "saved": 0,
      "vote": "n"
    }...],
    "pagination": {
      "rowCount": 100,
      "pageCount": 4,
      "page": "1",
      "pageSize": 25
    }
  }
}
```

### Error Response JSON 400 BAD REQUEST (Forgetting to include either a keyword or catgory example)
```json
{
  "error": true,
  "data": {
    "message": "Need to specify a keyword or category parameter"
  }
}
```

## <a name="recipe-details"></a>Get Recipe Details

**Description**: Get the details of a single recipe, including number of servings, time to cook, ingredients, instructions, and categories

Title | Get Recipe Details
:---------- | :--------------------
**URL** | ```/recipes/:id```
**Method** | ```GET```
**URL Parameters** | **Required**<br>```id=[integer]```
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 404 NOT FOUND
**Sample Request** | ```/recipes/1```
**Notes** | The 'vote' and 'saved' parameters are only displayed in the response if the request is sent with authorization. These fields represent the user's vote for that recipe (l = like, d = dislike, n = no vote) and if the user has saved the recipe, respectively.

### Success Response JSON 200 OK
```json
{
  "error": false,
  "data": {
    "recipe": {
      "id": 1,
      "title": "Chicken-Fried Steak & Gravy",
      "description": null,
      "duration": "30",
      "image_url": "https://spoonacular.com/recipeImages/775736-556x370.jpg",
      "user_id": null,
      "source_url": "http://www.tasteofhome.com/recipes/chicken-fried-steak---gravy",
      "source": "Taste of Home",
      "score": 0.6,
      "likes": 0,
      "dislikes": 0,
      "spoonacular_id": 775736,
      "saved": 1,
      "vote": "n",
      "ingredients": [{
        "id": 10023583,
        "name": "beef tenderloin steaks",
        "_pivot_recipe_id": 1,
        "_pivot_ingredient_id": 10023583,
        "_pivot_original_string": "4 beef cubed steaks (6 ounces each)",
        "_pivot_us_amount": 24,
        "_pivot_us_unit": "oz",
        "_pivot_metric_amount": 680.389,
        "_pivot_metric_unit": "g",
        "_pivot_extra_info": "cubed"
      }, {
        "id": 1123,
        "name": "egg",
        "_pivot_recipe_id": 1,
        "_pivot_ingredient_id": 1123,
        "_pivot_original_string": "2 large eggs",
        "_pivot_us_amount": 2,
        "_pivot_us_unit": "eggs",
        "_pivot_metric_amount": 2,
        "_pivot_metric_unit": "eggs",
        "_pivot_extra_info": "large"
      },...],
      "instructions": [{
        "id": 1,
        "recipe_id": 1,
        "step_num": 1,
        "instruction": "Place 1 cup flour in a shallow bowl. In a separate shallow bowl, whisk eggs and 1/2 cup milk until blended. Sprinkle steaks with 3/4 teaspoon each salt and pepper. Dip in flour to coat both sides; shake off excess. Dip in egg mixture, then again in flour."
      }, {
        "id": 4,
        "recipe_id": 1,
        "step_num": 2,
        "instruction": "In a large skillet, heat 1/4 in. of oil over medium heat."
      },...],
      "categories": [{
        "id": 14,
        "name": "sauce",
        "_pivot_recipe_id": 1,
        "_pivot_category_id": 14
      },...]
    }
  }
}
```

### Error Response JSON 404 NOT FOUND
```json
{
  "error": true,
  "data": {
    "message": "Recipe does not exist"
  }
}
```

## <a name="post-comment"></a>Post a Comment on a Recipe *

**Description**: This posts a comment on the given recipe. User must be logged in.

Title | Post a Comment on a Recipe
:---------- | :--------------------
**URL** | ```/recipes/:id/comments```
**Method** | ```POST```
**URL Parameters** | **Required**<br>```id=[integer]```
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 404 NOT FOUND
**Sample Request** | ```/recipes/1/comments```
**Notes** |

### Sample Request JSON
```json
{
  "comment": {
      "comment": "this is a comment"
  }
}
```

### Success Response JSON 200 OK
```json
{
  "error": false,
  "data": {
    "comment": {
      "comment": "this is a comment",
      "user_id": 1,
      "recipe_id": "1",
      "id": 8
    }
  }
}
```

### Error Response JSON 404 NOT FOUND
```json
{
  "error": true,
  "data": {
    "message": "Recipe does not exist"
  }
}
```

## <a name="get-comments"></a>Get Recipe Comments

**Description**: Get the comments for the given recipe. Returns a page of maximum 100 comments. Specify the page number to get more.

Title | Get Recipe Comments
:---------- | :--------------------
**URL** | ```/recipes/:id/comments```
**Method** | ```GET```
**URL Parameters** | **Required**<br>```id=[integer]```<br>**Optional**<br>```page=[integer]```
**Success Response** | **Code**: 200 OK
**Error Response** | **Code**: 404 NOT FOUND
**Sample Request** | ```/recipes/1/comments```
**Notes** |

### Success Response JSON
```json
{
  "error": false,
  "data": {
    "comments": [{
      "id": 1,
      "comment": "This is a great recipe! Very tasty",
      "time_added": "2018-05-31T22:03:04.000Z",
      "user": {
        "id": 1,
        "username": "myoloye"
      }
    }, {
      "id": 5,
      "comment": "This is another comment",
      "time_added": "2018-06-01T00:30:00.000Z",
      "user": {
        "id": 1,
        "username": "myoloye"
      }
    },...],
    "pagination": {
      "rowCount": 5,
      "pageCount": 1,
      "page": 1,
      "pageSize": 100
    }
  }
}
```

### Error Response JSON 404 NOT FOUND
```json
{
  "error": true,
  "data": {
    "message": "Recipe does not exist"
  }
}
```

# <a name="ingredient-api"></a>Ingredient API Calls

## <a name="get-ingredients"></a>Get Ingredients

**Description**: Gets a list of ingredients. Option to either get the full list or the list of searchable ingredients (to use in the recipe search API call).

Title | Get Ingredients
:---------- | :--------------------
**URL** | ```/ingredients```
**Method** | ```GET```
**URL Parameters** | **Optional**<br>```type=searchable```
**Success Response** | **Code**: 200 OK
**Sample Request** | Get all ingredients<br>```/ingredients```<br><br>Get all searchable ingredients<br>```/ingredients?type=searchable```
**Notes** | If no type is given, defaults to getting all ingredients.


### Success Response JSON 200 OK (Searchable Ingredients)
```json
{
  "error": false,
  "data": {
    "ingredients": [{
      "ingredient_name": "alcohol"
    }, {
      "ingredient_name": "almond"
    }, {
      "ingredient_name": "anchovy"
    }, {
      "ingredient_name": "apple"
    }, {
      "ingredient_name": "asparagus"
    }, {
      "ingredient_name": "avocado"
    }, {
      "ingredient_name": "banana"
    }, {
      "ingredient_name": "basil"
    }, {
      "ingredient_name": "beans"
    }, {
      "ingredient_name": "beef"
    }, {
      "ingredient_name": "beets"
    }, {
      "ingredient_name": "bell pepper"
    }, {
      "ingredient_name": "blackberry"
    }, {
      "ingredient_name": "blueberry"
    }, {
      "ingredient_name": "broccoli"
    }, {
      "ingredient_name": "butter"
    }, {
      "ingredient_name": "cabbage"
    }, {
      "ingredient_name": "carrots"
    }, {
      "ingredient_name": "cashew"
    }, {
      "ingredient_name": "cauliflower"
    }, {
      "ingredient_name": "celery"
    }, {
      "ingredient_name": "cheese"
    }, {
      "ingredient_name": "cherry"
    }, {
      "ingredient_name": "chicken"
    }, {
      "ingredient_name": "chocolate"
    }, {
      "ingredient_name": "coconut"
    }, {
      "ingredient_name": "coffee"
    }, {
      "ingredient_name": "corn"
    }, {
      "ingredient_name": "cranberry"
    }, {
      "ingredient_name": "cream"
    }, {
      "ingredient_name": "cucumber"
    }, {
      "ingredient_name": "egg"
    }, {
      "ingredient_name": "eggplant"
    }, {
      "ingredient_name": "flour"
    }, {
      "ingredient_name": "garlic"
    }, {
      "ingredient_name": "grapefruit"
    }, {
      "ingredient_name": "grapes"
    }, {
      "ingredient_name": "ham"
    }, {
      "ingredient_name": "lemon"
    }, {
      "ingredient_name": "lettuce"
    }, {
      "ingredient_name": "lime"
    }, {
      "ingredient_name": "lobster"
    }, {
      "ingredient_name": "mango"
    }, {
      "ingredient_name": "milk"
    }, {
      "ingredient_name": "mushrooms"
    }, {
      "ingredient_name": "oats"
    }, {
      "ingredient_name": "oil"
    }, {
      "ingredient_name": "olive"
    }, {
      "ingredient_name": "onion"
    }, {
      "ingredient_name": "orange"
    }, {
      "ingredient_name": "pasta"
    }, {
      "ingredient_name": "peach"
    }, {
      "ingredient_name": "peanut"
    }, {
      "ingredient_name": "peas"
    }, {
      "ingredient_name": "pecan"
    }, {
      "ingredient_name": "peppers"
    }, {
      "ingredient_name": "pineapple"
    }, {
      "ingredient_name": "pistachios"
    }, {
      "ingredient_name": "pork"
    }, {
      "ingredient_name": "potato"
    }, {
      "ingredient_name": "pumpkin"
    }, {
      "ingredient_name": "raspberry"
    }, {
      "ingredient_name": "rice"
    }, {
      "ingredient_name": "salmon"
    }, {
      "ingredient_name": "shrimp"
    }, {
      "ingredient_name": "soy"
    }, {
      "ingredient_name": "spinach"
    }, {
      "ingredient_name": "squash"
    }, {
      "ingredient_name": "strawberry"
    }, {
      "ingredient_name": "sugar"
    }, {
      "ingredient_name": "sweet potato"
    }, {
      "ingredient_name": "tofu"
    }, {
      "ingredient_name": "tomato"
    }, {
      "ingredient_name": "tuna"
    }, {
      "ingredient_name": "turkey"
    }, {
      "ingredient_name": "vinegar"
    }, {
      "ingredient_name": "walnuts"
    }, {
      "ingredient_name": "watermelon"
    }, {
      "ingredient_name": "wine"
    }, {
      "ingredient_name": "yogurt"
    }, {
      "ingredient_name": "zucchini"
    }]
  }
}
```

### Success Response JSON 200 OK (Searchable Ingredients)
```json
{
  "error": false,
  "data": {
    "ingredients": [{
      "id": 1001,
      "name": "butter"
    }, {
      "id": 1004,
      "name": "blue cheese"
    }, {
      "id": 1006,
      "name": "brie cheese"
    }, {
      "id": 1009,
      "name": "cheddar cheese"
    }, {
      "id": 1011,
      "name": "colby jack cheese"
    }, {
      "id": 1012,
      "name": "cottage cheese"
    }, {
      "id": 1017,
      "name": "cream cheese"
    },...]
  }
}
```

# <a name="category-api"></a>Category API Calls
## Get Categories

**Description**: Get the list of categories from the database. Ids correspond to those that can be used when searching recipes

Title | Get Categories
:---------- | :--------------------
**URL** | ```/categories```
**Method** | ```GET```
**URL Parameters** | none
**Success Response** | **Code** 200 OK
**Notes** |

### Success Response JSON 200 OK
```json
{
  "error": false,
  "data": {
    "categories": [{
      "id": 1,
      "name": "vegetarian"
    }, {
      "id": 2,
      "name": "vegan"
    }, {
      "id": 3,
      "name": "gluten free"
    }, {
      "id": 4,
      "name": "dairy free"
    }, {
      "id": 5,
      "name": "main course"
    }, {
      "id": 6,
      "name": "side dish"
    }, {
      "id": 7,
      "name": "dessert"
    }, {
      "id": 8,
      "name": "appetizer"
    }, {
      "id": 9,
      "name": "salad"
    }, {
      "id": 10,
      "name": "bread"
    }, {
      "id": 11,
      "name": "breakfast"
    }, {
      "id": 12,
      "name": "soup"
    }, {
      "id": 13,
      "name": "beverage"
    }, {
      "id": 14,
      "name": "sauce"
    }, {
      "id": 15,
      "name": "drink"
    }, {
      "id": 16,
      "name": "african"
    }, {
      "id": 17,
      "name": "chinese"
    }, {
      "id": 18,
      "name": "japanese"
    }, {
      "id": 19,
      "name": "korean"
    }, {
      "id": 20,
      "name": "thai"
    }, {
      "id": 21,
      "name": "indian"
    }, {
      "id": 22,
      "name": "vietnamese"
    }, {
      "id": 23,
      "name": "british"
    }, {
      "id": 24,
      "name": "irish"
    }, {
      "id": 25,
      "name": "french"
    }, {
      "id": 26,
      "name": "italian"
    }, {
      "id": 27,
      "name": "mexican"
    }, {
      "id": 28,
      "name": "spanish"
    }, {
      "id": 29,
      "name": "middle eastern"
    }, {
      "id": 30,
      "name": "jewish"
    }, {
      "id": 31,
      "name": "american"
    }, {
      "id": 32,
      "name": "cajun"
    }, {
      "id": 33,
      "name": "southern"
    }, {
      "id": 34,
      "name": "greek"
    }, {
      "id": 35,
      "name": "german"
    }, {
      "id": 36,
      "name": "nordic"
    }, {
      "id": 37,
      "name": "eastern european"
    }, {
      "id": 38,
      "name": "caribbean"
    }, {
      "id": 39,
      "name": "latin american"
    }]
  }
}
```
