var bookshelf = require('../config/bookshelf');

require('./ingredient_recipe');
require('./recipe');

var Ingredient = bookshelf.Model.extend({
    tableName: 'Ingredient',

    recipes: function(){
        return belongsToMany('Recipe').through('Ingredient_Recipe');
    }
});

module.exports = bookshelf.model('Ingredient', Ingredient);
