import express from 'express';
import csrf from 'csurf';

import cookieParser from 'cookie-parser';
import UsuariosRoutes from "./routes/UsuariosRoutes.js";
import PropiedadesRoutes from './routes/PropiedadesRoutes.js'
import db from './config/db.js'


const app = express();

// habilitar cookieParser
app.use(cookieParser());


// Hablitar csrf
let csrfProtection = csrf({ cookie: true });


// Verificar la conexion a la db
db.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
    // crear las tablas en caso de que no esten creadas
    db.sync();
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

// habilitar lectura de datos en el formulario
app.use(express.urlencoded({ extended: true}))

// Habiliatr Pug
app.set('view engine', 'pug')
app.set('views','./views')

// Crear carpeta publica
app.use(express.static('public'))


app.use("/auth",csrfProtection, UsuariosRoutes)
// Pasar la variable 'upload' al router de Propiedades
app.use('/' ,csrfProtection, PropiedadesRoutes);


const port = process.env.PORT || 4000
app.listen(port,()=>{
  console.log(`Esta en el puerto ${port}`);
});