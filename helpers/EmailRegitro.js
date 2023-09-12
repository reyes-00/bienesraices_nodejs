import nodemailer from 'nodemailer';
const EmailRegistro = async (datos) => {
  const{nombre, email, token }= datos;
  
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,    
      pass: process.env.EMAIL_PASS
    }
  });
  
  await transport.sendMail({
    from: 'BienesraicesNodeJs.com',
    to: email,
    subject: 'Creacion de cuenta',
    text: 'Confirma tu cuenta',
    html:`
      <p>Hola comprueba tu cuenta en bienesraices.com</p>
      <p>Tu cuenta ya esta lista, solo debes confirmar en el siguiente enlace: <a href="${process.env.PROYECTO_URL}:${process.env.PORT ?? 4000}/auth/confirmar/${token}">Confrimar cuenta</a>
      </p>
      <p>Si no creaste esta cuenta puedes ignorar el mensaje</p>
    `
  });

}

const EmailResetpassword = async (datos) => {
  const{nombre, email, token }= datos;
  
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,    
      pass: process.env.EMAIL_PASS
    }
  });
  
  await transport.sendMail({
    from: 'BienesraicesNodeJs.com',
    to: email,
    subject: 'Cambiar password',
    text: 'Ingresa tu nuevo password',
    html:`
      <p>Hola haz solicitado cambiar tu password en bienesraices.com</p>
      <p>Siguiente enlace: <a href="${process.env.PROYECTO_URL}:${process.env.PORT ?? 4000}/auth/olvide/${token}">Cambiar password</a>
      </p>
      <p>Si no creaste esta cuenta puedes ignorar el mensaje</p>
    `
  });

}

export {
  EmailRegistro,
  EmailResetpassword
}