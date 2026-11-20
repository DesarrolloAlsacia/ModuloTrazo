"use client"

import { Dashboard } from "../../../components/views/DashboardView.jsx"
import { useDatos } from "../../../lib/impresion-context.jsx"

export default function DashboardPage() {
  return <Dashboard {...useDatos()} />
}
