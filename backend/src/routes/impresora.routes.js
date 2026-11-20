const { Router } = require('express');
const { validarToken } = require('../middlewares/sesion.middleware');
const { listar, listarEstados, cambiarEstado } = require('../controllers/impresora.controller');

const router = Router();
router.get('/', validarToken, listar);
router.get('/estados', validarToken, listarEstados);
router.patch('/:code', validarToken, cambiarEstado);

module.exports = router;
