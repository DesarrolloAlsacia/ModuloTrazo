"use client"

import { createContext, useContext, useMemo } from "react"
import { useImpresion } from "./services/useImpresion.js"

const ImpresionContext = createContext(null)

export function ImpresionProvider({ activa, sesionVencida, children }) {
  const datos = useImpresion(activa)
  const valor = useMemo(
    () => ({
      ...datos,
      onSincronizar: datos.solicitarSnapshot,
      sesionVencida,
    }),
    [datos, sesionVencida],
  )
  return <ImpresionContext.Provider value={valor}>{children}</ImpresionContext.Provider>
}

export function useDatos() {
  const contexto = useContext(ImpresionContext)
  if (!contexto)
    throw new Error("useDatos debe usarse dentro de ImpresionProvider")
  return contexto
}
