var express = require('express');
var router = express.Router();
var bookshelf = require('../config/bookshelf');
var User = require('../models/user');
var Recipe = require('../models/recipe');
var Vote = require('../models/vote');
var CategoryUser = require('../models/category_user');
var RecipeUserSaved = require('../models/recipe_user_saved');
var Category = require('../models/category');
var Token = require('../models/token');
var Auth = require('../lib/auth');
var uuidv4 = require('uuid/v4');
var jwt = require('jsonwebtoken');
var CheckIt = require('checkit');

//add functionality to check that the username, email, and password aren't empty/null
router.post('/', function(req, res, next){
    const {user} = req.body;
    bookshelf.transaction(function(t){
        var options = {transacting: t};
        User.forge(user).save(null, options).then(t.commit).catch(t.rollback);
    }).then(function(user){
        res.status(200).json({error: false, data: {id: user.id}});
    }).catch(function(err){
        if(err instanceof CheckIt.Error){
            res.status(400).json({error: true, data: {message: err.toJSON()}});
        } else {
            res.status(500).json({error: true, data: {message: err.message}});
        }
    });
});

router.post('/token', function(req, res, next){
    const {user} = req.body;
    return User.where({email: user.email}).fetch().then(function(u1){
        if(u1){
            return u1.authenticate(user.password);
        } else {
            return User.where({username: user.email}).fetch().then(function(u2){
                return u2.authenticate(user.password);
            });
        }
    }).then(function(valUser){
        const jti = uuidv4();
        console.log(2);
        jwt.sign({id: valUser.id}, process.env.APPLICATION_SECRET, {jwtid: jti}, function(err, t){
            if(t){
                console.log(1);
                Token.forge({token: jti}).save().then(function(jwtid){
                    res.status(200).json({error: false, data: {token: t, user: valUser.id}});
                });
            } else {
                res.status(500).json({error: true, data: {message: err.message}});
            }
        });
    }).catch(function(err){
        if(err.name = 'PasswordMismatchError'){
            res.status(400).json({error: true, data: {message: "Invalid credentials"}});
        } else {
            res.status(500).json({error: true, data: {message: err.message}});
        }
    });
});

router.post('/logout', function(req, res, next){
    if(!req.headers.authorization){
        res.status(401).json({error: true, data: {message: "Missing Authorization Header"}});
    } else {
        var token = req.headers.authorization.split(/\s+/)[1];
        var tokenId = Auth.verifyToken(token);
        if(tokenId){
            bookshelf.transaction(function(t){
                var options = {transacting: t};
                return Token.where({token: tokenId}).fetch().then(function(t){
                    if(t){
                        return t.destroy(options);
                    }
                    return null;
                })
            }).then(function(success){
                res.status(200).json({error: false});
            }).catch(function(err){
                res.status(500).json({error: true, data: {message: err.message}});
            });
        } else {
            res.status(200).json({error: false});
        }
    }
});

//to do: add check to determine if the user is viewing their own profile
router.get('/:userId', function(req, res, next){
    var getId = Auth.getUserId(req.headers.authorization);
    getId.then(function(uid){
        bookshelf.transaction(function(t){
            var options = {transacting: t};
            User.where({id: req.params.userId}).fetch({withRelated: ['uploaded_recipes']}).then(t.commit).catch(t.rollback);
        }).then(function(user){
            if(user){
                if(uid === user.id){
                    res.status(200).json({error: false, data: {user: user.mask('id,username,about,email,uploaded_recipes(id,title,image_url,likes,dislikes,score)')}});
                } else {
                    res.status(200).json({error: false, data: {user: user.mask('id,username,about,uploaded_recipes(id,title,image_url,likes,dislikes,score)')}})
                }
            } else {
                res.status(404).json({error: false, data: {message: "User does not exist"}});
            }
        }).catch(function(err){
            res.status(500).json({error: true, data: {message: 'Server error'}});
        });
    });
});

