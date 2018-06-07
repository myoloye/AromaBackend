### Register a User

```POST /users```

**Headers**: Content-Type, Accept<br>**Sample Request JSON**
```json
{
  "user": {
    "username": "username",
    "email": "email@example.com",
    "password": "password"
  }
}
```

### Login

```POST /users/token```

**Headers**: Content-Type, Accept<br>**Sample Request JSON**
```json
{
  "user": {
    "email": "email@example.com",
    "password": "password"
  }
}
```

### Logout

```POST /users/logout```

**Headers**: Content-Type, Accept, Authorization

### Get User Profile

```GET /users/:id```

**Headers**: Content-Type, Accept, Authorization

### Edit About Me

```POST /users/:id```

**Headers**: Content-Type, Accept, Authorization<br>**Sample Request JSON**

```json
{
  "about": "add bio here"
}
```

### Get List of Categories Subscribed to

```GET /users/:id/subscriptions```

**Headers**: Content-Type, Accept, Authorization

### Get List of Liked Recipes

```GET /users/:id/recipes?type=liked```

**Headers**: Content-Type, Accept, Authorization

### Get List of Disliked Recipes

```GET /users/:id/recipes?type=disliked```

**Headers**: Content-Type, Accept, Authorization

### Get List of Saved Recipes

```GET /users/:id/recipes?type=saved```

**Headers**: Content-Type, Accept, Authorization

### Get List of Recipes a User Uploaded

```GET /users/:id/recipes?type=uploaded```

**Headers**: Content-Type, Accept, Authorization

### Like a Recipe
```POST /users/:userId/recipes/:recipeId?action=like```

**Headers**: Content-Type, Accept, Authorization

### Dislike a Recipe
```POST /users/:userId/recipes/:recipeId?action=dislike```

**Headers**: Content-Type, Accept, Authorization

### Unlike or Un-dislike a Recipe
```POST /users/:userId/recipes/:recipeId?action=neutralize```

**Headers**: Content-Type, Accept, Authorization

### Save a Recipe
```POST /users/:userId/recipes/:recipeId?action=save```

**Headers**: Content-Type, Accept, Authorization

### Unsave a Recipe
```POST /users/:userId/recipes/:recipeId?action=unsave```

**Headers**: Content-Type, Accept, Authorization

### Get the First Page of Popular Recipes
```GET /recipes?search=popular```

**Headers**: Content-Type, Accept, Authorization (optional)

### Get a Specific Page of Popular Recipes
```GET /recipes?search=popular&page=:pagenum```

**Headers**: Content-Type, Accept, Authorization (optional)

### Search for Recipes with a Specific Category
```GET /recipes?search=category&category=:categoryId```

**Headers**: Content-Type, Accept, Authorization (optional)

### Search for Recipes by Keyword
```GET /recipes?search=category&keyword=:keyword```

**Headers**: Content-Type, Accept, Authorization (optional)

### Search for Recipes with More Than One Category
```GET /recipes?search=category&category=:category1Id&:cagetory2Id```

**Headers**: Content-Type, Accept, Authorization (optional)

### Search for Recipes with More Than One Category and by Keyword
```GET /recipes?search=category&category=:category1Id&category2Id?keyword=:keyword```

**Headers**: Content-Type, Accept, Authorization (optional)

### Search for Recipes that Include a Specific Ingredient
```GET /recipes?search=ingredient&includes=:ingredientName```

**Headers**: Content-Type, Accept, Authorization (optional)

### Search for Recipes that Exclude a Specific Ingredient
```GET /recipes?search=ingredient&excludes=:ingredientName```

**Headers**: Content-Type, Accept, Authorization (optional)

### Search for Recipes that Both Include and Exclude Specific Ingredients
```GET /recipes?search=ingredient&includes=:ingredient1Name&includes=:ingredient2Name&excludes=ingredient3Name&excludes=ingredient4Name```

**Headers**: Content-Type, Accept, Authorization (optional)

### Upload a Recipe
```POST /recipes```

