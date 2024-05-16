
var config = require('../models/config'); 
var fs = require('fs'); 
var path = require('path');

const obtener_config_admin = async function (req , res) {
   if(req.user){
       if(req.user.role == 'gerente'){
          
         let reg = await config.findById({_id: "654e6824e6880da59ee4beff"})
      
         res.status(200).send({data: reg}); 
        }
          else {
         res.status(500).send({message:'NoAccess'});
       }
    } else {
     res.status(500).send({message:'NoAccess'});
    }
}



const actualizar_config_admin = async function (req , res) {
    if(req.user){
        if(req.user.role == 'gerente'){
          
         let data = req.body; 

         if(req.files){
             // si hay imagen 
            
          var img_path = req.files.logo.path; 
          var name = img_path.split('/')
          var logo_name = name[2];
         
          let reg = await config.findByIdAndUpdate({_id:"654e6824e6880da59ee4beff"},
          {
             categorias: JSON.parse(data.categorias),
             titulo: data.titulo,
             serie : data.serie,
             logo: logo_name,
             corrrelativo: data.correlativo
          });

          fs.stat('./uploads/configuraciones/'+reg.logo, function(err){
            if(!err){
               fs.unlink('./uploads/configuraciones/'+reg.logo ,(err)=>{
                  if(err)  throw err ; 
  
               })
             }
             
            });
           
            res.status(200).send({data: reg});

         }else{

             let reg = await config.findByIdAndUpdate({_id:"654e6824e6880da59ee4beff"},
            {
               categorias: data.categorias,
               titulo: data.titulo,
               serie : data.serie,
               corrrelativo: data.correlativo
            }); 

            res.status(200).send({data: reg}); 

         }

          
         
        }else {
          res.status(500).send({message:'NoAccess'});
        }
     } else {
      res.status(500).send({message:'NoAccess'});
     }
}

const obtener_logo = async function(req, res) {
   var img = req.params['img']; 
   
   fs.stat('./uploads/configuraciones/'+img, function(err){
      if(!err){
         let path_img = './uploads/configuraciones/'+img; 
         res.status(200).sendFile(path.resolve(path_img))
      }
        else {
          let path_img = './uploads/default.jpg'; 
          res.status(200).sendFile(path.resolve(path_img))
        }
   })
}

const obtener_config_publico = async function (req , res) {
   
   let reg = await config.findById({_id: "654e6824e6880da59ee4beff"})
      
   res.status(200).send({data: reg}); 
}

module.exports = {
    actualizar_config_admin,
    obtener_config_admin, 
    obtener_logo,
    obtener_config_publico
}