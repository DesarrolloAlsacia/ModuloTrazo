"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import * as sesion from "../../lib/services/login.service.js"

const SesionContext = createContext(null)

export function SesionProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [usuario, setUsuario] = useState(undefined)
  const [mensaje, setMensaje] = useState("")

  const validar = useCallback(async (aviso = "") => {
    try {
      if (await sesion.validarSesion()) {
        setUsuario(sesion.obtenerUsuario())
        setMensaje(aviso)
        return true
      }
      setUsuario(null)
      setMensaje(aviso)
      return false
    } catch {
      sesion.cerrarSesion()
      setUsuario(null)
      setMensaje(
        aviso || "No se pudo conectar con Trazo. Revisa que el backend esté iniciado.",
      )
      return false
    }
  }, [])

  const cerrarSesion = useCallback(
    (aviso = "") => {
      sesion.cerrarSesion()
      setMensaje(aviso)
      setUsuario(null)
      router.replace("/login")
    },
    [router],
  )

  useEffect(() => {
    validar()
  }, [validar])

  useEffect(() => {
    if (usuario === undefined) return
    if (usuario && (pathname === "/" || pathname === "/login")) {
      router.replace("/dashboard")
    } else if (!usuario && pathname !== "/login") {
      router.replace("/login")
    }
  }, [usuario, pathname, router])

  const valor = useMemo(
    () => ({ usuario, mensaje, validar, cerrarSesion }),
    [usuario, mensaje, validar, cerrarSesion],
  )

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

export function useSesion() {
  const contexto = useContext(SesionContext)
  if (!contexto) throw new Error("useSesion debe usarse dentro de SesionProvider")
  return contexto
}
