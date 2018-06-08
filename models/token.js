var bookshelf = require('../config/bookshelf');

var Token = bookshelf.Model.extend({
    tableName: 'Token'
});

module.exports = bookshelf.model('Token', Token);
