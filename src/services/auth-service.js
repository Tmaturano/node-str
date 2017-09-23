'use strict';
const jwt = require('jsonwebtoken');

//email do cliente vai ir no data e os roles
exports.generateToken = async (data) => {
    return jwt.sign(data, global.SALT_KEY, {expiresIn: '1d'}); //retorna o token com 1 dia de expiração
}

//recebe o token e verifica ele com o salt_key
exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, global.SALT_KEY);
    return data;
}

//todas as rotas privadas, usaremos o authorize
exports.authorize = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token){
        res.status(401).json({
            message: 'Acesso Restrito'
        });
    } else {
        jwt.verify(token, global.SALT_KEY, function (error, decoded){
            if (error){
                res.status(401).json({
                    message: 'Token Inválido'
                });
            } else {
                next();
            }
        });
    }
}

exports.isAdmin = function (req, res, next){
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token){
        res.status(401).json({
            message: "Token inválido"
        });
    } else{
        //o decoded já é o token decriptado
        jwt.verify(token, global.SALT_KEY, function (error, decoded){
            if (error){
                res.status(401).json({
                    message: 'Token Inválido'
                });
            } else {
                if (decoded.roles.includes('admin')){
                    next();
                } else{
                    res.status(403).json({
                        message: "Esta funcionalidade é restrita para administradores"
                    });
                }
            }
        });
    }
}