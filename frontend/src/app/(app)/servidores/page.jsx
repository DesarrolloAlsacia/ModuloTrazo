"use client"

import { Servidores } from "../../../components/views/ServidoresView.jsx"
import { useDatos } from "../../../lib/impresion-context.jsx"

export default function ServidoresPage() {
  return <Servidores {...useDatos()} />
}
