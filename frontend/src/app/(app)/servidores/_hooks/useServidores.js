import { useEffect, useState } from "react"
import { obtenerServidores } from "../../../../lib/services/servidores.service.js"

const INTERVALO_MS = 1000

export function useServidores(sesionVencida) {
  const [servidores, setServidores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let vivo = true
    let enCurso = false
    let inicial = true

    async function cargar() {
      if (enCurso) return
      enCurso = true
      if (inicial) setCargando(true)

      try {
        const datos = await obtenerServidores()
        if (!vivo) return
        setServidores(Array.isArray(datos.servidores) ? datos.servidores : [])
        setError("")
      } catch (fallo) {
        if (!vivo) return
        if (fallo.status === 401) {
          sesionVencida?.()
          return
        }
        setError(fallo.message || "No se pudieron cargar los servidores.")
      } finally {
        if (!vivo) return
        if (inicial) {
          setCargando(false)
          inicial = false
        }
        enCurso = false
      }
    }

    cargar()
    const temporizador = setInterval(cargar, INTERVALO_MS)

    return () => {
      vivo = false
      clearInterval(temporizador)
    }
  }, [sesionVencida])

  return { servidores, cargando, error }
}
