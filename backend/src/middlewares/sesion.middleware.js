const jwt = require("jsonwebtoken")

function verificarToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

function validarToken(req, res, next) {
  const authorization = req.headers.authorization || ""
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : ""

  req.usuario = verificarToken(token)
  if (!req.usuario) {
    return res.status(401).json({
      success: false,
      mensaje: "Sesión no válida. Inicia sesión nuevamente",
    })
  }
  next()
}

module.exports = { validarToken, verificarToken }
