var Recipe = require('../models/recipe');
var Comment = require('../models/comment');
exports.recipePage = function(recipeCollection, page){
    var count = recipeCollection.toJSON().length;
    var pageNum;
    var pages = Math.ceil(count/25);
    if(!page){
        pageNum = 1;
    } else {
        pageNum = page;
    }
    var first = (pageNum - 1) * 25;
    var last = first + 25;
    if(pageNum == pages){
        last = count;
    }
    var pagedRecipes = Recipe.collection();
    for(var i = first; i < last; i++){
        pagedRecipes = pagedRecipes.add(recipeCollection.models[i]);
    }
    var pagination = {rowCount: count, pageCount: pages, page: pageNum, pageSize: 25};
    return [pagedRecipes, pagination];
}

exports.commentPage = function(commentCollection, page){
    var count = commentCollection.toJSON().length;
    var pageNum;
    var pages = Math.ceil(count/100);
    if(!page){
        pageNum = 1;
    } else {
        pageNum = page;
    }
    var first = (pageNum - 1) * 100;
    var last = first + 100;
    if(pageNum == pages){
        last = count;
    }
    var pagedComments = Comment.collection();
    for(var i = first; i < last; i++){
        pagedRecipes = pagedComments.add(commentCollection.models[i]);
    }
    var pagination = {rowCount: count, pageCount: pages, page: pageNum, pageSize: 100};
    return [pagedComments, pagination];
}
