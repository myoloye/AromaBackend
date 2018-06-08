var bookshelf = require('../config/bookshelf');
var mask = require('bookshelf-mask');
var CheckIt = require('checkit');

require('./user');
require('./ingredient');
require('./ingredient_recipe');
require('./category');
var Instruction = require('./instruction');
require('./comment');

bookshelf.plugin(mask);
bookshelf.plugin('visibility');

var Recipe = bookshelf.Model.extend({
    initialize: function() {
        this.on('saving', this.validate);
    },
    validations: {
        title: [
            {
                rule: 'required',
                message: 'title is required'
            },
            {
                rule: 'maxLength:150',
                message: 'title must be less than 150 characters'
            }
        ],
        description: [
            {
                rule: 'maxLength:500',
                message: 'description must be less than 500 characters'
            }
        ],
        duration: [
            {
                rule: 'natural',
                message: 'duration must be an integer'
            },
            {
                rule: 'required',
                message: 'duration is required'
            }
        ],
        servings: [
            {
                rule: 'naturalNonZero',
                message: 'recipe must have at least one serving'
            },
            {
                rule: 'required',
                message: 'number of servings is required'
            }
        ],
        source_url: [
            {
                rule: 'url',
                message: 'source_url must be a valid url'
            },
            {
                rule: 'maxLength:300',
                message: 'source_url must be less than 300 characters'
            }
        ],
        source:[
            {
                rule: 'maxLength:50',
                message: 'source must be less than 50 characters'
            }
        ]
    },
    tableName: 'Recipe',

    user: function(){
        return this.belongsTo('User');
    },
    ingredients: function(){
        return this.belongsToMany('Ingredient').withPivot(['original_string', 'amount', 'unit', 'extra_info']);
    },
    categories: function(){
        return this.belongsToMany('Category');
    },
    instructions: function(){
        return this.hasMany('Instruction', 'recipe_id').orderBy('step_num', 'ASC');
    },
    comments: function(){
        return this.hasMany('Comment').orderBy('time_added', 'ASC');
    },
    masks:{
        searchDisplay: 'id,title,image_url,likes,dislikes,score'
    },
    validate: function(model, attrs, options) {
        var check = new CheckIt(this.validations);
        return check.run(this.toJSON({visibility: false}));
    }
});

module.exports = bookshelf.model('Recipe', Recipe);
