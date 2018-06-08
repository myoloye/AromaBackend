var bookshelf = require('../config/bookshelf');
var mask = require('bookshelf-mask');

require('./category');
require('./user');

bookshelf.plugin(mask);
bookshelf.plugin('visibility');

var CategoryUser = bookshelf.Model.extend({
    tableName: 'Category_User',

    user: function(){
        return this.belongsTo('User');
    },
    recipe: function(){
        return this.belongsTo('Recipe');
    }
});

module.exports = bookshelf.model('CategoryUser', CategoryUser);
