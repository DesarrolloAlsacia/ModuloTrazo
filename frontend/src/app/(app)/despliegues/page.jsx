"use client"

import { Despliegues } from "../../../components/views/DesplieguesView.jsx"
import { useDatos } from "../../../lib/impresion-context.jsx"

export default function DesplieguesPage() {
  return <Despliegues {...useDatos()} />
}
