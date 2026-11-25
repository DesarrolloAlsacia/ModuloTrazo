"use client"

import { Interfaces } from "./_components/InterfacesView.jsx"
import { useDatos } from "../_hooks/impresion-context.jsx"

export default function InterfacesPage() {
  return <Interfaces {...useDatos()} />
}
