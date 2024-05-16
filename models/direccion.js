'use strict'

var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var direccionSchema = Schema({
 
  cliente:{type: Schema.ObjectId,ref:'cliente' ,required: true},
  destinatario:{type:String, required: true },
  ci:{type:String, required: true },
  direccion:{type:String, required: true },
  ciudad:{type:String, required: true },
  telefono:{type:String, required: true },
  principal:{type:Boolean, required: true },
  createdAt: {type:Date, default:Date.now, required:true}
}); 

module.exports = mongoose.model('direccion' , direccionSchema); 
