'use strict'

var express = require('express'); 
var app = express();
const cors = require('cors');
var mongoose = require('mongoose'); 
var bodyparser = require('body-parser'); 
var port = process.env.PORT ||4201 ;  

var server = require('http').createServer(app); 
var io = require('socket.io')(server,{
    cors: {origin:'*'}
}); 

io.on('connection', function(socket){
    socket.on('delete-carrito', function(data){
       io.emit('new-carrito', data); 
      
    });

    socket.on('add-carrito-add', function(data){
      io.emit('new-carrito-add', data); 
     
   });



});

var cliente_route = require('./routes/cliente'); 
var admin_route = require ('./routes/admin'); 
var producto_route = require ('./routes/producto');
var cupon_route = require ('./routes/cupon');
var config_route = require ('./routes/config');
var carrito_route = require ('./routes/carrito');
var venta_route = require ('./routes/venta');
var descuento_route = require('./routes/descuento');

// Conecta a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tienda', { useNewUrlParser: true, useUnifiedTopology: true });

// Maneja eventos de conexión y error
mongoose.connection.on('connected', () => {
  console.log('Conexión a MongoDB establecida');
  server.listen(port, function () {
    console.log('Servidor corriendo en el puerto ' + port);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB :', err);
});

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({limit:'50mb',extended: true}))

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin',"*"); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',cliente_route); 
app.use('/api',admin_route ); 
app.use('/api',producto_route); 
app.use('/api',cupon_route);
app.use('/api',config_route); 
app.use('/api',carrito_route); 
app.use('/api',venta_route);
app.use('/api',descuento_route); 

module.exports = app;

