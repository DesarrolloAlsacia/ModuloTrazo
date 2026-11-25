"use client"

import { useCallback, Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import CapaCarga from "../../../components/ui/CapaCarga.jsx"
import PantallaCarga from "../../../components/ui/PantallaCarga.jsx"
import { hoy } from "../../../lib/fechas.js"
import { useSesion } from "../../_hooks/sesion-context.jsx"
import AppsView from "./_components/AppsView.jsx"
import LogsView from "./_components/LogsView.jsx"
import { useCatalogo } from "./_hooks/useCatalogo.js"
import { useLogs } from "./_hooks/useLogs.js"

function Contenido() {
  const parametros = useSearchParams()
  const { cerrarSesion } = useSesion()
  const sesionVencida = useCallback(
    () => cerrarSesion("Tu sesión expiró."),
    [cerrarSesion],
  )
  const catalogo = useCatalogo(sesionVencida)
  const [fecha, setFecha] = useState(hoy)
  const idApp = parametros.get("app")
  const datos = useLogs(Boolean(idApp), sesionVencida, fecha)

  const listo = !catalogo.cargando && (!idApp || !datos.cargando)

  return (
    <>
      {!idApp ? (
        <AppsView {...catalogo} />
      ) : (
        <LogsView
          {...datos}
          {...catalogo}
          appId={idApp}
          fecha={fecha}
          onFechaChange={setFecha}
        />
      )}
      <CapaCarga listo={listo} mensaje="Cargando logs…" />
    </>
  )
}

export default function LogsPage() {
  return (
    <Suspense fallback={<PantallaCarga mensaje="Cargando logs…" />}>
      <Contenido />
    </Suspense>
  )
}
