import jwt from 'jsonwebtoken';

const genertarToken = () => Date.now().toString(32)+Math.random().toString(32).substring(2);

//authenticar usuario

const generarJWT = (datos) =>{

  return jwt.sign({ 
      id: datos.id,
      nombre: datos.nombre
    },
      process.env.JWT_SECRET,{
      expiresIn: '1d'
    }

)}

export{
  genertarToken,
  generarJWT
}