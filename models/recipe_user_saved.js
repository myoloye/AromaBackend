var bookshelf = require('../config/bookshelf');
var mask = require('bookshelf-mask');

require('./recipe');
require('./user');

bookshelf.plugin(mask);
bookshelf.plugin('visibility');

var RecipeUserSaved = bookshelf.Model.extend({
    tableName: 'Recipe_User_Saved',

    user: function(){
        return this.belongsTo('User');
    },
    recipe: function(){
        return this.belongsTo('Recipe');
    }
});

module.exports = bookshelf.model('RecipeUserSaved', RecipeUserSaved);
