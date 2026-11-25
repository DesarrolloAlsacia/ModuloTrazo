"use client"

import PantallaCarga from "../components/ui/PantallaCarga.jsx"
import { useSesion } from "./_hooks/sesion-context.jsx"

export default function Home() {
  useSesion()
  return <PantallaCarga />
}
