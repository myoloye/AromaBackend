var Token = require('../models/token');
var jwt = require('jsonwebtoken');

var verifyUser = function(token, id){
    return jwt.verify(token, 'replacewithrealsecretlater', function(err, decoded){
        if(decoded){
            if(decoded.id == id){
                return Token.where({token: decoded.jti}).fetch().then(function(token){
                    if(token){
                        return 'authorized';
                    } else {
                        return 'invalid';
                    }
                }).then(function(success){
                    return success;
                });
            } else {
                return Promise.resolve('forbidden');
            }
        } else {
            return Promise.resolve('invalid');
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

exports.getUserId = function(header){
    if(header){
        var token = header.split(/\s+/)[1];
        return jwt.verify(token, 'replacewithrealsecretlater', function(err, decoded){
            if(decoded){
                return Token.where({token: decoded.jti}).fetch().then(function(token){
                    if(token){
                        return decoded.id;
                    } else {
                        return null;
                    }
                }).then(function(success){
                    return success;
                });
            } else {
                return Promise.resolve(null);
            }
        });
    } else {
        return Promise.resolve(null);
    }

}

exports.authSameUser = function(req, res, next){
    if(!req.headers.authorization){
        res.status(401).json({error: true, data: {message: 'Missing Authorization Header'}});

    } else {
        var token = req.headers.authorization.split(/\s+/)[1];
        verifyUser(token, req.params.userId).then(function(result){
            if(result === 'authorized'){
                return next();
            } else if(result === 'forbidden') {
                res.status(403).json({error: true, data: {message: 'You are unauthorized'}});
            } else {
                res.status(401).json({error: true, data: {message: 'Invalid authorization'}});
            }
        }).catch(function(err){
            res.status(500).json({error: true, data: {message: 'Server error'}});
        });
    }
}
