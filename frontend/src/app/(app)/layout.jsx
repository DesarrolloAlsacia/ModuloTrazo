"use client"

import { useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Layout } from "../../components/views/LayoutView.jsx"
import { ImpresionProvider } from "../../lib/impresion-context.jsx"
import { useSesion } from "../../lib/sesion-context.jsx"

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
    return <p role="status">Cargando Trazo…</p>
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
