import { useEffect, useState } from "react"
import { obtenerCatalogo } from "../../../../lib/services/logs.service.js"

export function useCatalogo(sesionVencida) {
  const [apps, setApps] = useState([])
  const [tipos, setTipos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let vivo = true
    setCargando(true)
    setError("")

    obtenerCatalogo()
      .then((datos) => {
        if (!vivo) return
        setApps(Array.isArray(datos.apps) ? datos.apps : [])
        setTipos(Array.isArray(datos.tipos) ? datos.tipos : [])
      })
      .catch((fallo) => {
        if (!vivo) return
        if (fallo.status === 401) {
          sesionVencida?.()
          return
        }
        setError(fallo.message || "No se pudo cargar el catálogo de logs.")
      })
      .finally(() => {
        if (vivo) setCargando(false)
      })

    return () => {
      vivo = false
    }
  }, [sesionVencida])

  return { apps, tipos, cargando, error }
}
