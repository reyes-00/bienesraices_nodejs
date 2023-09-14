import {Propiedad, Precio, Categoria, Usuario} from '../models/index.js'
import subidaExcel from '../helpers/Excel.js';
import Excel from "../models/Excel.js";
import {validationResult} from 'express-validator'
import { constants } from 'fs';

const propiedadesIndex = async(req,res) =>{
  console.log(req.usuario);
  let consultadDatos = [];
  consultadDatos = await Excel.findAll()

  //console.log(consultadDatos);
  try{
    consultadDatos = await Excel.findAll();

      res.render('propiedades/index',{
        pagina : 'Tus Proiedades',
        consultadDatos
        
      })
    
  }catch(err){
    console.log(err);
  }
  

 

/*  res.render('propiedades/index',{
    pagina : 'Tus Proiedades',
    datosExcel
    
  })*/
}

const crear = async(req, res) => {
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])
  res.render('propiedades/crear',{
    pagina: "Crear propiedad",
    categorias,
    precios,
    csrfToken: req.csrfToken(),
    
    datos:{} 
  })
}

const guardar = async (req, res) => {
  const result = validationResult(req)

  if(!result.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ])
    res.render('propiedades/crear',{
      pagina: "Crear propiedad",
      categorias,
      csrfToken : req.csrfToken(),
      precios,
      
      errores: result.errors,
      datos: req.body
    })
  }

  //Si todo es correcto
  try {
    const{titulo, descripcion,categoria: categoriaId,precio: precioId,estacionamiento,wc,habitaciones,calle,lat,lng}=req.body
    const {id: usuarioId} = req.usuario

    const propiedades = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precioId,
      categoriaId,
      usuarioId,
      imagen: ""
    })
   
    const {id} = propiedades
    
    res.redirect(`/propiedades/agregar-imagen/${id}`)

  } catch (error) {
    console.log(error);
  }
  //console.log(req.usuario.id);
  
}

const agregarImagen = async(req, res) => {
  
  //Leer el id
  const {id} = req.params

  const propiedad = await Propiedad.findByPk(id)
  
  //Validar que exista
  if(!propiedad){
    return res.redirect("/mis-propiedades")
  }

  //validar si ya subio una image
  if(propiedad.publicado){
    return res.redirect("/mis-propiedades")
  }
  
  //validar que la propiedad sea del usuaro
  if(req.usuario.id !== propiedad.usuarioId){
    return res.redirect("/mis-propiedades")
  }
 

  res.render("propiedades/ImagenPropiedad",{
    pagina: `Agrega una imagen para tu Propiedad: ${propiedad.titulo}`,
    propiedad,
    csrfToken: req.csrfToken()
  })
}

const SubirPropiedad = async(req, res, next) =>{
    //Leer el id
    const {id} = req.params

    const propiedad = await Propiedad.findByPk(id)
    
    //Validar que exista
    if(!propiedad){
      return res.redirect("/mis-propiedades")
    }
  
    //validar si ya subio una image
    if(propiedad.publicado){
      return res.redirect("/mis-propiedades")
    }
    
    //validar que la propiedad sea del usuaro
    if(req.usuario.id !== propiedad.usuarioId){
      return res.redirect("/mis-propiedades")
    }

    try {
      //Almacenar la imagen
      propiedad.imagen = req.file.filename
      propiedad.publicado = 1
      
      await propiedad.save();
      next();
    } catch (error) {
      
    }
}




export {
  propiedadesIndex,
  crear,
  guardar,
  agregarImagen,
  SubirPropiedad,
 
}