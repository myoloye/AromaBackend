var bookshelf = require('../config/bookshelf');
var securePassword = require('bookshelf-secure-password');
var mask = require('bookshelf-mask');
var CheckIt = require('checkit');

require('./recipe');
require('./vote');
require('./category');

bookshelf.plugin(securePassword);
bookshelf.plugin(mask);
bookshelf.plugin('visibility');

var User = bookshelf.Model.extend({
    initialize: function() {
        this.on('saving', this.validate);
    },
    validations: {
        email: [
            {
                rule: 'required',
                message: 'email is required'
            },
            {
                rule: 'email',
                message: 'email is invalid'
            },
            {
                rule: function(val) {
                    return bookshelf.knex('user').where('email', '=', val).then(function(resp) {
                        if (resp.length > 0)
                            throw new Error("email is taken");
                    });
                }
            }
        ],
        username: [
            {
                rule: 'required',
                message: 'username is required'
            },
            {
                rule: 'alphaUnderscore',
                message: 'username can only have a-z, A-Z, 0-9, _, and -'
            },
            {
                rule: function(val) {
                    return bookshelf.knex('user').where('username', '=', val).then(function(resp) {
                        if (resp.length > 0)
                            throw new Error("username is taken");
                    });
                }
            }
        ],
        password_digest: [
            {
                rule: 'required',
                message: 'password is required'
            }
        ]
    },
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
    },
    validate: function(model, attrs, options) {
        var check = new CheckIt(this.validations);
        return check.run(this.toJSON({visibility: false}));
    }
});

module.exports = bookshelf.model('User', User);
