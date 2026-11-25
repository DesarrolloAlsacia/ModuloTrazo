import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Cabecera } from "../../../../components/ui/Cabecera.jsx"
import Icon from "../../../../components/ui/Icon.jsx"
import { Titulo } from "../../../../components/ui/Titulo.jsx"
import { normalizar } from "../../../../lib/busqueda.js"
import { colorPorTipo } from "../../../../lib/colores-log.js"
import { hoy } from "../../../../lib/fechas.js"

function fechaHora(valor) {
  if (!valor) return "—"
  const fecha = new Date(valor)
  return Number.isFinite(fecha.getTime())
    ? fecha.toLocaleString("es-CL")
    : String(valor)
}

export default function LogsView({
  conexion,
  logs,
  error,
  actualizadoEn,
  appId,
  apps,
  tipos,
  fecha,
  onFechaChange,
}) {
  const [app, setApp] = useState(appId ? String(appId) : "")
  const [tipo, setTipo] = useState("")
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    setApp(appId ? String(appId) : "")
  }, [appId])

  useEffect(() => {
    setBusqueda("")
  }, [fecha, appId])

  const leyenda = useMemo(() => {
    if (Array.isArray(tipos) && tipos.length) return tipos
    return [
      ...new Set(
        logs
          .map((log) => log.idTipo)
          .filter((valor) => valor !== null && valor !== undefined),
      ),
    ]
      .sort((a, b) => Number(a) - Number(b))
      .map((id) => ({ id, nombre: `Tipo ${id}` }))
  }, [tipos, logs])

  const nombreTipo = (id) =>
    leyenda.find((item) => String(item.id) === String(id))?.nombre ||
    (id == null ? "—" : `Tipo ${id}`)

  const appsDisponibles = useMemo(
    () =>
      [
        ...new Set(
          logs
            .map((log) => log.idApp)
            .filter(
              (valor) => valor !== null && valor !== undefined && valor !== "",
            ),
        ),
      ].sort((a, b) =>
        String(a).localeCompare(String(b), "es", { numeric: true }),
      ),
    [logs],
  )

  const porFiltros = useMemo(
    () =>
      logs.filter(
        (log) =>
          (!app || String(log.idApp) === String(app)) &&
          (!tipo || String(log.idTipo) === String(tipo)),
      ),
    [logs, app, tipo],
  )

  const visibles = useMemo(() => {
    const termino = normalizar(busqueda)
    if (!termino) return porFiltros
    return porFiltros.filter((log) =>
      normalizar(
        [
          log.id,
          log.idApp,
          nombreTipo(log.idTipo),
          log.idTipo,
          log.fecha,
          log.cuerpo,
        ].join(" "),
      ).includes(termino),
    )
  }, [porFiltros, busqueda, leyenda])

  const appActual = apps.find(
    (item) => String(item.id) === String(appId ?? app),
  )

  const listaApps =
    appsDisponibles.length > 0 ? appsDisponibles : apps.map((item) => item.id)

  const prompt = [
    "$ tail -f tz_log",
    `--fecha=${fecha}`,
    `--app=${appActual ? appActual.nombre : app || "todas"}`,
    `--tipo=${tipo ? nombreTipo(tipo) : "todos"}`,
    ...(busqueda ? [`--buscar=${busqueda}`] : []),
  ].join(" ")

  return (
    <>
      <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]">
        <Cabecera
          nombre={
            appActual ? `Logs de ${appActual.nombre}` : "Registros en vivo"
          }
          descripcion="Actualización automática por WebSocket"
        />
        <div className="border-b border-dashed border-[#999] px-6 py-4">
          <p className="mb-3 text-[10px] tracking-[1px] text-[#666] uppercase">
            Leyenda de tipos de log · clic para filtrar
          </p>
          <ul className="flex flex-wrap gap-2">
            <li>
              <button
                type="button"
                aria-pressed={!tipo}
                className="rounded-full border-[1.5px] px-2.5 py-1 font-[family-name:var(--hand)] text-[10px] transition"
                style={
                  tipo
                    ? {
                        backgroundColor: "#f8f8f3",
                        color: "#333",
                        borderColor: "#333",
                      }
                    : {
                        backgroundColor: "#333",
                        color: "#f8f8f3",
                        borderColor: "#333",
                      }
                }
                onClick={() => setTipo("")}
              >
                Todos
              </button>
            </li>
            {leyenda.map((item) => {
              const color = colorPorTipo(item.id)
              const seleccionado = String(tipo) === String(item.id)
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={seleccionado}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] transition hover:brightness-105"
                    style={{
                      backgroundColor: color.fondo,
                      color: color.texto,
                      borderColor: color.borde,
                      boxShadow: seleccionado
                        ? `0 0 0 2px ${color.borde}`
                        : "none",
                    }}
                    onClick={() => setTipo(seleccionado ? "" : String(item.id))}
                  >
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full"
                      style={{ backgroundColor: color.borde }}
                    />
                    {item.nombre}
                    <span className="opacity-60">· {item.id}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#999] px-6 py-4 text-xs">
          <p
            role="status"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/60 px-3 py-1.5"
          >
            <span
              aria-hidden="true"
              className={
                conexion === "En vivo"
                  ? "size-2 rounded-full bg-emerald-600"
                  : "size-2 rounded-full bg-amber-500"
              }
            />
            Canal de logs · {conexion}
          </p>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded-[3px_6px_3px_5px] border-[1.5px] border-[#555] bg-[#f8f8f3] px-2 py-1 text-[#555] focus-within:border-[#222]">
              <Icon name="search" className="size-3.5 text-[#777]" />
              <input
                aria-label="Buscar en los logs"
                type="search"
                placeholder="Buscar ID, app, tipo, fecha o cuerpo"
                className="min-w-0 flex-1 bg-transparent text-[11px] text-[#222] outline-none placeholder:text-[#888]"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            </label>
            <Link
              className="font-[family-name:var(--hand)] text-[11px] underline decoration-dashed underline-offset-4"
              href="/logs"
            >
              ← Todas las apps
            </Link>
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
        <div className="p-4">
          <p className="mb-4 text-xs text-[#666]">
            {busqueda
              ? `${visibles.length} coincidencias de ${porFiltros.length} registros del ${fecha}`
              : `${visibles.length} registros del ${fecha}`}
            {tipo ? ` · tipo ${nombreTipo(tipo)}` : ""} · actualizado{" "}
            {fechaHora(actualizadoEn)}
          </p>
          <div className="relative overflow-hidden rounded-[6px_8px_5px_9px] border-[1.5px] border-[#555] bg-[#f8f8f3] shadow-[3px_3px_0_#aaa]">
            <div className="flex items-center gap-2 border-b border-dashed border-[#999] bg-[#ecece6] px-3 py-2">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full bg-[#c25b54]"
              />
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full bg-[#c99a2e]"
              />
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full bg-[#4f8a55]"
              />
              <span className="ml-2 truncate font-mono text-[10px] text-[#444]">
                {prompt}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,#00000008_3px,#00000008_4px)] opacity-25"
            />
            <div className="relative max-h-[70vh] overflow-auto">
              {visibles.length === 0 ? (
                <p className="p-4 font-mono text-xs whitespace-pre-line text-[#555]">
                  {prompt}
                  {"\n"}
                  {busqueda
                    ? `0 coincidencias para “${busqueda}”.`
                    : "0 registros para este filtro."}
                </p>
              ) : (
                <table className="w-full border-collapse text-left font-mono text-[11px] text-[#222]">
                  <thead className="sticky top-0 bg-[#ecece6] text-[10px] tracking-[0.6px] text-[#555] uppercase">
                    <tr>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Tipo</th>
                      <th className="px-3 py-2">Fecha (BD)</th>
                      <th className="px-3 py-2">Cuerpo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibles.map((log) => {
                      const color = colorPorTipo(log.idTipo)
                      return (
                        <tr
                          key={log.id}
                          className="border-t border-[#d5d5cd] align-top hover:bg-[#efefe9]"
                          style={{ borderLeft: `4px solid ${color.borde}` }}
                        >
                          <td className="px-3 py-2 text-[#666]">
                            {log.id ?? "—"}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className="inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-[10px] whitespace-nowrap"
                              style={{
                                backgroundColor: color.fondo,
                                color: color.texto,
                                borderColor: color.borde,
                              }}
                            >
                              <span
                                aria-hidden="true"
                                className="size-2 rounded-full"
                                style={{ backgroundColor: color.borde }}
                              />
                              {nombreTipo(log.idTipo)}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-[#666]">
                            {log.fecha || "—"}
                          </td>
                          <td className="max-w-[520px] px-3 py-2 whitespace-pre-wrap break-words">
                            {log.cuerpo || "—"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
