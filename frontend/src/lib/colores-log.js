const colores = {
  1: { fondo: "#e5e7eb", texto: "#374151", borde: "#9ca3af" },
  2: { fondo: "#dbeafe", texto: "#1e3a8a", borde: "#60a5fa" },
  3: { fondo: "#dcfce7", texto: "#14532d", borde: "#4ade80" },
  4: { fondo: "#fef9c3", texto: "#854d0e", borde: "#facc15" },
  5: { fondo: "#fee2e2", texto: "#7f1d1d", borde: "#f87171" },
  6: { fondo: "#fecaca", texto: "#450a0a", borde: "#dc2626" },
  7: { fondo: "#ede9fe", texto: "#4c1d95", borde: "#a78bfa" },
  8: { fondo: "#fce7f3", texto: "#831843", borde: "#f472b6" },
  9: { fondo: "#e0f2fe", texto: "#075985", borde: "#38bdf8" },
  10: { fondo: "#ccfbf1", texto: "#115e59", borde: "#2dd4bf" },
  11: { fondo: "#d9f99d", texto: "#3f6212", borde: "#84cc16" },
  12: { fondo: "#ffedd5", texto: "#7c2d12", borde: "#fb923c" },
  13: { fondo: "#e2e8f0", texto: "#334155", borde: "#94a3b8" },
  14: { fondo: "#fae8ff", texto: "#701a75", borde: "#e879f9" },
}

export function colorPorTipo(id) {
  return colores[Number(id)] || {
    fondo: "#f5f5f1",
    texto: "#333333",
    borde: "#777777",
  }
}
