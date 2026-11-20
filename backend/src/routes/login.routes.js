const express = require("express")
const { login } = require("../controllers/login.controller")
const { validarToken } = require("../middlewares/sesion.middleware")
const router = express.Router()

router.post("/login", login)
router.get("/me", validarToken, (req, res) =>
  res.json({ usuario: req.usuario }),
)

module.exports = router
