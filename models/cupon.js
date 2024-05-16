'use strict'

var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var cuponSchema = Schema({
  codigo:{type:String , required: true }, 
  tipo:{type:String , required: true }, 
  valor:{type:Number , required: true },  // puede ser porcentage | numerico
  limite:{type:Number , required: true },
  createdAt: {type:Date, default:Date.now, required:true}
}); 

module.exports = mongoose.model('cupon' , cuponSchema); 