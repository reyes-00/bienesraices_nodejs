import jwt from 'jsonwebtoken';
import {Usuario} from '../models/index.js'

const ProtegerRuta = async(req,res, next)=>{
  
  const {_token } = req.cookies
  
  
  if(!_token){
    return res.redirect("/auth/login")
  }
  
  //Comprobar el token
  try {
    const decoded = jwt.verify(_token,process.env.JWT_SECRET,_token)
    const consultaUsuario = await Usuario.scope("eliminarPassword").findByPk(decoded.id)
    
    //ALmacenar al usuario en el req
    if(consultaUsuario){
      req.usuario = consultaUsuario
     
    }else{
      return response.redirect("auth/login");
    }
    return next();
  } catch (error) {
    return res.clearCookie("_token").redirect("/auth/login")
  }

  
}

export default ProtegerRuta