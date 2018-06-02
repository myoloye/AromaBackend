var bookshelf = require('../config/bookshelf');

var Token = bookshelf.Model.extend({
    tableName: 'token'
});

module.exports = bookshelf.model('Token', Token);
