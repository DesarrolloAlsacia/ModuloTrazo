export async function login(usuario, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.mensaje || "No se pudo iniciar sesión")
  localStorage.setItem("trazo_token", data.token)
  localStorage.setItem("trazo_usuario", JSON.stringify(data.usuario))
  return data
}

export function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem("trazo_usuario"))
  } catch {
    return null
  }
}

export function cerrarSesion() {
  localStorage.removeItem("trazo_token")
  localStorage.removeItem("trazo_usuario")
}

export function estaAutenticado() {
  try {
    const token = localStorage.getItem("trazo_token")
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    )
    return Date.now() < payload.exp * 1000
  } catch {
    return false
  }
}

export async function validarSesion() {
  if (!estaAutenticado()) return false
  const response = await fetch("/api/auth/me", {
    headers: { Authorization: "Bearer " + localStorage.getItem("trazo_token") },
  })
  if (!response.ok) {
    cerrarSesion()
    return false
  }
  const data = await response.json()
  localStorage.setItem("trazo_usuario", JSON.stringify(data.usuario))
  return true
}
