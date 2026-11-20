const jwt = require("jsonwebtoken")

function validarToken(req, res, next) {
  const authorization = req.headers.authorization || ""
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : ""

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({
      success: false,
      mensaje: "Sesión no válida. Inicia sesión nuevamente",
    })
  }
}

module.exports = { validarToken }
