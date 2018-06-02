var Token = require('../models/token');
var jwt = require('jsonwebtoken');

var verifyUser = function(token, id){
    return jwt.verify(token, 'replacewithrealsecretlater', function(err, decoded){
        if(decoded){
            if(decoded.id == id){
                return Token.where({token: decoded.jti}).fetch().then(function(token){
                    if(token){
                        return true;
                    } else {
                        return false;
                    }
                }).then(function(success){
                    return success;
                });
            } else {
                return Promise.resolve(false);
            }
        } else {
            return Promise.resolve(false);
        }
    });
}

exports.verifyToken = function(token){
    return jwt.verify(token, 'replacewithrealsecretlater', function(err, decoded){
        if(decoded){
            return decoded.jti;
        } else {
            return null;
        }
    })
}

exports.authSameUser = function(req, res, next){
    if(!req.headers.authorization){
        res.status(400).json({error: true, data: {message: 'unauthorized'}});

    } else {
        var token = req.headers.authorization.split(/\s+/)[1];
        verifyUser(token, req.params.userId).then(function(result){
            if(result){
                return next();
            } else {
                res.status(400).json({error: true, data: {message: 'unauthorized'}});
            }
        }).catch(function(err){
            res.status(400).json({error: true, data: {message: 'unauthorized'}});
        });
    }
}