**Headers**: Content-Type, Accept, Authorization<br>**Sample Request JSON**
```json
{
    "recipe": {
        "title": "Buttermilk-Marinated Chicken",
        "vegetarian": false,
        "vegan": false,
        "dairyFree": false,
        "glutenFree": true,
        "sourceUrl": "https://cooking.nytimes.com/recipes/1018731-buttermilk-marinated-roast-chicken",
        "sourceName": "New York Times Cooking",
        "description": "This recipe, adapted from Samin Nosrat's \"Salt, Fat, Acid, Heat\", is inspired by the Southern grandma method of marinating chicken overnight in buttermilk before frying it. You're roasting here, but the buttermilk and salt still work like a brine, tenderizing the meat on multiple levels to yield an unbelievably juicy chicken.",
        "readyInMinutes": 105,
        "servings": 4,
        "categories": [5, 31],
        "ingredients": [
            {
                "id": 5006,
                "name": "whole chicken",
                "amount": 1,
                "extra_info": "3 1/2 - 4 pounds"
            },
            {
                "id": 1230,
                "name": "buttermilk",
                "amount": 2,
                "unit": "cup"
            },
            {
                "id": 1082047,
                "name": "kosher salt",
                "amount": 3,
                "unit": "Tbsp"
            },
            {
                "id": 1001,
                "name": "butter",
                "amount": 1,
                "unit": "stick"
            }
        ],
        "instructions": [
            {
                "step": "The day before you want to cook the chicken, remove the wingtips by cutting through the first wing joint with poultry shears or a sharp knife. Reserve for stock. Season chicen generously with salt and let it sit for 30 minutes."
            },
            {
                "step": "Stir 2 tablespoons kosher salt or 4 teaspoons fine sea salt into the buttermilk to dissolve. Place the chicken in a gallon-size resealable plastic bag and pour in the buttermilk. (If the chicken won't fit in a gallon-size bag, double up two plastic produce bags to prevent leaks and tie the bag with twine.)"
            },
            {
                "step": "Seal the baag, squish the buttermilk all around the chicken, place on a rimmed plate, nd refrigerate for 12 to 24 hours. If you're so inclined, you can turn the bag periodically so every part of the chicken gets marinated, but that's not essential"
            },
            {
                "step": "Pull the chicken from the fridge an hour before you plan to cook it. Heat the oven to 425 degrees with a rack set in the center position."
            },
            {
                "step": "Remove the chicken from the plastic bag and scrape off as much buttermilk as you can without being obsessive. Tightly tie together the legs with a piece of butcher's twine. Place the chicken in a 10-inch cast-iron skillet or a shallow roasting pan."
            },
            {
                "step": "Slide the pan all the way to the back of the oven on the center rack. Rotate the pan so that the legs are pointing toward the center of the oven. (The back corners tend to be the hottest spots in the oven, so this orientation protects the breast from overcooking before the legs are done.) Pretty quickly you should hear the chicken sizzling."
            },
            {
                "step": "After about 20 minutes, when the chicken starts to brown, reduce the heat to 400 degrees and continue roasting for 10 minutes."
            },
            {
                "step": "Move the pan so the legs are facing the  right corner of the oven. Continue cooking for another 30 minutes or so, until the chicken is brown all over and the juices run clear when you insert a knife down to the bone between the leg and the thigh. If the skin is getting too brown before it is cooked through, use a foil tent. Remov it to a platter and let it rest for 10 minutes before carving and serving."
            }
        ],
        "imagebase64": "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4..."
    }
}
```

### Get a Single Recipe with All Details
```GET /recipes/:id```

**Example**: Get recipe with id 1<br>```/recipes/1```

**Headers**: Content-Type, Accept, Authorization (optional)

### Get a Recipe's First Page of Comments
```GET /recipes/:id/comments```

**Example**: Get the first 100 comments on recipe with id 1<br>
```/recipes/1/comments```

**Headers**: Content-Type, Accept

### Get a Specific Page of a Recipe's Comments

```GET /recipes/:id/comments?page=:pagenum```<br>

**Example**: Get page 2 of the comments on recipe with id 1<br>```/recipes/1/comments?page=2```<br>

**Headers**: Content-Type, Accept

### Post a Comment
```POST /recipes/:id/comments```<br>

**Example**: Post a comment on the recipe with id 1<br>
```/recipes/1/comments```<br>

**Headers**: Content-Type, Accept, Authorization<br>
**Sample Request JSON**

```json
{
  "comment": {
    "comment": "hello world!"
  }
}
```
