var bookshelf = require('../config/bookshelf');
var mask = require('bookshelf-mask');
require('./recipe');
require('./user');
var CheckIt = require('checkit');

bookshelf.plugin(mask);
bookshelf.plugin('visibility');

var Comment = bookshelf.Model.extend({
    initialize: function() {
        this.on('saving', this.validate);
    },
    validations: {
        comment: [
            {
                rule: function(val){
                    if(val.constructor === String){
                        if(val.trim().length < 1){
                            throw new Error('comment can\'t be empty');
                        }
                    }
                }
            },
            {
                rule: 'required',
                message: 'comment is required'
            },
            {
                rule: 'string',
                message: 'comment must be a string'
            },
            {
                rule: 'maxLength:300',
                message: 'comment must be less than 300 characters'
            }
        ]
    },
    tableName: 'Comment',

    recipe: function(){
        return this.belongsTo('Recipe');
    },
    user: function(){
        return this.belongsTo('User');
    },
    masks:{
        toRecipe: 'id,comment,time_added',
        toRecipeWithUser: 'id,comment,time_added,user(id,username)',
        essentialWithUser: 'id,recipe_id,comment,time_added,user(id,username)'
    },
    validate: function(model, attrs, options) {
        var check = new CheckIt(this.validations);
        return check.run(this.toJSON({visibility: false}));
    }
});

module.exports = bookshelf.model('Comment', Comment);
