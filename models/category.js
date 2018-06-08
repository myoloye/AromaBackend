var bookshelf = require('../config/bookshelf');

require('./user');
require('./recipe');

bookshelf.plugin('visibility');

var Category = bookshelf.Model.extend({
    tableName: 'Category',

    recipes: function(){
        return this.belongsToMany('Recipe');
    },
    subscribed_users: function(){
        return this.belongsToMany('User');
    }
});

module.exports = bookshelf.model('Category', Category);
