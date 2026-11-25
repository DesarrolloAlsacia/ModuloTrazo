export async function obtenerCatalogo() {
  const token = localStorage.getItem("trazo_token")
  const respuesta = await fetch("/api/logs/catalogo", {
    headers: { Authorization: "Bearer " + token },
  })

  if (respuesta.status === 401) {
    const error = new Error("Sesión vencida")
    error.status = 401
    throw error
  }

  const datos = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "No se pudo cargar el catálogo de logs.")
  }
  return datos
}
