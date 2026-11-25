import { useEffect, useState } from "react"
import { hoy } from "../../../../lib/fechas.js"
import { obtenerHistorialTrabajos } from "../../../../lib/services/trabajos.service.js"

export function useHistorialTrabajos(codigo, sesionVencida, fecha = hoy()) {
  const [trabajos, setTrabajos] = useState([])
  const [cargando, setCargando] = useState(Boolean(codigo))
  const [error, setError] = useState("")

  useEffect(() => {
    if (!codigo) {
      setTrabajos([])
      setCargando(false)
      setError("")
      return
    }

    let vivo = true
    setCargando(true)
    setError("")
    setTrabajos([])

    obtenerHistorialTrabajos(codigo, fecha || hoy())
      .then((datos) => {
        if (!vivo) return
        setTrabajos(Array.isArray(datos.trabajos) ? datos.trabajos : [])
      })
      .catch((fallo) => {
        if (!vivo) return
        if (fallo.status === 401) {
          sesionVencida?.()
          return
        }
        setError(fallo.message || "No se pudo cargar el historial de trabajos.")
      })
      .finally(() => {
        if (vivo) setCargando(false)
      })

    return () => {
      vivo = false
    }
  }, [codigo, fecha, sesionVencida])

  return { trabajos, cargando, error }
}
