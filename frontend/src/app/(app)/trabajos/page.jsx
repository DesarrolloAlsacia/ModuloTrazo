"use client"

import { useCallback, Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CapaCarga from "../../../components/ui/CapaCarga.jsx"
import PantallaCarga from "../../../components/ui/PantallaCarga.jsx"
import { hoy } from "../../../lib/fechas.js"
import { useSesion } from "../../_hooks/sesion-context.jsx"
import TrabajosView from "./_components/TrabajosView.jsx"
import { useHistorialTrabajos } from "./_hooks/useHistorialTrabajos.js"

function Contenido() {
  const parametros = useSearchParams()
  const router = useRouter()
  const { cerrarSesion } = useSesion()
  const sesionVencida = useCallback(
    () => cerrarSesion("Tu sesión expiró."),
    [cerrarSesion],
  )
  const [fecha, setFecha] = useState(hoy)
  const codigo = parametros.get("impresora")
  const datos = useHistorialTrabajos(codigo, sesionVencida, fecha)

  useEffect(() => {
    if (!codigo) router.replace("/impresoras")
  }, [codigo, router])

  const impresora = {
    codigo,
    idCHK: parametros.get("idCHK"),
    ip: parametros.get("ip"),
  }

  return (
    <>
      {!codigo ? (
        <p role="status">Redirigiendo a impresoras…</p>
      ) : (
        <TrabajosView
          key={codigo}
          impresora={impresora}
          fecha={fecha}
          onFechaChange={setFecha}
          {...datos}
        />
      )}
      <CapaCarga
        listo={!codigo || !datos.cargando}
        mensaje="Cargando trabajos…"
      />
    </>
  )
}

export default function TrabajosPage() {
  return (
    <Suspense fallback={<PantallaCarga mensaje="Cargando trabajos…" />}>
      <Contenido />
    </Suspense>
  )
}
