"use client"

import { Alertas } from "./_components/AlertasView.jsx"
import { useDatos } from "../_hooks/impresion-context.jsx"

export default function AlertasPage() {
  return <Alertas {...useDatos()} />
}
