"use client"

import CapaCarga from "../../../components/ui/CapaCarga.jsx"
import { useDatos } from "../_hooks/impresion-context.jsx"
import { Impresoras } from "./_components/ImpresorasView.jsx"
import {
  useEstadosImpresoras,
  useInventarioImpresoras,
} from "./_hooks/useImpresoras.js"

export default function ImpresorasPage() {
  const datos = useDatos()
  const inventario = useInventarioImpresoras(datos.sesionVencida)
  const estados = useEstadosImpresoras(datos.sesionVencida, datos.reconexion)
  const listo = datos.listo && !inventario.cargando

  return (
    <>
      <Impresoras {...datos} {...inventario} {...estados} />
      <CapaCarga listo={listo} mensaje="Cargando impresoras…" />
    </>
  )
}
