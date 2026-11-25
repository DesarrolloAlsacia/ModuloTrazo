export async function obtenerServidores() {
  const token = localStorage.getItem("trazo_token")
  const respuesta = await fetch("/api/servidores", {
    headers: { Authorization: "Bearer " + token },
  })

  if (respuesta.status === 401) {
    const error = new Error("Sesión vencida")
    error.status = 401
    throw error
  }

  const datos = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "No se pudieron cargar los servidores.")
  }
  return datos
}
