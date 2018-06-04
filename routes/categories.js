var express = require('express');
var router = express.Router();
var bookshelf = require('../config/bookshelf');
var Recipe = require('../models/recipe');
var Category = require('../models/category');

router.get('/', function(req, res, next){
    Category.fetchAll().then(function(ingredients){
        res.status(200).json({error: false, data: {categories: ingredients}});
    }).catch(function(err){
        res.status(500).json({error: true, data: {message: err.message}});
    });
});

module.exports = router;
