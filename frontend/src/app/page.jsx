"use client"

import { useSesion } from "../lib/sesion-context.jsx"

export default function Home() {
  useSesion()
  return <p role="status">Cargando Trazo…</p>
}
