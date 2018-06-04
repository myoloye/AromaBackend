var express = require('express');
var router = express.Router();
var bookshelf = require('../config/bookshelf');
var Ingredient = require('../models/ingredient');
var SimilarIngredient = require('../models/similar_ingredient');

router.get('/', function(req, res, next){
    const {type} = req.query;
    if(type && type === 'searchable'){
        SimilarIngredient.query(function(qb){
            return qb.select(bookshelf.knex.raw('distinct ingredient_name'));
        }).fetchAll({columns: ['ingredient_name']}).then(function(ingredients){
            res.status(200).json({error: false, data: {ingredients: ingredients}});
        }).catch(function(err){
            res.status(500).json({error: true, data: {message: err.message}});
        });
    } else {
        Ingredient.fetchAll().then(function(ingredients){
            res.status(200).json({error: false, data: {ingredients: ingredients}});
        }).catch(function(err){
            res.status(500).json({error: true, data: {message: err.message}});
        });
    }
});

module.exports = router;
