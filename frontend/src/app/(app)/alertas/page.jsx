"use client"

import { Alertas } from "../../../components/views/AlertasView.jsx"
import { useDatos } from "../../../lib/impresion-context.jsx"

export default function AlertasPage() {
  return <Alertas {...useDatos()} />
}
