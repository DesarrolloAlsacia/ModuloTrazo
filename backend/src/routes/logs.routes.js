const express = require("express")
const { validarToken } = require("../middlewares/sesion.middleware")
const { catalogo } = require("../controllers/logs.controller")

const router = express.Router()

router.get("/catalogo", validarToken, catalogo)

module.exports = router
