import {check, validationResult} from 'express-validator';
import Usuario from '../models/Usuario.js';
import {genertarToken, generarJWT} from '../helpers/token.js';
import {EmailRegistro,EmailResetpassword} from '../helpers/EmailRegitro.js'
import bcrypt from 'bcrypt';


const formularioUsuario = (req, res)=>{
  res.render('auth/login',{
    pagina: 'Inicia sesion',
    csrfToken : req.csrfToken(),
  })
}

const autenticar = async(req, res)=>{
  
  await check('email').isEmail().withMessage('El Email es requerido').run(req);
  await check('password').notEmpty().withMessage('El password es requerido').run(req);

  const resultado = validationResult(req)

  if(!resultado.isEmpty()) {
    return res.render('auth/login', {
      pagina : 'Inicia Sesion',
      csrfToken : req.csrfToken(),
      errores: resultado.errors
    })
  }

  //Comprobar si el usuario existe
  const {email, password} = req.body
  const usuario = await Usuario.findOne({where : {email}})

  if(!usuario){
    return res.render('auth/login',{
      pagina : 'Inicia Sesion',
      csrfToken : req.csrfToken(),
      errores: [{msg: 'El usuario no existe'}]
    })
  }

  if(!usuario.confirmado){
    return res.render('auth/login',{
      pagina : 'Inicia Sesion',
      csrfToken : req.csrfToken(),
      errores: [{msg: 'El usuario no esta confirmado'}]
    })
  }

  //comprobar la password
  if(!usuario.verificarPassword(password)){
    return res.render('auth/login',{
      pagina : 'Inicia Sesion',
      csrfToken : req.csrfToken(),
      errores: [{msg: 'El password no coincide'}]
    })
  }

  //Autenticar al usuario
  const jwtToken = generarJWT({id: usuario.id, nombre:usuario.nombre})
  
  //Almacenarlo en una cookie
  return res.cookie('_token', jwtToken,{
    httpOnly: true,
    secure: true
  }).redirect('/mis-propiedades')
}

const formularioRegsitro = (req, res)=>{
  
  res.render('auth/registro',{
    pagina: "Crear cuenta",
    csrfToken: req.csrfToken()
  })
}

const registrar = async(req, res)=>{

  
  // Validamos 
  await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req);
  await check('email').isEmail().withMessage('No es de tipo Email').run(req);
  await check('password').isLength({min: 6}).withMessage('password requerida').run(req);
  await check('repetir_password').equals('password').withMessage('La password no coincide').run(req);
  
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
    return res.render('auth/registro',{
      errores : resultado.errors,
      csrfToken: req.csrfToken(),
      usuario:{
        nombre : req.body.nombre,
        email : req.body.email
      }
    })
  }

  const existeUsuario = await Usuario.findOne({where : {email : req.body.email}});

  if(existeUsuario){
    return res.render('auth/registro',{
      errores : [{msg: 'El usuario ya existe'}],
      csrfToken: req.csrfToken(),
      usuario:{
        nombre : req.body.nombre,
        email : req.body.email
      }
    })
  }
  const usuario = await Usuario.create({
    nombre : req.body.nombre,
    email : req.body.email,
    password: req.body.password,
    token: genertarToken()
  });

  // Envia email de confirmacion 
  EmailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  })

  res.render('templates/mensaje',{
    pagina: 'Confirma tu cuenta',
    mensaje: 'Hemos enviado un enlace para confirmar tu cuenta'
  });
}

const confirmarCuenta = async(req, res)=>{
  
  const {token} = req.params;
  const validaToken = await Usuario.findOne({where: {token}})

  if(!validaToken){
    return res.render('auth/confirmar-cuenta',{
      pagina: 'Cuenta no valida',
      mensaje: 'Token no valido',
      error: true
    })
  }

  validaToken.token = null;
  validaToken.confirmado = true;
  await validaToken.save();

  return res.render('auth/confirmar-cuenta',{
    pagina: 'Cuenta valida',
    mensaje: 'Token valido',
    error: false
  })
}

const olvidePassword = (req, res)=>{
  res.render('auth/olvide',{
    pagina: 'Recupera tu Acceso',
    csrfToken: req.csrfToken()
  })
}

const resertPassword = async(req, res)=>{
  await check('email').isEmail().withMessage('No es un email').run(req)
  const resultado = validationResult(req)

  if(!resultado.isEmpty()){
    return res.render('auth/olvide',{
      errores : resultado.errors,
      csrfToken : req.csrfToken()
      
    })
  }

  // consultar la base de datos
  const {email} = req.body
  const usuario = await Usuario.findOne({where: {email}})

  if(!usuario){
    return res.render("auth/olvide",{
      csrfToken: req.csrfToken(),
      errores: [{msg: "No existe un usuario con ese nombre"}]
    })
  }

  //Generar token y mandar el email
  usuario.token = genertarToken();
  await usuario.save();
  
  EmailResetpassword({
    email : usuario.email,
    nombre : usuario.nombre,
    token : usuario.token,
  });

  return res.render('templates/mensaje',{
    pagina: 'Reestablecimiento de password',
    mensaje: 'Hemos enviado un enlace para reestablecer tu password'
  });
}

const cambiarPassword = async(req, res) => {
  const token = req.params.token
  
  const compararToken = await Usuario.findOne({where : {token: token}})
 
  if (!compararToken){
    return res.render("auth/confirmar-cuenta",{
      pagina : "Reesrtable tu password",
      mensaje: "Hubo un error al validar tu cuenta ",
      error : true
    })
  }

  return res.render("auth/reestablecer",{
    pagina: "Reestablercer tu password",
    csrfToken : req.csrfToken()
  })
}

const nuevoPassword = async (req, res) => {
  
  await check("password").isLength({min: 6}).withMessage("El password debe ser mayor a 6 caracteres").run(req)
  const result = validationResult(req);

  if(!result.isEmpty()){
    return res.render("auth/reestablecer",{
      errores: result.errors,
      csrfToken : req.csrfToken()
    })
  }
  const { password } = req.body;
  const {token} = req.params;

  const usuario = await Usuario.findOne({where:{token}})
  
  //hashear el nuevo password
  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash(password,salt);
  usuario.token = null
  await usuario.save();

  res.render("auth/confirmar-cuenta",{
    pagina : "Tu password cambio",
    mensaje: "Password cambiado correctamente ",
  
  })
}

export {
  formularioUsuario,
  formularioRegsitro,
  olvidePassword,
  registrar,
  confirmarCuenta,
  resertPassword,
  cambiarPassword,
  nuevoPassword,
  autenticar
}