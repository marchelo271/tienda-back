'use strict'

var cliente = require ('../models/cliente'); 
var Contacto = require ('../models/contacto'); 
var Venta = require ('../models/venta'); 
var Dventa = require ('../models/dventa'); 
var Review = require ('../models/review'); 
var bcrypt = require ('bcrypt'); 
var jwt = require ('../helpers/jwt');
var direccion = require ('../models/direccion');
const saltRounds = 10;

const registro_cliente = async function(req,res){
    var data = req.body;  
    var clientes_arr = [];

    clientes_arr = await cliente.find({email: data.email}); 

        if(clientes_arr.length == 0 ){
          //el registro
        // 
         if(data.password){
             bcrypt.hash(data.password,saltRounds, async function(err, hash){
                if(hash){
                  data.password = hash; 
                  var reg = await cliente.create(data); 
                  res.status(200).send({data:reg});
                }else {
                  res.status(200).send({message: 'Error server'});
                }
             })  
         } else {
            res.status(200).send({message: 'No hay una contraseña'});           
         }
              }
               else{
                 res.status(200).send({message: 'El correo ya existe en la base de datos', data: undefined})
                  }
}

const login_cliente = async function (req, res){
    var data = req.body; 
    var cliente_arr = [];
    
    cliente_arr= await cliente.find({email:data.email}); 
       if(cliente_arr.length ==0){
            res.status(200).send({message:'no se encontro ningun registro con ese correo', data: undefined}); 
       } else{
         //LOGIN porque si existe el usuario
         let user = cliente_arr[0];
         bcrypt.compare(data.password, user.password, async function(error, check){
              if(check){
               res.status(200).send({data:user,
                                     token:jwt.createToken(user)}); 
              } else {
               res.status(200).send({message:'la contraseña no coincide', data:undefined});
              }
         });
       }
}

const listar_clientes_filtro_admin = async function(req , res){
    
  if(req.user){
    if(req.user.role=='gerente'){
      let tipo = req.params['tipo'];
      let filtro = req.params['filtro'];
      
      if(tipo== null || tipo =='null'){
        let reg = await cliente.find(); 
        res.status(200).send({data:reg});
      } else {
         if(tipo == 'apellidos'){
            let reg = await cliente.find({apellidos: new RegExp(filtro, 'i')});
            res.status(200).send({data:reg});
    
         }else if(tipo == 'correo'){
          let reg = await cliente.find({email: new RegExp(filtro, 'i')});
          res.status(200).send({data:reg});
         }
      }
    }else{
      res.status(500).send({message:'NoAccess'});
    }
  }else{
    res.status(500).send({message:'NoAccess'});
  }
}

const registro_cliente_admin = async function(req, res) {
  if (req.user){
    if (req.user.role == 'gerente') {
      var data = req.body;

      bcrypt.hash('1234567890', saltRounds, async function(err, hash) {
        if (hash) {
          data.password = hash;
          let reg = await cliente.create(data);
          res.status(200).send({ data:reg });
        } else {
          res.status(200).send({ message: 'Hubo un error en el servidor', data:undefined });
        }
      });
    }else {
      res.status(500).send({message:'NoAccess'});
    }
  } else {
    res.status(500).send({message:'NoAccess'});
  }
}
 
const obtener_cliente_admin = async function (req, res ){
  if (req.user){
    if (req.user.role == 'gerente') {
       
      var id = req.params['id']; 
     
     try {
      var reg = await cliente.findById({_id:id}); 
      res.status(200).send({data: reg });
     } catch (error) {
      res.status(200).send({data: undefined });
     } 

    }else {
      res.status(500).send({message:'NoAccess'});
    }
  } else {
    res.status(500).send({message:'NoAccess'});
  }
}

const actualizar_cliente_admin = async function(req, res ){
  if (req.user){
    if (req.user.role == 'gerente') {
       
      var id = req.params['id']; 
      var data = req.body;

       var reg = await cliente.findByIdAndUpdate({_id:id},{
         nombre: data.nombre,
         apellidos: data.apellidos, 
         email: data.email, 
         telefono: data.telefono, 
         genero: data.genero, 
         f_nacimiento: data.f_nacimiento,
         ci: data.ci
        })
        res.status(200).send({data: reg}); 

    }else {
      res.status(500).send({message:'NoAccess'});
    }
  } else {
    res.status(500).send({message:'NoAccess'});
  }

}

const eliminar_cliente_admin = async function (req, res){
  if (req.user){
    if (req.user.role == 'gerente') {
       
      var id = req.params['id']; 

      let reg = await cliente.findByIdAndRemove({_id:id}); 
      res.status(200).send({data:reg}); 
    
    }else {
      res.status(500).send({message:'NoAccess'});
    }
  } else {
    res.status(500).send({message:'NoAccess'});
  }

}

const obtener_cliente_guest = async function (req, res ){
  if (req.user){
   
    var id = req.params['id']; 
     
    try {
     var reg = await cliente.findById({_id:id}); 
     res.status(200).send({data: reg });
    } catch (error) {
     res.status(200).send({data: undefined });
    } 

  } else {
    res.status(500).send({message:'NoAccess'});
  }
}

