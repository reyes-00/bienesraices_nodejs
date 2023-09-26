import {Propiedad, Precio, Categoria, Usuario} from '../models/index.js'
import subidaExcel from '../helpers/Excel.js';
import Excel from "../models/Excel.js";
import {validationResult} from 'express-validator'
import { unlink } from 'node:fs/promises';

const propiedadesIndex = async(req,res) =>{
  const id = req.usuario.id;

  //Leer datos del queryString 
  const {pagina : paginaActual } = req.query;

  //Le decimos que debe empezar con numero entero con ^ y terminar con numero con $
  const expresion = /^[0-9]$/

  if(!expresion.test(paginaActual)){
    res.redirect("/mis-propiedades?pagina=1")
  }

  let consultadDatos = [];
  consultadDatos = await Excel.findAll()
  
  //console.log(consultadDatos);
  try{
    const PropiedadesUsuarios = await Propiedad.findAll({
      where : {usuarioId : id}, 
      include:[
        {model : Categoria, as: "categoria"},
        {model: Precio, as: "precio"}
      ]
    })
    consultadDatos = await Excel.findAll();

      res.render('propiedades/index',{
        pagina : 'Tus Proiedades',
        csrfToken : req.csrfToken(),
        consultadDatos,
        PropiedadesUsuarios
      })
    
  }catch(err){
    console.log(err);
  }
  
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

const editarPropiedad = async(req, res) => {

  //validar que exita la propiedad
  const {id} = req.params

  const propiedad = await Propiedad.findByPk(id)
  if(!propiedad){
    return res.redirect("/mis-propiedades")
  }
  
  //Validar que sea del usuario que la creo
  
  const UsuarioActual = req.usuario.id
  
  if( UsuarioActual.toString() !== propiedad.usuarioId.toString()){
    return res.redirect("/mis-propiedades")

  }

  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])
  res.render('propiedades/editar',{
    pagina: `Editar propiedad: ${propiedad.titulo} `,
    categorias,
    precios,
    csrfToken: req.csrfToken(),
    
    datos:propiedad
  })
}

const updatePropiedad = async (req, res) =>{
  
  //Validamos los campos del formulario
  
  const result = validationResult(req)
  if(!result.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ])
    res.render('propiedades/editar',{
      pagina: "Ediatr Propiedad",
      categorias,
      csrfToken : req.csrfToken(),
      precios,
      errores: result.errors,
      datos: req.body
    })
  }

   //validar que exita la propiedad
   const {id} = req.params

   const propiedad = await Propiedad.findByPk(id)
   if(!propiedad){
     return res.redirect("/mis-propiedades")
   }
   
   //Validar que sea del usuario que la creo
   
   const UsuarioActual = req.usuario.id
   
   if( UsuarioActual.toString() !== propiedad.usuarioId.toString()){
     return res.redirect("/mis-propiedades")
   }

   //actualizar en la base
   const{titulo, descripcion,categoria: categoriaId,precio: precioId,estacionamiento,wc,habitaciones,calle,lat,lng}=req.body

   try{
    propiedad.set({
      titulo,
      descripcion,
      categoriaId,
      precioId,
      estacionamiento,
      wc,
      habitaciones,
      calle,
      lat,
      lng
    })

    await propiedad.save()

    return res.redirect("/mis-propiedades")

   }catch(err){
    console.log(err);
   }
}

const eliminar = async (req, res) => {
   //validar que exita la propiedad
   const {id} = req.params

   const propiedad = await Propiedad.findByPk(id)
   if(!propiedad){
     return res.redirect("/mis-propiedades")
   }
   
   //Validar que sea del usuario que la creo
   
   const UsuarioActual = req.usuario.id
   
   if( UsuarioActual.toString() !== propiedad.usuarioId.toString()){
     return res.redirect("/mis-propiedades")
   }
    if(propiedad.imagen){
      await unlink (`public/uploads/${propiedad.imagen}`)
    }

   await propiedad.destroy();
   return res.redirect("/mis-propiedades")


}

const mostrarPropiedad = async(req, res) => {

  //verificar que exista la propiedad	
  const {id} = req.params

  const propiedad = await Propiedad.findByPk(id,{
    include: [
      {model : Categoria, as: "categoria"},
      {model: Precio, as: "precio"}
    ]})


  if(!propiedad){
    return res.redirect("/404")
  }

  res.render("propiedades/mostrar",{
    pagina:  `${propiedad.titulo}`,
    propiedad
  })
}

export {
  propiedadesIndex,
  crear,
  guardar,
  agregarImagen,
  SubirPropiedad,
  editarPropiedad,
  updatePropiedad,
  eliminar,
  mostrarPropiedad
 
}