router.get('/:userId/subscriptions', Auth.authSameUser, function(req, res, next){
    bookshelf.transaction(function(t){
        var options = {transacting: t};
        User.where({id: req.params.userId}).fetch({withRelated: ['subscribed_to']}).then(t.commit).catch(t.rollback);
    }).then(function(user){
        if(user){
            res.status(200).json({error: false, data: {categories: user.related('subscribed_to').mask('id,name')}});
        } else {
            res.status(404).json({error: false, data: {message: "User does not exist"}});
        }
    }).catch(function(err){
        res.status(500).json({error: true, data: {message: err.message}});
    });
});

router.post('/:userId/subscriptions/:categoryId', Auth.authSameUser, function(req, res, next){
    const {action} = req.query;
    const {userId, categoryId} = req.params;
    if(action){
        if(action.constructor === Array){
            res.status(400).json({error: true, data: {message: "Enter only one action"}});
        } else {
            if(action === 'subscribe' || action === 'unsubscribe'){
                Category.where({id: categoryId}).fetch().then(function(c){
                    if(c){
                        bookshelf.transaction(function(t){
                            var options = {transacting: t};
                            return CategoryUser.where({user_id: userId, category_id: categoryId}).fetch().then(function(category){
                                if(category){
                                    if(action === 'unsubscribe'){
                                        return category.destroy(options);
                                    }
                                    return categoryId;
                                } else {
                                    if(action === 'subscribe'){
                                        return CategoryUser.forge({user_id: userId, category_id: categoryId}).save(null, options);
                                    }
                                    return categoryId;
                                }
                            }).then(t.commit).catch(t.rollback);
                        }).then(function(category){
                            res.status(200).json({error: false, data: {category_id: categoryId}});
                        }).catch(function(err){
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                    } else {
                        res.status(404).json({error: true, data: {message: "Category does not exist"}});
                    }
                });
            } else {
                res.status(400).json({error: true, data: {message: "Invalid action. Valid values are 'subscribe' and 'unsubscribe'."}});
            }
        }
    } else {
        res.status(400).json({error: true, data: {message: "Specify the action. Valid values are 'subscribe' and 'unsubscribe'."}});
    }
});

router.post('/:userId', Auth.authSameUser, function(req, res, next){
    const {about} = req.body;
    if(about){
        if(about.length > 0 && about.constructor !== Array){
            bookshelf.transaction(function(t){
                var options = {transacting: t};
                var options2 = options;
                options2.patch = true;
                User.where({id: req.params.userId}).fetch().then(function(user){
                    return user.save({about: about}, options2);
                }).then(t.commit).catch(t.rollback);
            }).then(function(user){
                res.status(200).json({error: false, data: {about: user.get("about")}});
            }).catch(function(err){
                res.status(500).json({error: true, data: {message: err.message}});
            });
        } else {
            res.status(400).json({error: true, data: {message: "About should be a string of length greater than 0"}});
        }
    } else {
        res.status(400).json({error: true, data: {message: "Specify an about field"}});
    }
});

router.get('/:userId/recipes', Auth.authSameUser, function(req, res, next){
    const {type} = req.query;
    if(!type){
        res.status(400).json({error: true, data: {message: "Specify the type of recipes. Valid values are 'saved', 'liked', 'disliked', and 'uploaded'."}});
    } else {
        if(type.constructor !== Array){
            var r;
            if(type === 'saved'){
                r = 'saved_recipes';
            } else if (type === 'liked'){
                r = 'liked_recipes';
            } else if (type === 'disliked'){
                r = 'disliked_recipes';
            } else if (type === 'uploaded'){
                r = null;
            } else {
                res.status(400).json({error: true, data: {message: "Invalid type. Valid values are 'saved', 'liked', 'disliked', and 'uploaded'."}});
            }
            const related = r;
            if(related){
                bookshelf.transaction(function(t){
                    var options = {transacting: t};
                    User.where({id: req.params.userId}).fetch({withRelated: [related]}).then(t.commit).catch(t.rollback);
                }).then(function(user){
                    res.status(200).json({error: false, data: {recipes: user.related(related).mask(Recipe.forge().masks.searchDisplay)}});
                }).catch(function(err){
                    res.status(500).json({error: true, data: {message: err.message}});
                });
            } else {
                bookshelf.transaction(function(t){
                    var options = {transacting: t};
                    return Recipe.where({user_id: req.params.userId}).fetchAll();
                }).then(function(recipes){
                    res.status(200).json({error: false, data: {recipes: recipes.mask(Recipe.forge().masks.searchDisplay)}});
                }).catch(function(err){
                    res.status(500).json({error: true, data: {message: err.message}});
                });
            }
        } else {
            res.status(400).json({error: true, data: {message: "Enter only one type"}});
        }
    }
});

router.post('/:userId/recipes/:recipeId', Auth.authSameUser, function(req, res, next){
    const {action} = req.query;
    const {recipeId, userId} = req.params;
    if (!action){
        res.status(400).json({error: true, data: {message: "Specify the action. Valid values are 'like', 'dislike', 'neutralize', 'save', and 'unsave'."}});
    } else {
        if(recipeId.constructor === Array || action.constructor === Array){
            res.status(400).json({error: true, data: {message: "Enter only one action"}});
        } else {
            Recipe.where({id: recipeId}).fetch().then(function(r){
                if(r){
                    if(action === 'neutralize' || action === 'unsave'){
                        var model;
                        if(action === 'neutralize'){
                            model = Vote;
                        } else {
                            model = RecipeUserSaved;
                        }
                        bookshelf.transaction(function(t){
                            var options = {transacting: t};
                            return model.where({user_id: userId, recipe_id: recipeId}).fetch().then(function(m){
                                if(m){
                                    return m.destroy(options);
                                }
                            }).then(t.commit).catch(t.rollback);
                        }).then(function(obj){
                            res.status(200).json({error: false, data: {recipe_id: recipeId}});
                        }).catch(function(err){
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                    } else if(action === 'like' || action === 'dislike'){
                        var choice;
                        if(action === 'like'){
                            choice = 'l';
                        } else {
                            choice = 'd';
                        }
                        bookshelf.transaction(function(t){
                            var options = {transacting: t};
                            return Vote.where({user_id: userId, recipe_id: recipeId}).fetch().then(function(vote){
                                if(!vote){
                                    return Vote.forge({user_id: userId, recipe_id: recipeId, type: choice}).save(null, options);
                                } else {
                                    var options2 = options;
                                    options2.patch = true;
                                    return vote.save({type: choice}, options2);
                                }
                            }).then(t.commit).catch(t.rollback);
                        }).then(function(recipe){
                            res.status(200).json({error: false, data: {recipe: recipeId}});
                        }).catch(function(err){
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                    } else if(action === 'save') {
                        bookshelf.transaction(function(t){
                            var options = {transacting: t};
                            return RecipeUserSaved.where({user_id: userId, recipe_id: recipeId}).fetch().then(function(saved){
                                if(!saved){
                                    return RecipeUserSaved.forge({user_id: userId, recipe_id: recipeId}).save(null, options);
                                }
                            }).then(t.commit).catch(t.rollback);
                        }).then(function(recipe){
                            res.status(200).json({error: false, data: {recipe: recipeId}});
                        }).catch(function(err){
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                    } else {
                        res.status(400).json({error: true, data: {message: "Invalid action. Valid values are Valid values are 'like', 'dislike', 'neutralize', 'save', and 'unsave'."}});
                    }
                } else {
                    res.status(404).json({error: true, data: {message: "Recipe does not exist"}});
                }
            }).catch(function(err){
                res.status(500).json({error: true, data: {message: err.message}});
            });
        }
    }
});
module.exports = router;
