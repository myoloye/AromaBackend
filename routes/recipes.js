var express = require('express');
var router = express.Router();
var bookshelf = require('../config/bookshelf');
var User = require('../models/user');
var Recipe = require('../models/recipe');
var Ingredient = require('../models/ingredient');
var Instruction = require('../models/instruction');
var Category_Recipe = require('../models/category_recipe');
var Ingredient_Recipe = require('../models/ingredient_recipe');
var SimilarIngredient = require('../models/similar_ingredient');
var Comment = require('../models/comment');
var Auth = require('../lib/auth');
var Pagination = require('../lib/pagination');
var convert = require('convert-units');
var pluralize = require('pluralize');
pluralize.addPluralRule('tbsp', 'tbsps');
pluralize.addPluralRule('tsp', 'tsps');
var cloudinary = require('cloudinary');
var Fuse = require('fuse.js');
var FriedChicken = require('../friedchicken.js');

cloudinary.config({
  cloud_name: "insert cloud name",
  api_key: "insert api key",
  api_secret: "insert api secret"
});

router.get('/:recipeId', function(req, res, next){
    const {recipeId} = req.params;
    Recipe.where({id: req.params.recipeId}).fetch().then(function(r){
        if(r){
            var getId = Auth.getUserId(req.headers.authorization);
            getId.then(function(uid){
                const voteandsave = bookshelf.knex.raw('hasSaved(?, id) as saved, getVote(?, id) as vote', [uid, uid]);
                bookshelf.transaction(function(t){
                    var options = {transacting: t};
                    return Recipe.query(function(qb){
                        if(uid){
                            return qb.select('*', voteandsave)
                                     .where('id', '=', recipeId);
                        } else {
                            return qb.select('*')
                                     .where('id', '=', recipeId);
                        }
                    }).fetch({withRelated: ['ingredients', 'instructions', 'categories']}).then(t.commit).catch(t.rollback);
                }).then(function(recipe){
                    res.status(200).json({error: false, data: {recipe: recipe}});
                }).catch(function(err){
                    res.status(500).json({error: true, data: {message: err.message}});
                });
            });
        } else {
            res.status(404).json({error: true, data: {message: "Recipe does not exist"}});
        }
    });
});

