import { useEffect, useState } from "react"
import { hoy } from "../../../../lib/fechas.js"
import { estaAutenticado } from "../../../../lib/services/login.service.js"

function destinoWebSocket() {
  if (typeof window === "undefined") return ""
  const protocolo = window.location.protocol === "https:" ? "wss" : "ws"
  const puerto =
    window.location.port === "5174" ? "5173" : window.location.port
  const autoridad = puerto
    ? `${window.location.hostname}:${puerto}`
    : window.location.hostname
  return `${protocolo}://${autoridad}/ws/logs`
}

export function useLogs(activa = true, sesionVencida, fecha = hoy()) {
  const [conexion, setConexion] = useState("Conectando…")
  const [logs, setLogs] = useState([])
  const [error, setError] = useState("")
  const [actualizadoEn, setActualizadoEn] = useState(null)
  const [cargando, setCargando] = useState(activa)

  useEffect(() => {
    if (!activa) {
      setCargando(false)
      return
    }
    setCargando(true)
    setLogs([])
    setActualizadoEn(null)
    let cliente
    let reintento
    let vivo = true
    let intentos = 0
    let recibido = false
    const espera = setTimeout(() => {
      if (vivo && !recibido) {
        setCargando(false)
        setError("No se pudieron cargar los logs en este momento.")
      }
    }, 15000)

    function conectar() {
      if (!estaAutenticado()) {
        setConexion("Sesión vencida")
        setError("Tu sesión expiró. Inicia sesión nuevamente.")
        setCargando(false)
        sesionVencida?.()
        return
      }
      const token = localStorage.getItem("trazo_token")

      let destino
      try {
        destino = new URL(destinoWebSocket())
        destino.searchParams.set("token", token)
        destino.searchParams.set("fecha", fecha)
      } catch {
        setConexion("Sin conexión")
        setError("No se pudo construir la URL del canal de logs.")
        setCargando(false)
        return
      }

      setConexion("Conectando…")
      try {
        cliente = new WebSocket(destino)
      } catch {
        setConexion("Sin conexión")
        setError("No se pudo abrir el canal de logs.")
        setCargando(false)
        return
      }

      cliente.onopen = () => {
        intentos = 0
        setConexion("En vivo")
        setError("")
      }

      cliente.onmessage = (evento) => {
        let datos
        try {
          datos = JSON.parse(evento.data)
        } catch {
          setError("Mensaje inválido del servidor de logs.")
          return
        }
        if (datos?.tipo === "logs") {
          recibido = true
          clearTimeout(espera)
          setCargando(false)
          setLogs(Array.isArray(datos.logs) ? datos.logs : [])
          setActualizadoEn(datos.actualizadoEn || new Date().toISOString())
          setError("")
        } else if (datos?.tipo === "error") {
          setError(datos.mensaje || "Error del servidor de logs.")
        }
      }

      cliente.onerror = () => {
        clearTimeout(espera)
        setCargando(false)
        setError("No se pudo conectar con el servidor de logs.")
      }

      cliente.onclose = () => {
        if (!vivo) return
        if (!estaAutenticado()) {
          setConexion("Sesión vencida")
          setError("Tu sesión expiró. Inicia sesión nuevamente.")
          setCargando(false)
          sesionVencida?.()
          return
        }
        setConexion("Reconectando…")
        intentos += 1
        reintento = setTimeout(conectar, Math.min(1000 * intentos, 5000))
      }
    }

    conectar()
    return () => {
      vivo = false
      clearTimeout(espera)
      clearTimeout(reintento)
      if (cliente) cliente.close()
    }
  }, [activa, sesionVencida, fecha])

  return { conexion, logs, error, actualizadoEn, cargando }
}
