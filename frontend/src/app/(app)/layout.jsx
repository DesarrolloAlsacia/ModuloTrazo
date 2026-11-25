"use client"

import { useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Layout } from "./_components/LayoutView.jsx"
import { ImpresionProvider } from "./_hooks/impresion-context.jsx"
import PantallaCarga from "../../components/ui/PantallaCarga.jsx"
import { useSesion } from "../_hooks/sesion-context.jsx"

export default function AppLayout({ children }) {
  const { usuario, cerrarSesion } = useSesion()
  const pathname = usePathname()

  const ruta =
    pathname === "/trabajos"
      ? "impresoras"
      : pathname.split("/").filter(Boolean).pop() || "dashboard"

  const sesionVencida = useCallback(
    () => cerrarSesion("Tu sesión expiró."),
    [cerrarSesion],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (usuario === undefined || !usuario) {
    return <PantallaCarga />
  }

  return (
    <ImpresionProvider activa sesionVencida={sesionVencida}>
      <Layout
        ruta={ruta}
        usuario={usuario}
        cerrarSesion={() => cerrarSesion()}
      >
        {children}
      </Layout>
    </ImpresionProvider>
  )
}
