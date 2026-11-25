import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { Titulo } from "./components.jsx"
import TrabajosView, { estados as nombresDeEstado } from "./TrabajosView.jsx"
import Configuracion from "./ConfiguracionModal.jsx"

function ResumenTrabajos({
  trabajos,
  colas,
  codigo,
  idCHK,
  ip,
  conexion,
  pendientes,
}) {
  const [seleccion, setSeleccion] = useState(null)
  const dialogo = useRef(null)
  const tituloDialogo = useId()
  const normalizar = (valor) =>
    String(valor ?? "")
      .trim()
      .toLowerCase()
  const identificadores = [codigo, idCHK, ip].map(normalizar).filter(Boolean)
  const vinculados = trabajos.filter((trabajo) =>
    identificadores.includes(normalizar(trabajo.impresora)),
  )
  const cola = colas.find((item) =>
    [item.impresora, item.ip].some((valor) =>
      identificadores.includes(normalizar(valor)),
    ),
  )
  const trabajosDeCola = Array.isArray(cola?.trabajos)
    ? cola.trabajos.filter((trabajo) => typeof trabajo?.estado === "string")
    : []
  const recientes = trabajosDeCola.length ? trabajosDeCola : vinculados
  const etapas = [
    ["En cola", ["encolado"], cola?.resumen?.encolados ?? cola?.enCola],
    ["Enviando", ["enviando"]],
    ["Enviados", ["enviado", "papel"]],
    ["Terminados", ["terminado"], cola?.resumen?.terminados],
    ["Errores", ["error"], cola?.resumen?.conError],
  ]
  const trabajosDelModal = seleccion
    ? recientes.filter((trabajo) => seleccion.estados.includes(trabajo.estado))
    : []

  return (
    <section className="mt-auto border-t border-neutral-200 pt-4">
      <h4 className="mb-2 text-sm font-semibold">Trabajos recientes</h4>
      <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,112px),1fr))] gap-x-4">
        {etapas.map(([nombre, estados, total]) => {
          const cantidad =
            typeof total === "number"
              ? total
              : recientes.filter((trabajo) => estados.includes(trabajo.estado))
                  .length
          return (
            <div
              key={nombre}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 py-2 text-xs"
            >
              <dt>
                <button
                  type="button"
                  className="text-neutral-700 underline decoration-neutral-400 underline-offset-4 hover:text-black"
                  aria-haspopup="dialog"
                  onClick={() => {
                    setSeleccion({ nombre, estados })
                    dialogo.current.showModal()
                  }}
                >
                  {nombre}
                </button>
              </dt>
              <dd
                className={`rounded-full px-2 py-0.5 font-semibold tabular-nums ${
                  cantidad === 0
                    ? "bg-neutral-100 text-neutral-500"
                    : nombre === "Errores"
                      ? "bg-red-100 text-red-800"
                      : "bg-neutral-800 text-white"
                }`}
              >
                {conexion !== "En vivo" && !cola && trabajos.length === 0
                  ? "—"
                  : cantidad}
              </dd>
              {nombre === "En cola" && (
                <dd className="basis-full text-neutral-600">
                  {pendientes ?? "—"} facturas por tomar
                </dd>
              )}
            </div>
          )
        })}
      </dl>
      <dialog
        ref={dialogo}
        aria-labelledby={tituloDialogo}
        className="m-auto max-h-[85vh] w-[min(92vw,36rem)] overflow-auto rounded-xl border border-neutral-300 bg-[#fafaf7] p-5 text-neutral-900 shadow-lg backdrop:bg-black/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={tituloDialogo} className="text-xl">
              {seleccion?.nombre}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Impresora {codigo} · {conexion}
            </p>
          </div>
          <form method="dialog">
            <button className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]!">
              Cerrar
            </button>
          </form>
        </div>
        {seleccion?.nombre === "En cola" && (
          <p className="mt-4 rounded-lg bg-neutral-100 p-3 text-sm">
            <strong>{pendientes ?? "—"}</strong> facturas pendientes de que el
            asistente las tome.
          </p>
        )}
        <p className="my-4 text-sm" role="status">
          {trabajosDelModal.length} trabajos con detalle disponible
        </p>
        {trabajosDelModal.length === 0 && (
          <p className="text-sm text-neutral-600">
            El asistente no informa trabajos individuales en este estado.
          </p>
        )}
        <ul className="divide-y divide-neutral-200">
          {trabajosDelModal.map((trabajo) => (
            <li key={trabajo.id} className="py-3 text-sm">
              <p className="font-semibold">{trabajo.documento || trabajo.id}</p>
              <p className="text-neutral-600">
                {trabajo.tipo ? trabajo.tipo + " · " : ""}
                {nombresDeEstado[trabajo.estado] || trabajo.estado}
              </p>
              {trabajo.error && (
                <p className="mt-1 text-red-800">{trabajo.error}</p>
              )}
            </li>
          ))}
        </ul>
      </dialog>
      {recientes.length > 0 && (
        <ul className="mt-3 divide-y divide-neutral-200 rounded-lg bg-neutral-100 px-3">
          {recientes.slice(0, 3).map((trabajo) => (
            <li
              key={trabajo.id}
              className="flex flex-wrap items-baseline justify-between gap-x-3 py-2 text-xs"
            >
              <span className="min-w-0 break-words font-medium">
                {trabajo.documento || trabajo.id}
              </span>
              <span className="text-neutral-600">
                {nombresDeEstado[trabajo.estado] ||
                  trabajo.estado ||
                  "Sin estado"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function EstadoImpresora({ activa, guardando, error, onCambiar }) {
  return (
    <div className="my-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span role="status">
          {activa === true
            ? "Activa"
            : activa === false
              ? "Inactiva"
              : "Estado sin confirmar"}
        </span>
        <button
          type="button"
          className="relative z-30 inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]!"
          onClick={onCambiar}
          disabled={guardando || typeof activa !== "boolean"}
        >
          {guardando ? "Guardando…" : activa === true ? "Inactivar" : "Activar"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-800">
          {error}
        </p>
      )}
    </div>
  )
}

function TarjetaImpresora({
  Code,
  Modelo,
  IP,
  IdCHK,
  estado,
  evento,
  reconexion,
  sesionVencida,
  trabajos,
  colas,
  conexion,
  pendientes,
}) {
  const [confirmado, setConfirmado] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const activa =
    confirmado &&
    confirmado.evento === evento &&
    confirmado.reconexion === reconexion
      ? confirmado.activa
      : (evento?.activa ?? estado)

  async function cambiar() {
    setGuardando(true)
    setError("")
    try {
      const respuesta = await fetch(
        "/api/impresoras/" + encodeURIComponent(Code),
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("trazo_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ activa: !activa }),
        },
      )
      if (respuesta.status === 401) return sesionVencida()
      const datos = await respuesta.json()
      if (!respuesta.ok) throw new Error(datos.mensaje)
      setConfirmado({ activa: datos.activa, evento, reconexion })
    } catch (error) {
      setError(error.message || "No se pudo cambiar el estado.")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <li
      className={[
        "relative flex min-w-0 flex-col overflow-hidden rounded-[3px_7px_4px_9px] border-2! border-[#333]! p-4 shadow-[2px_2px_0_#333]",
        activa === false ? "bg-[#f5f3e8]" : "bg-[#f5f5f1]",
      ].join(" ")}
    >
      {activa === false && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-[repeating-linear-gradient(134deg,transparent_0px,transparent_9px,#3333335c_9px,#3333335c_11px),repeating-linear-gradient(136deg,transparent_0px,transparent_14px,#3333333d_14px,#3333333d_16px),repeating-linear-gradient(135deg,transparent_0px,transparent_23px,#25252529_23px,#25252529_24px)] opacity-90 blur-[0.35px] mix-blend-multiply"
        />
      )}
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-neutral-400 bg-white/60">
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              d="M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6zM7 12h1"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="min-w-0">
          <h3 className="text-lg break-words">
            Impresora {Code ?? "sin código"}
          </h3>
          <p className="mt-1 text-sm break-words text-neutral-600">
            {Modelo ?? "Modelo sin registrar"}
          </p>
        </div>
      </div>
      <dl className="my-4 flex flex-wrap gap-x-6 gap-y-2 rounded-lg bg-neutral-100 px-3 py-2 text-xs">
        <div className="min-w-0">
          <dt className="text-neutral-600">Dirección IP</dt>
          <dd className="mt-1 break-words font-mono">{IP ?? "—"}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-neutral-600">IdCHK</dt>
          <dd className="mt-1 break-words font-mono">{IdCHK ?? "—"}</dd>
        </div>
      </dl>
      <EstadoImpresora
        activa={activa}
        guardando={guardando}
        error={error}
        onCambiar={cambiar}
      />
      <ResumenTrabajos
        trabajos={trabajos}
        colas={colas}
        codigo={Code}
        idCHK={IdCHK}
        ip={IP}
        conexion={conexion}
        pendientes={pendientes}
      />
      <Link
        className="mt-4 flex items-center justify-between rounded-[3px_7px_4px_9px] border-2! border-[#333]! bg-[#f5f5f1] p-4 font-[family-name:var(--hand)] hover:border-neutral-500 hover:bg-neutral-100"
        href={
          "/trabajos?" +
          new URLSearchParams({
            impresora: Code,
            idCHK: IdCHK ?? "",
            ip: IP ?? "",
          })
        }
      >
        Ver trabajos <span aria-hidden="true">→</span>
      </Link>
    </li>
  )
}

export function Impresoras({
  sesionVencida,
  conexion,
  trabajos,
  colas,
  estadosEnVivo,
  configuracion,
  reconexion,
  onSincronizar,
}) {
  const [impresoras, setImpresoras] = useState(null)
  const [error, setError] = useState("")
  const [estados, setEstados] = useState([])
  const [errorEstados, setErrorEstados] = useState("")

  useEffect(() => {
    const solicitud = new AbortController()

    async function cargar() {
      try {
        const respuesta = await fetch("/api/impresoras", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("trazo_token"),
          },
          signal: solicitud.signal,
        })
        if (solicitud.signal.aborted) return
        if (respuesta.status === 401) return sesionVencida()

        const datos = await respuesta.json()
        if (!respuesta.ok) throw new Error(datos.mensaje)
        setImpresoras(datos.impresoras)
      } catch (error) {
        if (!solicitud.signal.aborted)
          setError(error.message || "No se pudo cargar el inventario.")
      }
    }

    cargar()
    return () => solicitud.abort()
  }, [sesionVencida])

  useEffect(() => {
    const solicitud = new AbortController()
    setErrorEstados("")
    async function cargarEstados() {
      try {
        const respuesta = await fetch("/api/impresoras/estados", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("trazo_token"),
          },
          signal: solicitud.signal,
        })
        if (solicitud.signal.aborted) return
        if (respuesta.status === 401) return sesionVencida()
        if (!respuesta.ok) throw new Error()
        const datos = await respuesta.json()
        if (!solicitud.signal.aborted) setEstados(datos.impresoras)
      } catch {
        if (!solicitud.signal.aborted)
          setErrorEstados(
            "No se pudo consultar el estado de las impresoras en el asistente.",
          )
      }
    }
    cargarEstados()
    const intervalo = setInterval(cargarEstados, 15000)
    return () => {
      clearInterval(intervalo)
      solicitud.abort()
    }
  }, [sesionVencida, reconexion])

  return (
    <>
      <Titulo
        nombre="Impresoras"
        descripcion="Consulta el inventario de impresoras registradas."
      />
      <section aria-labelledby="inventario">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="inventario" className="text-xl">
            Inventario{" "}
            {impresoras && (
              <span className="ml-2 rounded-full border border-neutral-400 px-2 py-0.5 text-xs">
                {impresoras.length}
              </span>
            )}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <p
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/60 px-3 py-1.5 text-xs"
              role="status"
            >
              <span
                aria-hidden="true"
                className={
                  conexion === "En vivo"
                    ? "size-2 rounded-full bg-emerald-600"
                    : "size-2 rounded-full bg-amber-500"
                }
              />
              Canal de impresión · {conexion}
            </p>
            <Configuracion
              configuracion={configuracion}
              estadosEnVivo={estadosEnVivo}
              conexion={conexion}
              sesionVencida={sesionVencida}
              onSincronizar={onSincronizar}
            />
          </div>
        </div>
        {error && (
          <p
            className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa] p-5"
            role="alert"
          >
            {error}
          </p>
        )}
        {errorEstados && (
          <p className="mb-4 text-sm text-red-800" role="alert">
            {errorEstados}
          </p>
        )}
        {!error && impresoras === null && (
          <p
            className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa] p-5"
            role="status"
          >
            Cargando impresoras…
          </p>
        )}
        {impresoras?.length === 0 && (
          <p className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa] p-5">
            No hay impresoras registradas.
          </p>
        )}
        {impresoras?.length > 0 && (
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-5">
            {impresoras.map(({ Code, Modelo, IP, IdCHK }) => (
              <TarjetaImpresora
                key={Code}
                Code={Code}
                Modelo={Modelo}
                IP={IP}
                IdCHK={IdCHK}
                estado={
                  estados.find((item) => String(item.code) === String(Code))
                    ?.activa
                }
                evento={estadosEnVivo[String(Code)]}
                reconexion={reconexion}
                sesionVencida={sesionVencida}
                trabajos={trabajos}
                colas={colas}
                conexion={conexion}
                pendientes={
                  estados.find((item) => String(item.code) === String(Code))
                    ?.pendientes
                }
              />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
