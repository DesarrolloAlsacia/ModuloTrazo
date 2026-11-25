"use client"

import CapaCarga from "../../../components/ui/CapaCarga.jsx"
import { Dashboard } from "./_components/DashboardView.jsx"
import { useDatos } from "../_hooks/impresion-context.jsx"

export default function DashboardPage() {
  const datos = useDatos()

  return (
    <>
      <Dashboard {...datos} />
      <CapaCarga listo={datos.listo} mensaje="Cargando datos del tablero…" />
    </>
  )
}
