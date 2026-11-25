export const estadosDocumento = {
  2: "Impreso",
  3: "Error",
  4: "Reimpreso",
}

export function nombreEstadoDocumento(valor) {
  if (valor == null || valor === "") return "—"
  return estadosDocumento[Number(valor)] || `Estado ${valor}`
}

export function colorEstadoDocumento(valor) {
  const estado = Number(valor)
  if (estado === 2) {
    return {
      backgroundColor: "#dcfce7",
      color: "#14532d",
      borderColor: "#4ade80",
    }
  }
  if (estado === 3) {
    return {
      backgroundColor: "#fee2e2",
      color: "#7f1d1d",
      borderColor: "#f87171",
    }
  }
  if (estado === 4) {
    return {
      backgroundColor: "#fef9c3",
      color: "#854d0e",
      borderColor: "#facc15",
    }
  }
  return {
    backgroundColor: "#e5e7eb",
    color: "#374151",
    borderColor: "#9ca3af",
  }
}
