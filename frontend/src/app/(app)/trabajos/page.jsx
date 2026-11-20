"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import TrabajosView from "../../../components/views/TrabajosView.jsx"
import { useDatos } from "../../../lib/impresion-context.jsx"

function Contenido() {
  const parametros = useSearchParams()
  const router = useRouter()
  const { conexion, trabajos } = useDatos()
  const codigo = parametros.get("impresora")

  useEffect(() => {
    if (!codigo) router.replace("/impresoras")
  }, [codigo, router])

  if (!codigo) return <p role="status">Redirigiendo a impresoras…</p>

  const impresora = {
    codigo,
    idCHK: parametros.get("idCHK"),
    ip: parametros.get("ip"),
  }

  return (
    <TrabajosView
      key={codigo}
      impresora={impresora}
      conexion={conexion}
      trabajos={trabajos}
    />
  )
}

export default function TrabajosPage() {
  return (
    <Suspense fallback={<p role="status">Cargando trabajos…</p>}>
      <Contenido />
    </Suspense>
  )
}
