var bookshelf = require('../config/bookshelf');
var securePassword = require('bookshelf-secure-password');
var mask = require('bookshelf-mask');

require('./recipe');
require('./vote');
require('./category');

bookshelf.plugin(securePassword);
bookshelf.plugin(mask);
bookshelf.plugin('visibility');

var User = bookshelf.Model.extend({
    tableName: 'user',

    uploaded_recipes: function(){
        return this.hasMany('Recipe');
    },
    liked_recipes: function(){
        return this.belongsToMany('Recipe', 'votes').query({where: {type: 'l'}});
    },
    disliked_recipes: function(){
        return this.belongsToMany('Recipe', 'votes').query({where: {type: 'd'}});
    },
    saved_recipes: function(){
        return this.belongsToMany('Recipe', 'recipe_user_saved');
    },
    subscribed_to: function(){
        return this.belongsToMany('Category');
    },
    hasSecurePassword: true,
    hidden: ['password_digest'],
    masks:{
        own: 'username,about,email',
        visitor: 'username,about'
    }
});

module.exports = bookshelf.model('User', User);
