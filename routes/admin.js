'use strict'

var express = require('express'); 
var AdminController = require('../controllers/AdminController'); 
var auth = require('../middlewares/authenticate'); 

var api = express.Router();

api.post('/registro_admin', AdminController.registro_admin);
api.post('/login_admin',AdminController.login_admin); 
api.get('/obtener_mensajes_admin', auth.auth , AdminController.obtener_mensajes_admin); 
api.put('/cerrar_mensaje_admin/:id', auth.auth, AdminController.cerrar_mensaje_admin);  

//************* Ventas**************** */
api.get('/obtener_ventas_admin/:desde?/:hasta?', auth.auth, AdminController.obtener_ventas_admin ); 

module.exports = api; 