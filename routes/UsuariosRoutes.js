import express from 'express';
import {formularioUsuario, formularioRegsitro,olvidePassword,registrar,confirmarCuenta, resertPassword,cambiarPassword, nuevoPassword, autenticar} from '../controllers/usuariosController.js';


const router = express.Router();

router.get('/login', formularioUsuario)
router.post('/login', autenticar)

router.get('/registro',formularioRegsitro)
router.post('/registro',registrar)
router.get('/confirmar/:token',confirmarCuenta)

router.get('/olvide', olvidePassword)
router.post('/olvide', resertPassword)

router.get('/olvide/:token', cambiarPassword)
router.post('/olvide/:token', nuevoPassword)
// Al exportar por default puedes llamarlo con cualquier otro nombre
export default router;
