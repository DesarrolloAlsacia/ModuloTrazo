"use client"

import PantallaCarga from "../../components/ui/PantallaCarga.jsx"
import LoginView from "./_components/LoginView.jsx"
import { useSesion } from "../_hooks/sesion-context.jsx"

export default function LoginPage() {
  const { usuario, mensaje, validar } = useSesion()
  if (usuario) return <PantallaCarga />
  return <LoginView mensaje={mensaje} onAuthenticated={validar} />
}
