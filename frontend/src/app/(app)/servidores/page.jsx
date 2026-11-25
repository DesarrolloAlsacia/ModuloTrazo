"use client"

import { useCallback } from "react"
import CapaCarga from "../../../components/ui/CapaCarga.jsx"
import { useSesion } from "../../_hooks/sesion-context.jsx"
import { Servidores } from "./_components/ServidoresView.jsx"
import { useServidores } from "./_hooks/useServidores.js"

export default function ServidoresPage() {
  const { cerrarSesion } = useSesion()
  const sesionVencida = useCallback(
    () => cerrarSesion("Tu sesión expiró."),
    [cerrarSesion],
  )

  const datos = useServidores(sesionVencida)

  return (
    <>
      <Servidores {...datos} />
      <CapaCarga listo={!datos.cargando} mensaje="Cargando servidores…" />
    </>
  )
}
