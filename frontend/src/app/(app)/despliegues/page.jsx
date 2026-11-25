"use client"

import { Despliegues } from "./_components/DesplieguesView.jsx"
import { useDatos } from "../_hooks/impresion-context.jsx"

export default function DesplieguesPage() {
  return <Despliegues {...useDatos()} />
}
