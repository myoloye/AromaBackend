var bookshelf = require('../config/bookshelf');
var mask = require('bookshelf-mask');

require('./recipe');
require('./user')

bookshelf.plugin(mask);
bookshelf.plugin('visibility');

var Vote = bookshelf.Model.extend({
    tableName: 'votes',

    user: function(){
        return this.belongsTo('User');
    },
    recipe: function(){
        return this.belongsTo('Recipe');
    },
});

module.exports = bookshelf.model('Vote', Vote);
