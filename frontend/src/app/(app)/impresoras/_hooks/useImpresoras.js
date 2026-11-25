import { useEffect, useRef, useState } from "react"

const INTERVALO_ESTADOS_MS = 15000

function autorizacion() {
  return { Authorization: "Bearer " + localStorage.getItem("trazo_token") }
}

export function useInventarioImpresoras(sesionVencida) {
  const [impresoras, setImpresoras] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const solicitud = new AbortController()
    let vivo = true

    async function cargar() {
      try {
        const respuesta = await fetch("/api/impresoras", {
          headers: autorizacion(),
          signal: solicitud.signal,
        })
        if (solicitud.signal.aborted) return
        if (respuesta.status === 401) return sesionVencida()

        const datos = await respuesta.json()
        if (!respuesta.ok) throw new Error(datos.mensaje)
        setImpresoras(datos.impresoras)
        setError("")
      } catch (fallo) {
        if (!solicitud.signal.aborted)
          setError(fallo.message || "No se pudo cargar el inventario.")
      } finally {
        if (vivo) setCargando(false)
      }
    }

    cargar()
    return () => {
      vivo = false
      solicitud.abort()
    }
  }, [sesionVencida])

  return { impresoras, cargando, error }
}

export function useEstadosImpresoras(sesionVencida, reconexion) {
  const [estados, setEstados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const cargadoRef = useRef(false)

  useEffect(() => {
    const solicitud = new AbortController()
    let vivo = true
    setError("")
    if (!cargadoRef.current) setCargando(true)

    async function cargar() {
      try {
        const respuesta = await fetch("/api/impresoras/estados", {
          headers: autorizacion(),
          signal: solicitud.signal,
        })
        if (solicitud.signal.aborted) return
        if (respuesta.status === 401) return sesionVencida()
        if (!respuesta.ok) throw new Error()

        const datos = await respuesta.json()
        if (!solicitud.signal.aborted) setEstados(datos.impresoras)
      } catch {
        if (!solicitud.signal.aborted)
          setError(
            "No se pudo consultar el estado de las impresoras en el asistente.",
          )
      } finally {
        if (vivo && !cargadoRef.current) {
          cargadoRef.current = true
          setCargando(false)
        }
      }
    }

    cargar()
    const intervalo = setInterval(cargar, INTERVALO_ESTADOS_MS)
    return () => {
      vivo = false
      clearInterval(intervalo)
      solicitud.abort()
    }
  }, [sesionVencida, reconexion])

  return { estados, cargandoEstados: cargando, errorEstados: error }
}
