const net = require("net")

const PUERTO = Number(process.env.SERVIDORES_PUERTO || 5015)
const TIEMPO_ESPERA_MS = Number(process.env.SERVIDORES_TIMEOUT_MS || 700)

function verificarServidor(host, port = PUERTO, timeoutMs = TIEMPO_ESPERA_MS) {
  const nombre = String(host ?? "").trim()
  const verificadoEn = new Date().toISOString()

  if (!nombre) {
    return Promise.resolve({
      estado: "offline",
      latenciaMs: null,
      verificadoEn,
      detalle: "Sin host",
    })
  }

  return new Promise((resolve) => {
    const inicio = Date.now()
    let resuelto = false
    const socket = net.createConnection({ host: nombre, port, timeout: timeoutMs })

    function terminar(estado, detalle) {
      if (resuelto) return
      resuelto = true
      socket.destroy()
      resolve({
        estado,
        latenciaMs: estado === "online" ? Date.now() - inicio : null,
        verificadoEn,
        detalle,
      })
    }

    socket.once("connect", () => terminar("online", `TCP ${port}`))
    socket.once("timeout", () =>
      terminar("offline", `Sin respuesta en ${timeoutMs} ms`),
    )
    socket.once("error", (error) =>
      terminar("offline", error.code || error.message),
    )
  })
}

async function conEstado(servidores) {
  return Promise.all(
    (servidores || []).map(async (servidor) => ({
      ...servidor,
      ...(await verificarServidor(servidor.nombre)),
    })),
  )
}

module.exports = { verificarServidor, conEstado }
