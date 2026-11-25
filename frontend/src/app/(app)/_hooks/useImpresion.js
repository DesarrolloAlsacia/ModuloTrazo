import { useCallback, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"

const eventos = [
  "trabajo:encolado",
  "trabajo:enviando",
  "trabajo:enviado",
  "trabajo:papel",
  "trabajo:terminado",
  "trabajo:error",
]

const DOCUMENTOS = ["factura", "guia", "ambos"]
const COPIAS = ["cedible", "solo_original"]

export function normalizarConfiguracion(datos) {
  if (!datos || typeof datos !== "object") return null
  const modo = datos.modo && typeof datos.modo === "object" ? datos.modo : {}
  return {
    activo: typeof datos.activo === "boolean" ? datos.activo : null,
    modoPruebas:
      typeof datos.modoPruebas === "boolean" ? datos.modoPruebas : null,
    documento: DOCUMENTOS.includes(datos.documento) ? datos.documento : null,
    modo: {
      factura: COPIAS.includes(modo.factura) ? modo.factura : null,
      guia: COPIAS.includes(modo.guia) ? modo.guia : null,
    },
    actualizadoEn: datos.actualizadoEn || datos.timestamp || null,
  }
}

export function useImpresion(activa) {
  const [conexion, setConexion] = useState("Conectando…")
  const [trabajos, setTrabajos] = useState([])
  const [colas, setColas] = useState([])
  const [estadosEnVivo, setEstadosEnVivo] = useState({})
  const [configuracion, setConfiguracion] = useState(null)
  const [reconexion, setReconexion] = useState(0)
  const [sincronizado, setSincronizado] = useState(false)
  const [errorConexion, setErrorConexion] = useState("")
  const solicitarRef = useRef(() => {})

  const solicitarSnapshot = useCallback(() => solicitarRef.current(), [])

  useEffect(() => {
    if (!activa) {
      setSincronizado(false)
      setErrorConexion("")
      return
    }
    setConexion("Conectando…")
    setTrabajos([])
    setColas([])
    setEstadosEnVivo({})
    setConfiguracion(null)
    setSincronizado(false)
    setErrorConexion("")
    const url =
      process.env.NEXT_PUBLIC_IMPRESION_URL ||
      "http://10.0.40.8:5015/impresion"

    const socket = io(url, { autoConnect: false })
    let actualizacion
    function pedir() {
      if (actualizacion) return
      actualizacion = setTimeout(() => {
        actualizacion = undefined
        if (socket.connected) socket.emit("impresion:solicitar")
      }, 150)
    }
    solicitarRef.current = pedir
    socket.on("connect", () => {
      setConexion("En vivo")
      setErrorConexion("")
      setEstadosEnVivo({})
      setReconexion((numero) => numero + 1)
      socket.emit("impresion:solicitar")
    })
    socket.on("impresora:estado", ({ codigo, activa } = {}) => {
      if (codigo == null || typeof activa !== "boolean") return
      setEstadosEnVivo((estados) => ({
        ...estados,
        [String(codigo)]: { activa },
      }))
      pedir()
    })
    socket.on("disconnect", () => {
      setConexion("Desconectado · última lectura")
      setErrorConexion("No se pudo mantener la conexión con el asistente de impresión.")
    })
    socket.on("connect_error", () => {
      setConexion("Sin conexión · reintentando")
      setErrorConexion("No se pudo conectar con el asistente de impresión.")
    })
    socket.on("impresion:snapshot", (datos) => {
      console.log("[Impresión] snapshot", datos)
      setSincronizado(true)
      setErrorConexion("")
      setConfiguracion(normalizarConfiguracion(datos.impresion))
      setColas(Array.isArray(datos.colas) ? datos.colas : [])
      const estadosIniciales = Object.fromEntries(
        (datos.impresoras || [])
          .filter(
            ({ codigo, code, activa }) =>
              (codigo ?? code) != null && typeof activa === "boolean",
          )
          .map(({ codigo, code, activa }) => [
            String(codigo ?? code),
            { activa },
          ]),
      )
      setEstadosEnVivo((estados) => ({ ...estadosIniciales, ...estados }))
      setTrabajos((lista) =>
        (datos.trabajos || []).map((trabajo) => ({
          ...trabajo,
          etapas: lista.find((item) => item.id === trabajo.id)?.etapas || [],
        })),
      )
    })
    socket.on("impresion:estado", (datos) => {
      console.log("[Impresión] estado", datos)
      const estado = normalizarConfiguracion(datos)
      if (estado) setConfiguracion((anterior) => ({ ...anterior, ...estado }))
      pedir()
    })
    for (const evento of eventos) {
      socket.on(
        evento,
        ({
          trabajo,
          error,
          tiempos,
          envioMs,
          papelMs,
          paginasDetectadas,
          timestamp,
        }) => {
          pedir()
          if (!trabajo?.id) return
          setTrabajos((lista) => {
            const anterior = lista.find((item) => item.id === trabajo.id)
            const estado = evento.split(":")[1]
            const fecha = timestamp || trabajo.actualizadoEn
            const etapas = (anterior?.etapas || []).filter(
              (etapa) => etapa.estado !== estado || etapa.fecha !== fecha,
            )
            const actualizado = {
              ...anterior,
              ...trabajo,
              estado,
              etapas: [...etapas, { estado, fecha }].slice(-30),
              error: error ?? trabajo.error ?? anterior?.error,
              tiempos: tiempos ?? trabajo.tiempos ?? anterior?.tiempos,
              envioMs: envioMs ?? trabajo.envioMs ?? anterior?.envioMs,
              papelMs: papelMs ?? trabajo.papelMs ?? anterior?.papelMs,
              paginasDetectadas:
                paginasDetectadas ??
                trabajo.paginasDetectadas ??
                anterior?.paginasDetectadas,
            }
            return [
              actualizado,
              ...lista.filter((item) => item.id !== trabajo.id),
            ].slice(0, 200)
          })
        },
      )
    }
    socket.connect()
    return () => {
      clearTimeout(actualizacion)
      solicitarRef.current = () => {}
      socket.removeAllListeners()
      socket.disconnect()
    }
  }, [activa])

  return {
    conexion,
    trabajos,
    colas,
    estadosEnVivo,
    configuracion,
    reconexion,
    sincronizado,
    listo: sincronizado || Boolean(errorConexion),
    errorConexion,
    solicitarSnapshot,
  }
}
