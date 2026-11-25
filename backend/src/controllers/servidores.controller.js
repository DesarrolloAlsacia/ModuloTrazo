const { listarServidores } = require("../models/servidor.model")
const { conEstado } = require("../services/servidores.service")

async function listar(req, res) {
  try {
    const servidores = await listarServidores()
    res.json({ servidores: await conEstado(servidores) })
  } catch (error) {
    console.error("[servidores] No se pudo cargar TZ_SERVER:", error.message)
    res.status(500).json({
      mensaje: "No se pudieron cargar los servidores.",
    })
  }
}

module.exports = { listar }
