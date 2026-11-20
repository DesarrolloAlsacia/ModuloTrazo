"use client"

import LoginView from "../../components/views/LoginView.jsx"
import { useSesion } from "../../lib/sesion-context.jsx"

export default function LoginPage() {
  const { usuario, mensaje, validar } = useSesion()
  if (usuario) return <p role="status">Cargando Trazo…</p>
  return <LoginView mensaje={mensaje} onAuthenticated={validar} />
}
