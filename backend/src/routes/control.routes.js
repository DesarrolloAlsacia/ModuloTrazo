const { Router } = require("express")
const { validarToken } = require("../middlewares/sesion.middleware")
const {
  obtenerControl,
  obtenerModo,
  iniciar,
  detener,
  cambiarDocumento,
  cambiarModo,
} = require("../controllers/impresora.controller")

const router = Router()
router.get("/", validarToken, obtenerControl)
router.get("/estado", validarToken, obtenerControl)
router.get("/modo", validarToken, obtenerModo)
router.post("/iniciar", validarToken, iniciar)
router.post("/detener", validarToken, detener)
router.post("/documento", validarToken, cambiarDocumento)
router.post("/modo", validarToken, cambiarModo)

module.exports = router
