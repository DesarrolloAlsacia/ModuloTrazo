const { listarTrabajos } = require("../models/trabajo.model")
const { normalizarFecha } = require("../models/log.model")

async function historial(req, res) {
  const codigo = String(req.params.code ?? "").trim()
  if (!codigo) {
    return res.status(400).json({ mensaje: "Indica la impresora." })
  }

  const fecha = normalizarFecha(req.query.fecha)

  try {
    const trabajos = await listarTrabajos(codigo, fecha)
    res.json({ codigo, fecha, trabajos })
  } catch (error) {
    console.error("[trabajos] No se pudo consultar AI_Factura/DESP_CABGUIA:", error.message)
    res.status(500).json({
      mensaje: "No se pudo cargar el historial de trabajos.",
    })
  }
}

module.exports = { historial }
