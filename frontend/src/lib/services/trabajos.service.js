export async function obtenerHistorialTrabajos(codigo, fecha) {
  const token = localStorage.getItem("trazo_token")
  const parametros = new URLSearchParams({ fecha })
  const respuesta = await fetch(
    `/api/impresoras/${encodeURIComponent(codigo)}/trabajos?${parametros}`,
    { headers: { Authorization: "Bearer " + token } },
  )

  if (respuesta.status === 401) {
    const error = new Error("Sesión vencida")
    error.status = 401
    throw error
  }

  const datos = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje || "No se pudo cargar el historial de trabajos.",
    )
  }
  return datos
}
