async function llamada(ruta, opciones = {}) {
  const token = localStorage.getItem("trazo_token")
  let respuesta
  try {
    respuesta = await fetch(ruta, {
      ...opciones,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
        ...opciones.headers,
      },
    })
  } catch {
    throw new Error(
      "No se pudo conectar con Trazo. Revisa que el backend esté iniciado.",
    )
  }
  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || "No se pudo completar la acción")
    error.status = respuesta.status
    throw error
  }
  return datos
}

const post = (ruta, cuerpo) =>
  llamada(ruta, {
    method: "POST",
    ...(cuerpo ? { body: JSON.stringify(cuerpo) } : {}),
  })

export function obtenerControl() {
  return llamada("/api/impresion")
}

export function establecerActivo(activo) {
  return post("/api/impresion/" + (activo ? "iniciar" : "detener"))
}

export function establecerDocumento(documento) {
  return post("/api/impresion/documento", { documento })
}

export function establecerModo(modo) {
  return post("/api/impresion/modo", { modo })
}

export function obtenerImpresoras() {
  return llamada("/api/impresoras/estados")
}

export function establecerImpresora(code, activa) {
  return llamada("/api/impresoras/" + encodeURIComponent(code), {
    method: "PATCH",
    body: JSON.stringify({ activa }),
  })
}

export function probarImpresora(code) {
  return post("/api/impresoras/" + encodeURIComponent(code) + "/prueba")
}
