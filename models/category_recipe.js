var bookshelf = require('../config/bookshelf');

require('./recipe');
require('./category');

bookshelf.plugin('visibility');

var Category_Recipe = bookshelf.Model.extend({
    tableName: 'Category_Recipe',

    categories: function(){
        return this.belongsTo('Category');
    },
    recipes: function(){
        return this.belongsTo('Recipe');
    }

});

module.exports = bookshelf.model('Category_Recipe', Category_Recipe);
