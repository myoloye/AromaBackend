var bookshelf = require('../config/bookshelf');
require('./ingredient');

var SimilarIngredient = bookshelf.Model.extend({
    tableName: 'similaringredient',

    ingredients: function(){
        return this.belongsTo('Ingredient');
    }

});
module.exports = bookshelf.model('SimilarIngredient', SimilarIngredient);
