'use strict'

var jwt = require ('jwt-simple'); 
var moment = require ('moment'); 
var secret= 'erick'; 

exports.createToken = function(user){
    var payload ={
        sub: user._id,
        nombre: user.nombre, 
        apellidos: user.apellidos, 
        email: user.email,
        role: user.rol, 
        iat: moment().unix(),
        exp: moment().add(7,'days').unix()
    }
    return jwt.encode(payload,secret)
}