'use strict'

var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var clienteSchema = Schema({
  nombre:{type: String, required: true},
  apellidos:{type: String, required: true}, 
  email:{type: String, required: true},
  password:{type: String, required: true},
  perfil:{type:String ,default: 'perfil.png' ,required: true},
  telefono:{type: String, required: false},
  genero:{type: String, required: false},
  f_nacimiento:{type: String, required: false},
  ci:{type: String, required: false},
  ciudad:{type: String, required: false},
  createdAt: {type:Date, default:Date.now, required:true}
}); 

module.exports = mongoose.model('cliente' , clienteSchema); 


