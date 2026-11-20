const { listarImpresoras } = require("../models/impresora.model")

const baseAsistente = () =>
  (process.env.IMPRESION_API_URL || "http://172.16.21.150:3000").replace(
    /\/$/,
    "",
  )

async function asistenteRuta(ruta, opciones = {}) {
  const respuesta = await fetch(baseAsistente() + ruta, {
    ...opciones,
    signal: AbortSignal.timeout(5000),
  })
  if (!respuesta.ok) throw new Error("El asistente rechazó la solicitud")
  return respuesta.json()
}

const asistente = (ruta = "", opciones = {}) =>
  asistenteRuta("/api/impresoras" + ruta, opciones)
const conEstado = (datos) => ({ estado: datos?.estado ?? datos })

const FALLOS = {
  listar: "No se pudo consultar el estado en el asistente de impresión.",
  control: "No se pudo consultar el control global del asistente.",
  cambio: "El asistente no confirmó el cambio.",
}

const DOCUMENTOS = new Set(["factura", "guia", "ambos"])
const COPIAS = new Set(["cedible", "solo_original"])
const MODOS_TEXTO = new Set([
  "cedible",
  "solo_original",
  "factura_cedible",
  "factura_solo_original",
  "guia_cedible",
  "guia_solo_original",
])

function modoValido(modo) {
  if (typeof modo === "string") return MODOS_TEXTO.has(modo)
  if (!modo || typeof modo !== "object" || Array.isArray(modo)) return false
  const claves = Object.keys(modo)
  return (
    claves.length > 0 &&
    claves.every((clave) => clave === "factura" || clave === "guia") &&
    claves.every((clave) => COPIAS.has(modo[clave]))
  )
}

async function listar(req, res) {
  try {
    res.json(await listarImpresoras())
  } catch {
    res.status(503).json({
      mensaje:
        "No se pudo consultar AI_Impresora. Revisa la conexión y los permisos de SQL Server.",
    })
  }
}

async function listarEstados(req, res) {
  try {
    const { impresoras } = await asistente()
    res.json({
      impresoras: impresoras.map(
        ({ code, id, modelo, activa, pendientes, fallidos }) => ({
          code,
          id,
          modelo,
          activa,
          pendientes,
          fallidos,
        }),
      ),
    })
  } catch {
    res.status(502).json({ mensaje: FALLOS.listar })
  }
}

async function probar(req, res) {
  try {
    const { prueba } = await asistente(
      "/" + encodeURIComponent(req.params.code) + "/prueba",
      { method: "POST" },
    )
    if (!prueba) throw new Error(FALLOS.cambio)
    res.json({ prueba })
  } catch {
    res.status(502).json({ mensaje: "No se pudo diagnosticar la impresora." })
  }
}

async function cambiarEstado(req, res) {
  const { activa } = req.body || {}
  if (typeof activa !== "boolean") {
    return res.status(400).json({
      mensaje: "Indica si la impresora debe quedar activa o inactiva.",
    })
  }

  try {
    const { impresora } = await asistente(
      "/" + encodeURIComponent(req.params.code),
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activa }),
      },
    )
    if (typeof impresora?.activa !== "boolean") throw new Error(FALLOS.cambio)
    res.json({ activa: impresora.activa })
  } catch {
    res
      .status(502)
      .json({ mensaje: FALLOS.cambio + " Recarga para comprobar el estado." })
  }
}

async function consumirControl(res, ruta, opciones, mensajeError) {
  try {
    res.json(conEstado(await asistenteRuta(ruta, opciones)))
  } catch {
    res.status(502).json({ mensaje: mensajeError })
  }
}

const cambiarActivo = (activo) => (req, res) =>
  consumirControl(
    res,
    "/api/impresion/" + (activo ? "iniciar" : "detener"),
    { method: "POST" },
    FALLOS.cambio,
  )

async function obtenerControl(req, res) {
  await consumirControl(res, "/api/impresion", {}, FALLOS.control)
}

async function obtenerModo(req, res) {
  await consumirControl(res, "/api/impresion/modo", {}, FALLOS.control)
}

async function cambiarDocumento(req, res) {
  const { documento } = req.body || {}
  if (!DOCUMENTOS.has(documento)) {
    return res
      .status(400)
      .json({ mensaje: "Selecciona factura, guia o ambos." })
  }
  await consumirControl(
    res,
    "/api/impresion/documento",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documento }),
    },
    FALLOS.cambio,
  )
}

async function cambiarModo(req, res) {
  const { modo } = req.body || {}
  if (!modoValido(modo)) {
    return res.status(400).json({
      mensaje:
        "Modo no válido. Usa cedible o solo_original para factura y guia.",
    })
  }
  await consumirControl(
    res,
    "/api/impresion/modo",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modo }),
    },
    FALLOS.cambio,
  )
}

module.exports = {
  listar,
  listarEstados,
  cambiarEstado,
  probar,
  obtenerControl,
  obtenerModo,
  iniciar: cambiarActivo(true),
  detener: cambiarActivo(false),
  cambiarDocumento,
  cambiarModo,
}