const actualizar_perfil_cliente_guest = async function (req, res ){
  if (req.user){
   
    var id = req.params['id']; 
    var data = req.body; 
    console.log(data.password); 
    
     if(data.password){
      console.log('con contraseña');
         bcrypt.hash(data.password, saltRounds, async function(err, hash){
          var reg = await cliente.findByIdAndUpdate({_id:id},{
            nombre: data.nombre,
            apellidos: data.apellidos, 
            telefono: data.telefono, 
            f_nacimiento: data.f_nacimiento,
            ci: data.ci,
            genero: data.genero,
            ciudad: data.ciudad,
            password: hash
          });
          res.status(200).send({data: reg});
         }); 
         
     } else {
       console.log('sin contraseña');
      var reg = await cliente.findByIdAndUpdate({_id:id},{
        nombre: data.nombre,
        apellidos: data.apellidos, 
        telefono: data.telefono, 
        f_nacimiento: data.f_nacimiento,
        ci: data.ci,
        genero: data.genero,
        ciudad: data.ciudad
      });
      res.status(200).send({data: reg});
     }
    

  } else {
    res.status(500).send({message:'NoAccess'});
  }
}

//**********************************Ordenes  */
const obtener_ordenes_cliente = async function (req , res) {
  if(req.user){
    var id  = req.params['id']; 
   
    let reg = await Venta.find({cliente:id}).sort({createdAt:-1}); 
    if(reg.length >=1){
      res.status(200).send({data: reg});
    } else if(reg.length == 0){
      res.status(200).send({data: undefined});  
    }
    
          
   } else {
    res.status(500).send({message:'NoAccess'});
   }
} 

const obtener_detalles_ordenes_cliente = async function (req , res) {
  if(req.user){
    var id  = req.params['id']; 
      try {
        let venta = await Venta.findById({_id:id}).populate('direccion').populate('cliente'); 
        let detalles = await Dventa.find({venta:id}).populate('producto'); 
        res.status(200).send({data:venta,detalles:detalles});
      } catch (error) {
         res.status(200).send({data:undefined}); 
      }
             
   } else {
    res.status(500).send({message:'NoAccess'});
   }
}

//********************************************************* */
// Direcciones 
const registro_direccion_cliente = async function (req , res) {
  if(req.user){
    var data  = req.body; 

    if(data.principal){
      let direcciones = await direccion.find({cliente: data.cliente}); 

         direcciones.forEach(async element => {
           await direccion.findByIdAndUpdate({_id: element._id}, {principal: false})
         });
    }
    let reg = await direccion.create(data);
 
    res.status(200).send({data: reg}); 
   } else {
    res.status(500).send({message:'NoAccess'});
   }
}

const obtener_direccion_todos_cliente = async function (req , res) {
  if(req.user){
   
    var id = req.params['id']; 

    let direcciones = await direccion.find({cliente: id}).populate('cliente').sort({createdAt:-1});
    res.status(200).send({data: direcciones}); 
   } else {
    res.status(500).send({message:'NoAccess'});
   }
}

const cambiar_direccion_principal_cliente = async function (req , res) {
  if(req.user){
    var id  = req.params['id']; 
    var cliente  = req.params['cliente']; 

    let direcciones = await direccion.find({cliente:cliente}); 

    direcciones.forEach(async element => {
      await direccion.findByIdAndUpdate({_id: element._id}, {principal: false})
    }); 

     await direccion.findByIdAndUpdate({_id:id},{principal: true}); 
 
    res.status(200).send({data:true}); 
   } else {
    res.status(500).send({message:'NoAccess'});
   }
} 

const obtener_direccion_principal_cliente = async function (req , res) {
  if(req.user){
    var id  = req.params['id']; 
    var direccionp = undefined; 

      direccionp = await direccion.findOne({cliente:id , principal: true}); 
         if(direccionp == undefined){
          res.status(200).send({data:undefined});
         } else  {
          res.status(200).send({data:direccionp});
         }
 
    
   } else {
    res.status(500).send({message:'NoAccess'});
   }
}

//**************************************************CONTACTO****************************** */

const enviar_mensaje_contacto = async function (req , res) {
    
    let data = req.body; 
    data.estado = 'Abierto';  
    
     let reg = await Contacto.create(data); 
     res.status(200).send ({data: reg}); 
}

//**************************************************Reviews****************************** */

const emitir_review_producto_cliente = async function (req , res) {
  if(req.user){
    
    let data = req.body; 

    let reg = await Review.create(data); 
    res.status(200).send({data: reg}); 
    
   } else {
    res.status(500).send({message:'NoAccess'});
   }
} 

const obtener_review_producto_cliente = async function (req , res) {
  let id = req.params['id']; 
  let reg = await Review.find({producto:id}).sort({createdAt: -1});
  res.status(200).send({data: reg}); 
} 

const obtener_reviews_cliente = async function (req , res) {
  if(req.user){
    
    let id = req.params['id']; 

    let reg = await Review.find({cliente: id}).populate('cliente'); 
    res.status(200).send({data: reg}); 
    
   } else {
    res.status(500).send({message:'NoAccess'});
   }
} 

module.exports = {
   registro_cliente,
   login_cliente, 
   listar_clientes_filtro_admin,
   registro_cliente_admin,
   obtener_cliente_admin, 
   actualizar_cliente_admin,
   eliminar_cliente_admin, 
   obtener_cliente_guest, 
   actualizar_perfil_cliente_guest, 
   registro_direccion_cliente,
   obtener_direccion_todos_cliente,
   cambiar_direccion_principal_cliente,
   obtener_direccion_principal_cliente,
   enviar_mensaje_contacto,
   obtener_ordenes_cliente,
   obtener_detalles_ordenes_cliente,
   emitir_review_producto_cliente,
   obtener_review_producto_cliente,
   obtener_reviews_cliente
}