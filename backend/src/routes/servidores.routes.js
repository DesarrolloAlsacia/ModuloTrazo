const express = require("express")
const { validarToken } = require("../middlewares/sesion.middleware")
const { listar } = require("../controllers/servidores.controller")

const router = express.Router()

router.get("/", validarToken, listar)

module.exports = router
