import bcrypt from 'bcrypt';

const usuarios = [
  {
    nombre: "Arturo",
    email: "correo@correo.com",
    password: bcrypt.hashSync("password",10),
    confirmado: true
  },
  {
    nombre: "Juan",
    email: "correo1@correo.com",
    password: bcrypt.hashSync("password",10),
    confirmado: true
  }
]

export default  usuarios;