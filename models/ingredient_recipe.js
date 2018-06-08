var bookshelf = require('../config/bookshelf');

require('./recipe');
require('./ingredient');

bookshelf.plugin('visibility');

var Ingredient_Recipe = bookshelf.Model.extend({
    tableName: 'Ingredient_Recipe',

    ingredients: function(){
        return this.belongsTo('Ingredient');
    },
    recipes: function(){
        return this.belongsTo('Recipe');
    }

});

module.exports = bookshelf.model('Ingredient_Recipe', Ingredient_Recipe);