router.post('/:recipeId/comments', function(req, res, next){
    const {comment} = req.body;
    Recipe.where({id: req.params.recipeId}).fetch().then(function(r){
        if(r){
            var getId = Auth.getUserId(req.headers.authorization);
            getId.then(function(uid){
                if(uid){
                    bookshelf.transaction(function(t){
                        var options = {transacting: t};
                        Comment.forge(comment).save({user_id: uid, recipe_id: req.params.recipeId}).then(function(c){
                            res.status(200).json({error: false, data: {comment: c}});
                        }).then(t.commit).catch(t.rollback);
                    }).catch(function(err){
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
                } else {
                    res.status(401).json({error: true, data: {message: 'Invalid authorization'}});
                }
            });
        } else {
            res.status(404).json({error: true, data: {message: "Recipe does not exist"}});
        }
    });
});

router.get('/:recipeId/comments', function(req, res, next){
    const {page} = req.query;
    Recipe.where({id: req.params.recipeId}).fetch().then(function(r){
        if(r){
            bookshelf.transaction(function(t){
                var options = {transacting: t};
                Comment.where({recipe_id: req.params.recipeId}).orderBy('time_added', 'ASC').fetchAll({withRelated: ['user']}).then(function(comments){
                    var paged = Pagination.commentPage(comments, page);
                    res.status(200).json({error: false, data: {comments: paged[0].mask(Comment.forge().masks.toRecipeWithUser), pagination: paged[1]}});
                    //res.status(200).json({error: false, data: {comments: comments.mask(Comment.forge().masks.toRecipeWithUser)}});
                }).then(t.commit).catch(t.rollback);
            }).catch(function(err){
                res.status(500).json({error: true, data: {message: err.message}});
            });
        } else {
            res.status(404).json({error: true, data: {message: "Recipe does not exist"}});
        }
    });
});

router.post('/', function(req, res, next){
    const {recipe} = req.body;
    var getId = Auth.getUserId(req.headers.authorization);
    getId.then(function(uid){
        if(uid){
            cloudinary.v2.uploader.upload(recipe.imagebase64, {width: 556, height: 370, gravity: "auto", crop: "fill"}, function(error, result) {
                if(error){
                    res.status(400).json({error: true, data: {message: "Error uploading image"}});
                } else {
                    const image_url = result.url;
                    delete recipe.imagebase64;
                    recipe.image_url = image_url;
                    recipe.user_id = uid;
                    addRecipe(recipe).then(function(item){
                        res.status(200).json({error: false, data: {recipe_id: item}});
                    }).catch(function(err){
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
                }
            });
        } else {
            res.status(401).json({error: true, data: {message: 'Invalid authorization'}});
        }
    })
});

router.get('/', function(req, res, next){
    const {category, excludes, includes, keyword, search, page} = req.query;
    if(!category){
        var c = null;
    } else if(category.constructor !== Array){
        var c = [category];
    } else {
        var c = category;
    }
    const categories = c;
    if(!includes){
        var e = null;
    } else if(includes.constructor !== Array){
        var e = [includes];
    } else {
        var e = includes;
    }
    const include = e;
    if(!excludes){
        var d = null;
    } else if(excludes.constructor !== Array){
        var d = [excludes];
    } else {
        var d = excludes;
    }
    const exclude = d;
    console.log(req.headers.authorization);
    var getId = Auth.getUserId(req.headers.authorization);
    getId.then(function(uid){
        console.log(uid);
        if(search === 'category'){
            const voteandsave = bookshelf.knex.raw('hasSaved(?, id) as saved, getVote(?, id) as vote', [uid, uid]);
            const hasCategories = {};
            var promises = [];
            if(categories){
                for(var i = 0; i < categories.length; i++){
                    promises.push(Category_Recipe.query({where: {category_id: categories[i]}}).fetchAll({columns: ['recipe_id']}).then(function(recipes){
                        r = recipes.toJSON();
                        for(var i = 0; i < r.length; i++){
                            var id = r[i].recipe_id;
                            if(hasCategories[id]){
                                hasCategories[id] = hasCategories[id] + 1;
                            } else {
                                hasCategories[id] = 1;
                            }
                        }
                    }));
                }
            }
            if(promises.length > 0){
                Promise.all(promises).then(function(){
                    var ids = [];
                    const ranges = [];
                    const finalRecipes = [];
                    var promises = [];
                    var keys = Object.keys(hasCategories);
                    for(var i = 1; i <= categories.length; i++){
                        ranges[i] = [];
                    }
                    for(var i = 0; i < keys.length; i++){
                        var index = hasCategories[keys[i]];
                        ranges[index].push(keys[i]);
                    }

                    for(var i = categories.length; i > 0; i--){
                        promises.push(Recipe.query(function(qb){
                            if(uid){
                                return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score', voteandsave)
                                         .whereIn('id', ranges[i])
                                         .orderBy('score', 'DESC');
                            } else {
                                return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score')
                                         .whereIn('id', ranges[i])
                                         .orderBy('score', 'DESC');
                            }
                        }).fetchAll().then(function(recipes){
                            var results = recipes.toJSON();
                            if(keyword){
                                if(keyword.trim().length > 0){
                                    var options = {
                                        shouldSort: true,
                                        threshold: 0.2,
                                        location: 0,
                                        distance: 1000,
                                        maxPatternLength: 32,
                                        minMatchCharLength: 3,
                                        keys: [
                                            "title"
                                        ]
                                    };
                                    var fuse = new Fuse(results, options);
                                    var results = fuse.search(keyword);
                                }
                            }
                            for(var i = 0; i < results.length; i++){
                                finalRecipes.push(results[i])
                            }
                        }));
                    }
                    Promise.all(promises).then(function(){
                        var paged = Pagination.recipePage(finalRecipes, page);
                        res.status(200).json({error: false, data: {recipes: paged[0], pagination: paged[1]}});
                    });
                });
            } else {
                if(keyword){
                    if(keyword.trim().length > 0){
                        Recipe.fetchAll({columns: ['id', 'title']}).then(function(recipes){
                            var options = {
                                id: "id",
                                shouldSort: true,
                                threshold: 0.2,
                                location: 0,
                                distance: 1000,
                                maxPatternLength: 32,
                                minMatchCharLength: 3,
                                keys: [
                                    "title"
                                ]
                            };
                            var fuse = new Fuse(recipes.toJSON(), options);
                            var result = fuse.search(keyword);
                            const coll = Recipe.collection();
                            var modelList = [];
                            for(var i = 0; i < result.length; i++){
                                modelList.push(new Recipe({id: result[i]}));
                            }
                            coll.reset(modelList);
                            const modelList2 = [];
                            var proms = [];
                            for(var i = 0; i < result.length; i++){
                                proms.push(coll.at(i).query(function(qb){
                                    if(uid){
                                        return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score', voteandsave)
                                                 .orderBy('score', 'DESC');
                                    } else {
                                        return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score')
                                                 .orderBy('score', 'DESC');
                                    }
                                }).fetch().then(function(recipe){
                                    modelList2.push(recipe);
                                }));
                            }
                            Promise.all(proms).then(function(){
                                coll.reset(modelList2);
                                var paged = Pagination.recipePage(coll, page);
                                res.status(200).json({error: false, data: {recipes: paged[0], pagination: paged[1]}});
                            });
                        });
                    }
                } else {
                    res.status(400).json({error: true, data: {message: 'Need to specify a keyword or category parameter'}});
                }
            }
        } else if(search === 'ingredient'){
            if(include || exclude){
                Recipe.query(function(qb){
                    var voteandsave = bookshelf.knex.raw('hasSaved(?, id) as saved, getVote(?, id) as vote', [uid, uid]);
                    if(include && exclude){
                        var query = '(';
                        for(var i = 0; i < include.length; i++){
                            if(i == 0){
                                query += 'hasFood(id, \'' + include[i] + '\')';
                            } else {
                                query += ' + hasFood(id, \'' + include[i] + '\')';
                            }
                        }
                        query += ') as include_count';
                        var incl = bookshelf.knex.raw(query);
                        var excl = bookshelf.knex('ingredient_recipe').count('ingredient_id').whereIn('ingredient_id', function(){
                            this.select('ingredient_id').from('similar_ingredient').whereIn('ingredient_name', exclude);
                        }).andWhere(function(){
                            this.whereRaw('recipe_id = recipe.id');
                        }).as('exclude_count');
                        if(uid){
                            return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score', incl, excl, voteandsave)
                                     .having('exclude_count', '=', 0)
                                     .andHaving('include_count', '=', include.length)
                                     .orderBy('include_count', 'DESC')
                                     .orderBy('score', 'DESC');
                        } else {
                            return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score', incl, excl)
                                     .having('exclude_count', '=', 0)
                                     .andHaving('include_count', '=', include.length)
                                     .orderBy('include_count', 'DESC')
                                     .orderBy('score', 'DESC');
                        }

                    } else if(include){
                        var query = '(';
                        for(var i = 0; i < include.length; i++){
                            if(i == 0){
                                query += 'hasFood(id, \'' + include[i] + '\')';
                            } else {
                                query += ' + hasFood(id, \'' + include[i] + '\')';
                            }
                        }
                        query += ') as include_count';
                        var incl = bookshelf.knex.raw(query);
                        if(uid){
                            return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score', incl, voteandsave)
                                     .having('include_count', '=', include.length)
                                     .orderBy('include_count', 'DESC')
                                     .orderBy('score', 'DESC');
                        } else {
                            return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score', incl)
                                     .having('include_count', '=', include.length)
                                     .orderBy('include_count', 'DESC')
                                     .orderBy('score', 'DESC');
                        }

                    } else {
                        var excl = bookshelf.knex('ingredient_recipe').count('ingredient_id').whereIn('ingredient_id', function(){
                            this.select('ingredient_id').from('similar_ingredient').whereIn('ingredient_name', exclude);
                        }).andWhere(function(){
                            this.whereRaw('recipe_id = recipe.id');
                        }).as('exclude_count');
                        if(uid){
                            return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score', excl, voteandsave)
                                     .having('exclude_count', '=', 0)
                                     .orderBy('score', 'DESC');
                        } else {
                            return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score', excl)
                                     .having('exclude_count', '=', 0)
                                     .orderBy('score', 'DESC');
                        }

                    }
                }).fetchAll().then(function(recipes){
                    var paged = Pagination.recipePage(recipes, page);
                    res.status(200).json({error: false, data: {recipes: paged[0], pagination: paged[1]}});
                }).catch(function(err){
                    res.status(500).json({error: true, data: {message: err.message}});
                });
            } else {
                res.status(400).json({error: true, data: {message: 'Need to specify at least one ingredient'}});
            }
        } else if (search == 'popular'){
            Recipe.query(function(qb){
                var voteandsave = bookshelf.knex.raw('hasSaved(?, id) as saved, getVote(?, id) as vote', [uid, uid]);
                if(uid){
                    return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score', voteandsave)
                             .orderBy('score', 'DESC');
                } else {
                    return qb.select('id', 'title', 'image_url', 'likes', 'dislikes', 'score')
                             .orderBy('score', 'DESC');
                }
            }).fetchAll().then(function(recipes){
                var paged = Pagination.recipePage(recipes, page);
                res.status(200).json({error: false, data: {recipes: paged[0], pagination: paged[1]}});
            });
        } else {
            res.status(400).json({error: true, data: {message: 'Need to choose a type'}});
        }
    });

});

function addRecipe(recipe) {
    return bookshelf.transaction(function(t){
        var options = {transacting: t};
        var recipeObj = {title: recipe.title, duration: recipe.readyInMinutes, image_url: recipe.image_url, source_url: recipe.sourceUrl, source: recipe.sourceName, user_id: recipe.user_id, servings: recipe.servings, description: recipe.description};
        return Recipe.forge(recipeObj).save(null, options).then(function(r){
            var helpers = [];
            if(recipe.instructions.length > 0){
                var instructions = recipe.instructions;
                for(var i = 0; i < instructions.length; i++){
                    helpers.push(Instruction.forge({recipe_id: r.id, step_num: i + 1, instruction: instructions[i].step}).save(null, options));
                }
            }
            if(recipe.vegetarian === true){
                helpers.push(Category_Recipe.forge({recipe_id: r.id, category_id: 1}).save(null, options));
            }
            if(recipe.vegan === true){
                helpers.push(Category_Recipe.forge({recipe_id: r.id, category_id: 2}).save(null, options));
            }
            if(recipe.glutenFree === true){
                helpers.push(Category_Recipe.forge({recipe_id: r.id, category_id: 3}).save(null, options));
            }
            if(recipe.dairyFree === true){
                helpers.push(Category_Recipe.forge({recipe_id: r.id, category_id: 4}).save(null, options));
            }
            var categories = recipe.categories;
            for(var i = 0; i < categories.length; i++){
                helpers.push(Category_Recipe.forge({recipe_id: r.id, category_id: categories[i]}).save(null, options));
            }
            var ingredients = recipe.ingredients;
            var measures = ['ml', 'l', 'tsp', 'Tbsp', 'fl-oz', 'cup', 'pnt', 'qt', 'gal', 'g', 'kg', 'oz', 'lb'];
            for(var i = 0; i < ingredients.length; i++){
                var ing = ingredients[i];
                var ingData = {};

                ingData.recipe_id = r.id;
                if(ing.id === null){
                    ingData.ingredient_id = 0;
                } else {
                    ingData.ingredient_id = ing.id;
                }

                if(ing.extra_info){
                    ingData.extra_info = ing.extra_info;
                }

                var unit;
                var hasRealUnit = true;
                if(!measures.includes(ing.unit)){
                    if(ing.unit){
                        unit = pluralize(ing.unit, ing.amount);
                    } else {
                        hasRealUnit = false;
                        unit = pluralize(ing.name, ing.amount);
                    }

                } else {
                    unit = ing.unit;
                    if(['cup', 'Tbsp', 'tsp'].includes(unit)){
                        unit = pluralize(ing.unit, ing.amount);
                    }
                }
                ingData.amount = ing.amount;
                ingData.unit = unit;
                if(hasRealUnit){
                    ingData.original_string = ingData.amount + " " + ingData.unit + " " + ing.name;
                } else {
                    ingData.original_string = ingData.amount + " " + ingData.unit;
                }
                if(ingData.extra_info){
                    ingData.original_string = ingData.original_string + ", " + ingData.extra_info;
                }
                helpers.push(Ingredient_Recipe.forge(ingData).save(null, options));
            }
            return Promise.all(helpers).then(function(){return r.id;});
        }).then(t.commit).catch(t.rollback);
    });
}

/*hash for category ids
var categories = {};
categories.vegetarian = 1;
categories.vegan = 2;
categories["gluten free"] = 3;
categories["dairy free"] = 4;
categories["main course"] = 5;
categories["side dish"] = 6;
categories.dessert = 7;
categories.appetizer = 8;
categories.salad = 9;
categories.bread = 10;
categories.breakfast = 11;
categories.soup = 12;
categories.beverage = 13;
categories.sauce = 14,
categories.drink = 15;
categories.african = 16;
categories.chinese = 17;
categories.chines = 17;
categories.japanese = 18;
categories.japanes = 18;
categories.korean = 19;
categories.thai = 20;
categories.indian = 21;
categories.vietnamese = 22;
categories.vietnames = 22;
categories.british = 23;
categories.irish = 24;
categories.french = 25;
categories.italian = 26;
categories.mexican = 27;
categories.spanish = 28;
categories["middle eastern"] = 29;
categories["middl eastern"] = 29;
categories.jewish = 30;
categories.american = 31;
categories.cajun = 32;
categories.southern = 33;
categories.greek = 34;
categories.german = 35;
categories.nordic = 36;
categories["eastern european"] = 37;
categories.caribbean = 38;
categories["latin american"] = 39;


router.get('/', function(req, res, next){
    const recipes = data.body.recipes;

    var recipeArr = [];
    for(var i = 0; i < recipes.length; i++){
        var recipe = recipes[i];
        recipeArr.push(addRecipe(recipe));
    }
    Promise.all(recipeArr).then(function(){
        res.status(200).json({error: false, data: {hello: "world"}});
    }).catch(function(err){
        res.status(500).json({error: true, data: {message: err.message}});
    });
});

function addRecipe(recipe) {
    return bookshelf.transaction(function(t){
        var options = {transacting: t};
        var recipeObj = {servings: recipe.servings, title: recipe.title, duration: recipe.readyInMinutes, image_url: recipe.image, source_url: recipe.sourceUrl, source: recipe.sourceName, spoonacular_id: recipe.id};
        return Recipe.forge(recipeObj).save(null, options).then(function(r){
            var helpers = [];
            if(recipe.analyzedInstructions.length > 0){
                var instructions = recipe.analyzedInstructions[0].steps;
                for(var i = 0; i < instructions.length; i++){
                    helpers.push(Instruction.forge({recipe_id: r.id, step_num: instructions[i].number, instruction: instructions[i].step}).save(null, options));
                }
            }
            if(recipe.vegetarian === true){
                helpers.push(Category_Recipe.forge({recipe_id: r.id, category_id: categories.vegetarian}).save(null, options));
            }
            if(recipe.vegan === true){
                helpers.push(Category_Recipe.forge({recipe_id: r.id, category_id: categories.vegan}).save(null, options));
            }
            if(recipe.glutenFree === true){
                helpers.push(Category_Recipe.forge({recipe_id: r.id, category_id: categories["gluten free"]}).save(null, options));
            }
            if(recipe.dairyFree === true){
                helpers.push(Category_Recipe.forge({recipe_id: r.id, category_id: categories["dairy free"]}).save(null, options));
            }
            var cats = recipe.cuisines;
            cats = cats.concat(recipe.dishTypes);
            for(var i = 0; i < cats.length; i++){
                if(categories[cats[i]]){
                    helpers.push(Category_Recipe.forge({recipe_id: r.id, category_id: categories[cats[i]]}).save(null, options));
                }
            }
            var ingredients = recipe.extendedIngredients;
            for(var i = 0; i < ingredients.length; i++){
                var ing = ingredients[i];
                var ingData = {};
                ingData.original_string = ing.original;
                ingData.recipe_id = r.id;
                if(ing.id === null){
                    ingData.ingredient_id = 0;
                } else {
                    ingData.ingredient_id = ing.id;
                }
                var extra = "";
                for(var j = 0; j < ing.meta.length; j++){
                    if(j === 0){
                        extra = extra + ing.meta[j];
                    } else {
                        extra = extra + ", " + ing.meta[j];
                    }
                }
                ingData.extra_info = extra;
                var unit;
                if(ing.unit === ""){
                    unit = pluralize(ing.name, ing.amount);
                    ingData.amount = ing.amount;
                    ingData.unit = unit;
                } else {
                    ingData.amount = ing.amount;
                    ingData.unit = ing.unitShort;
                }
                helpers.push(Ingredient_Recipe.forge(ingData).save(null, options));
            }
            return Promise.all(helpers);
        }).then(t.commit).catch(t.rollback);
    });
}*/

module.exports = router;
