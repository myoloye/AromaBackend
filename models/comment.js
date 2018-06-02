var bookshelf = require('../config/bookshelf');
var mask = require('bookshelf-mask');
require('./recipe');
require('./user');

bookshelf.plugin(mask);
bookshelf.plugin('visibility');

var Comment = bookshelf.Model.extend({
    tableName: 'comment',

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
    }
});

module.exports = bookshelf.model('Comment', Comment);
