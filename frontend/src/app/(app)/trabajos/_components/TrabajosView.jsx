import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Cabecera } from "../../../../components/ui/Cabecera.jsx"
import Icon from "../../../../components/ui/Icon.jsx"
import { Titulo } from "../../../../components/ui/Titulo.jsx"
import { Vacio } from "../../../../components/ui/Vacio.jsx"
import { normalizar } from "../../../../lib/busqueda.js"
import {
  colorEstadoDocumento,
  nombreEstadoDocumento,
} from "../../../../lib/estados-documento.js"
import { hoy } from "../../../../lib/fechas.js"

function segundos(valor) {
  if (valor == null) return "—"
  const texto = new Intl.NumberFormat("es-CL", {
    maximumFractionDigits: 3,
  }).format(valor / 1000)
  return `${texto} s`
}

function conEstadisticas(trabajo) {
  return [
    trabajo.paginasImpresas,
    trabajo.envioMs,
    trabajo.colaMs,
    trabajo.impresionMs,
    trabajo.papelMs,
  ].some((valor) => valor != null)
}

export default function TrabajosView({
  impresora,
  fecha,
  onFechaChange,
  trabajos,
  cargando,
  error,
}) {
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    setBusqueda("")
  }, [fecha])

  const filtrados = useMemo(() => {
    const termino = normalizar(busqueda)
    if (!termino) return trabajos
    return trabajos.filter((trabajo) =>
      normalizar(
        [
          `Documento: ${trabajo.documento ?? ""}`,
          trabajo.tipo,
          trabajo.estado,
          nombreEstadoDocumento(trabajo.estado),
        ].join(" "),
      ).includes(termino),
    )
  }, [trabajos, busqueda])

  return (
    <>
      <Titulo
        nombre={`Trabajos de ${impresora.codigo}`}
        descripcion={`Historial por IdImpresora · ${fecha}`}
      />
      <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]">
        <Cabecera
          nombre="Historial de trabajos"
          descripcion="Documentos de AI_Factura y DESP_CABGUIA"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#999] px-6 py-4 text-xs">
          <Link
            className="font-[family-name:var(--hand)] text-[11px] underline decoration-dashed underline-offset-4"
            href="/impresoras"
          >
            ← Volver a Impresoras
          </Link>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded-[3px_6px_3px_5px] border-[1.5px] border-[#555] bg-[#f8f8f3] px-2 py-1 text-[#555] focus-within:border-[#222]">
              <Icon name="search" className="size-3.5 text-[#777]" />
              <input
                aria-label="Buscar en el historial"
                type="search"
                placeholder="Buscar documento, tipo o estado"
                className="min-w-0 flex-1 bg-transparent text-[11px] text-[#222] outline-none placeholder:text-[#888]"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            </label>
            <label className="flex items-center gap-2 text-[#555]">
              Fecha
              <input
                aria-label="Filtrar por fecha"
                type="date"
                max={hoy()}
                className="rounded-[3px_6px_3px_5px] border-[1.5px] border-[#555] bg-[#f8f8f3] px-2 py-1 text-[11px] text-[#222]"
                value={fecha}
                onChange={(evento) =>
                  onFechaChange(evento.target.value || hoy())
                }
              />
            </label>
            <button
              type="button"
              className="rounded-[3px_6px_3px_5px] border-[1.5px] border-[#555] bg-[#f8f8f3] px-2 py-1 font-[family-name:var(--hand)] text-[11px] hover:bg-neutral-100"
              onClick={() => onFechaChange(hoy())}
            >
              Hoy
            </button>
          </div>
        </div>
        {error && (
          <p
            role="alert"
            className="mx-6 mt-4 overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] p-3 text-xs"
          >
            {error}
          </p>
        )}
        {cargando ? (
          <p role="status" className="p-6 text-xs text-[#666]">
            Cargando trabajos…
          </p>
        ) : trabajos.length === 0 ? (
          <Vacio
            glyph="box"
            nombre="Sin trabajos"
            descripcion="No hay facturas ni guías para esta impresora y fecha."
          />
        ) : filtrados.length === 0 ? (
          <Vacio
            glyph="search"
            nombre="Sin coincidencias"
            descripcion={`No hay documentos que coincidan con “${busqueda}”.`}
          />
        ) : (
          <div className="p-4">
            <p className="mb-4 text-xs text-[#666]">
              {busqueda
                ? `${filtrados.length} coincidencias de ${trabajos.length} trabajos del ${fecha}`
                : `${trabajos.length} trabajos del ${fecha}`}
            </p>
            <div className="overflow-hidden rounded-[6px_8px_5px_9px] border-[1.5px] border-[#555] bg-[#f8f8f3] shadow-[3px_3px_0_#aaa]">
              {filtrados.map((trabajo) => (
                <details
                  key={trabajo.id}
                  className="border-b border-[#d5d5cd] last:border-b-0"
                >
                  <summary className="flex cursor-pointer flex-wrap items-center gap-2 px-4 py-3 font-mono text-[12px] text-[#222] hover:bg-[#efefe9]">
                    <span>
                      Documento: <strong className="font-semibold">{trabajo.documento || "—"}</strong>
                    </span>
                    <span
                      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] tracking-normal"
                      style={colorEstadoDocumento(trabajo.estado)}
                    >
                      {nombreEstadoDocumento(trabajo.estado)}
                    </span>
                  </summary>
                  <div className="border-t border-dashed border-[#ccc] px-4 py-3 text-[11px] text-[#555]">
                    <p className="mb-2 text-[10px] tracking-[0.6px] text-[#666] uppercase">
                      {trabajo.tipo}
                    </p>
                    {conEstadisticas(trabajo) ? (
                      <dl className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-5 gap-y-2 font-mono">
                        <div>
                          <dt className="text-[#777]">Páginas impresas</dt>
                          <dd className="text-[#222]">
                            {trabajo.paginasImpresas ?? "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#777]">Envío</dt>
                          <dd className="text-[#222]">
                            {segundos(trabajo.envioMs)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#777]">Cola</dt>
                          <dd className="text-[#222]">
                            {segundos(trabajo.colaMs)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#777]">Impresión</dt>
                          <dd className="text-[#222]">
                            {segundos(trabajo.impresionMs)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#777]">Papel</dt>
                          <dd className="text-[#222]">
                            {segundos(trabajo.papelMs)}
                          </dd>
                        </div>
                      </dl>
                    ) : (
                      <p className="text-[#777]">
                        Sin estadísticas para este documento.
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
