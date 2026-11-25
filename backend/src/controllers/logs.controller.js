const { listarApps, listarTipos } = require("../models/catalogo.model")

async function catalogo(req, res) {
  try {
    const [apps, tipos] = await Promise.all([listarApps(), listarTipos()])
    res.json({ apps, tipos })
  } catch (error) {
    console.error("[logs] No se pudo cargar el catálogo:", error.message)
    res.status(500).json({
      mensaje: "No se pudo cargar el catálogo de aplicaciones y tipos de log.",
    })
  }
}

module.exports = { catalogo }
