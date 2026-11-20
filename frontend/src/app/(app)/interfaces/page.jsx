"use client"

import { Interfaces } from "../../../components/views/InterfacesView.jsx"
import { useDatos } from "../../../lib/impresion-context.jsx"

export default function InterfacesPage() {
  return <Interfaces {...useDatos()} />
}
