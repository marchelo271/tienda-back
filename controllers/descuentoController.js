'use strict'

const { log } = require('console');
var Descuento = require('../models/descuento');
var fs = require('fs'); 
var path= require('path');  

const registro_descuento_admin = async function(req,res){
    if(req.user){
       if(req.user.role == 'gerente'){
          let data = req.body; 
         
          var img_path = req.files.banner.path; 
          var name = img_path.split('/')
          var banner_name = name[2];
 
          data.banner = banner_name; 
          let reg = await Descuento.create(data); 
 
           res.status(200).send({data: reg}); 
       }else {
         res.status(500).send({message:'NoAccess'});
       }
    } else {
     res.status(500).send({message:'NoAccess'});
    }
 }

 const listar_descuentos_admin = async function(req, res) {
    if(req.user){
       if(req.user.role == 'gerente'){
         
         var filtro= req.params['filtro'];
 
         let reg = await Descuento.find({titulo: new RegExp(filtro, 'i')}).sort({createdAt:-1}); 
         res.status(200).send({data: reg}); 
 
       }else {
         res.status(500).send({message:'NoAccess'});
       }
    } else {
     res.status(500).send({message:'NoAccess'});
    }
 }

 const obtener_banner_descuento = async function(req, res) {
    var img = req.params['img']; 
    
    fs.stat('./uploads/promociones/'+img, function(err){
       if(!err){
          let path_img = './uploads/promociones/'+img; 
          res.status(200).sendFile(path.resolve(path_img))
       }
         else {
           let path_img = './uploads/default.jpg'; 
           res.status(200).sendFile(path.resolve(path_img))
         }
    })
}

const obtener_descuento_admin = async function (req, res ){
    if (req.user){
      if (req.user.role == 'gerente') {
         
        var id = req.params['id']; 
       
       try {
        var reg = await Descuento.findById({_id:id}); 
        res.status(200).send({data:reg });
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
 
  const actualizar_descuento_admin = async function(req,res){
    if(req.user){
       if(req.user.role == 'gerente'){
        
        let id = req.params['id'];
        let data = req.body; 
       
         
          if (req.files){
            // si hay imagen 
            var img_path = req.files.banner.path; 
            var name = img_path.split('/')
            var banner_name = name[2]; 
            
            let reg = await Descuento.findByIdAndUpdate({_id:id} , {
              titulo:data.titulo, 
              banner: banner_name,
              descuento: data.descuento,
              fecha_inicio: data.fecha_inicio,
              fecha_fin: data.fecha_fin
             
           }); 
  
           fs.stat('./uploads/promociones/'+reg.banner, function(err){
            if(!err){
               fs.unlink('./uploads/promociones/'+reg.banner ,(err)=>{
                  if(err)  throw err ; 
  
               })
             }
              else {
              
              }
            })
  
           res.status(200).send({data: reg}); 
  
          }else {
             // no hay imagen 
            let reg = await Descuento.findByIdAndUpdate({_id:id} , {
              titulo:data.titulo, 
              descuento: data.descuento,
              fecha_inicio: data.fecha_inicio,
              fecha_fin: data.fecha_fin
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

  const eliminar_descuento_admin = async function (req, res){
    if (req.user){
      if (req.user.role == 'gerente') {
         
        var id = req.params['id']; 
  
        let reg = await Descuento.findByIdAndRemove({_id:id}); 
  
        fs.stat('./uploads/promociones/'+reg.banner, function(err){
          if(!err){
             fs.unlink('./uploads/promociones/'+reg.banner ,(err)=>{
                if(err)  throw err ; 
  
             })
           }
            else {
            
            }
          });
        
        res.status(200).send({data:reg}); 
         
      
      }else {
        res.status(500).send({message:'NoAccess'});
      }
    } else {
      res.status(500).send({message:'NoAccess'});
    }
  
  }

  const obtener_descuento_activo = async function (req, res){
    
    let descuentos = await Descuento.find().sort({createat: -1});
    var today = Date.parse(new Date().toString()) / 1000 ;
    var arr_descuentos = []; 

    descuentos.forEach(element => {
      var tt_inicio = Date.parse(element.fecha_inicio+'T00:00:00') / 1000 ;
      var tt_fin = Date.parse(element.fecha_fin+'T23:59:59') / 1000 ;
      
      if (today >= tt_inicio && today <= tt_fin){
          arr_descuentos.push(element); 
        }
    });

     if(arr_descuentos.length >=1){
         res.status(200).send({data: arr_descuentos}); 
     } else {
      res.status(200).send({data: undefined});
     }

  }

module.exports = {
    registro_descuento_admin,
    listar_descuentos_admin,
    obtener_banner_descuento,
    obtener_descuento_admin,
    actualizar_descuento_admin,
    eliminar_descuento_admin,
    obtener_descuento_activo
}