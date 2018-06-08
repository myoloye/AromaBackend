var bookshelf = require('../config/bookshelf');
var CheckIt = require('checkit');

require('./recipe');

bookshelf.plugin('visibility');

var Instruction = bookshelf.Model.extend({
    initialize: function() {
        this.on('saving', this.validate);
    },
    validations: {
        instruction: [
            {
                rule: 'required',
                message: 'instruction is required'
            },
            {
                rule: 'maxLength:1000',
                message: 'instruction must be less than 1000 characters'
            }
        ]
    },
    tableName: 'Instruction',

    recipe: function(){
        return this.belongsTo('Recipe', 'recipe_id');
    },
    validate: function(model, attrs, options) {
        var check = new CheckIt(this.validations);
        return check.run(this.toJSON());
    }

});

module.exports = bookshelf.model('Instruction', Instruction);
