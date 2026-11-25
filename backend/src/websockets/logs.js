const { WebSocket, WebSocketServer } = require("ws")
const { listarLogs, normalizarFecha } = require("../models/log.model")
const { verificarToken } = require("../middlewares/sesion.middleware")

const RUTA_LOGS = "/ws/logs"
const INTERVALO_MS = 500

function adjuntarLogsWebSocket(server) {
  const wss = new WebSocketServer({ noServer: true })
  let temporizador = null
  const enCursoPorFecha = new Map()
  const ultimoMensajePorFecha = new Map()

  function enviar(cliente, mensaje) {
    if (cliente.readyState === WebSocket.OPEN) cliente.send(mensaje)
  }

  function transmitir(fecha, mensaje) {
    const texto = JSON.stringify(mensaje)
    ultimoMensajePorFecha.set(fecha, texto)
    for (const cliente of wss.clients) {
      if (cliente.fecha === fecha) enviar(cliente, texto)
    }
  }

  async function publicarFecha(fecha) {
    if (enCursoPorFecha.get(fecha)) return
    enCursoPorFecha.set(fecha, true)
    try {
      const logs = await listarLogs(fecha)
      transmitir(fecha, {
        tipo: "logs",
        fecha,
        logs,
        actualizadoEn: new Date().toISOString(),
      })
    } catch (error) {
      console.error(`[logs-ws] No se pudo consultar tz_log (${fecha}):`, error.message)
      transmitir(fecha, {
        tipo: "error",
        fecha,
        mensaje: "No se pudo consultar tz_log. Revisa la conexión SQL.",
      })
    } finally {
      enCursoPorFecha.set(fecha, false)
    }
  }

  function publicar() {
    if (wss.clients.size === 0) return
    const fechas = new Set()
    for (const cliente of wss.clients) fechas.add(cliente.fecha)
    for (const fecha of fechas) publicarFecha(fecha)
  }

  function iniciar() {
    if (temporizador) return
    temporizador = setInterval(publicar, INTERVALO_MS)
    publicar()
  }

  function detener() {
    if (!temporizador) return
    clearInterval(temporizador)
    temporizador = null
  }

  server.on("upgrade", (req, socket, head) => {
    let url
    try {
      url = new URL(req.url, "http://localhost")
    } catch {
      socket.destroy()
      return
    }

    if (url.pathname !== RUTA_LOGS) {
      socket.destroy()
      return
    }

    const usuario = verificarToken(url.searchParams.get("token") || "")
    if (!usuario) {
      socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n")
      socket.destroy()
      return
    }

    const fecha = normalizarFecha(url.searchParams.get("fecha"))
    wss.handleUpgrade(req, socket, head, (cliente) => {
      cliente.usuario = usuario
      cliente.fecha = fecha
      wss.emit("connection", cliente, req)
    })
  })

  wss.on("connection", (cliente) => {
    const ultimo = ultimoMensajePorFecha.get(cliente.fecha)
    if (ultimo) enviar(cliente, ultimo)
    iniciar()
    cliente.on("close", () => {
      if (wss.clients.size === 0) detener()
    })
  })

  return {
    cerrar() {
      detener()
      enCursoPorFecha.clear()
      ultimoMensajePorFecha.clear()
      for (const cliente of wss.clients) {
        cliente.close(1001, "Servidor apagado")
      }
      wss.close()
    },
  }
}

module.exports = { adjuntarLogsWebSocket }
