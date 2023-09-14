import express from 'express';
import {body} from 'express-validator'
import ProtegerRuta from '../middleware/ProtegerRuta.js';
import {propiedadesIndex, crear, guardar, agregarImagen, SubirPropiedad} from '../controllers/propiedadesController.js'
import upload from '../middleware/subirImagen.js'

const router = express.Router();

router.get('/mis-propiedades',ProtegerRuta, propiedadesIndex);
router.get('/propiedades/crear',ProtegerRuta, crear);

router.post('/propiedades/crear', ProtegerRuta,
              body("titulo").notEmpty().withMessage('El titulo es requerido'),
              body("descripcion").notEmpty().withMessage('La descripcion es requerida').isLength({min: 20}).withMessage('La descripcion es muy corta'),
              body('categoria').isNumeric().withMessage('Selecciona una categoria'),
              body('precio').isNumeric().withMessage('Selecciona una precio'),
              body('estacionamiento').isNumeric().withMessage('Selecciona una estacionamiento'),
              body('wc').isNumeric().withMessage('Selecciona un numero de wc'),
              body('habitaciones').isNumeric().withMessage('Selecciona una habitacion'),
              body('lat').notEmpty().withMessage('Selecciona una calle en el Mapa'),

              guardar
            );

router.get("/propiedades/agregar-imagen/:id",ProtegerRuta, agregarImagen)

router.post("/propiedades/agregar-imagen/:id",ProtegerRuta, upload.single("imagen"), SubirPropiedad)


export default router;