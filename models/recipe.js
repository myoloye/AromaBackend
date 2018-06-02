var bookshelf = require('../config/bookshelf');
var mask = require('bookshelf-mask');

require('./user');
require('./ingredient');
require('./ingredient_recipe');
require('./category');
require('./instruction');
require('./comment');

bookshelf.plugin(mask);
bookshelf.plugin('visibility');

var Recipe = bookshelf.Model.extend({
    tableName: 'recipe',

    user: function(){
        return this.belongsTo('User');
    },
    ingredients: function(){
        return this.belongsToMany('Ingredient').withPivot(['original_string', 'us_amount', 'us_unit', 'metric_amount', 'metric_unit', 'extra_info']);
    },
    categories: function(){
        return this.belongsToMany('Category');
    },
    instructions: function(){
        return this.hasMany('Instruction');
    },
    comments: function(){
        return this.hasMany('Comment').orderBy('time_added', 'ASC');
    },
    masks:{
        searchDisplay: 'id,title,image_url,likes,dislikes,score'
    }
});

module.exports = bookshelf.model('Recipe', Recipe);
