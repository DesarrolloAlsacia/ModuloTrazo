const { Router } = require("express")
const { validarToken } = require("../middlewares/sesion.middleware")
const {
  listar,
  listarEstados,
  cambiarEstado,
  probar,
} = require("../controllers/impresora.controller")
const { historial } = require("../controllers/trabajos.controller")

const router = Router()
router.get("/", validarToken, listar)
router.get("/estados", validarToken, listarEstados)
router.get("/:code/trabajos", validarToken, historial)
router.post("/:code/prueba", validarToken, probar)
router.patch("/:code", validarToken, cambiarEstado)

module.exports = router
