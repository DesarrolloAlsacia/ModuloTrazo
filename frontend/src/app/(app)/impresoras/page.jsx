"use client"

import { Impresoras } from "../../../components/views/ImpresorasView.jsx"
import { useDatos } from "../../../lib/impresion-context.jsx"

export default function ImpresorasPage() {
  return <Impresoras {...useDatos()} />
}
