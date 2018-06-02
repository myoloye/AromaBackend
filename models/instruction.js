var bookshelf = require('../config/bookshelf');

require('./recipe');

bookshelf.plugin('visibility');

var Instruction = bookshelf.Model.extend({
    tableName: 'instruction',

    recipe: function(){
        return this.belongsTo('Recipe');
    }

});

module.exports = bookshelf.model('Instruction', Instruction);
