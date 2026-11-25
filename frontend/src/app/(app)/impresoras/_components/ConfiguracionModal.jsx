import { useId, useRef, useState } from "react"
import Icon from "../Icon.jsx"
import * as configuracionApi from "../../lib/services/configuracion.service.js"

const DOCUMENTOS = [
  ["factura", "Factura", "Solo facturas"],
  ["guia", "Guía", "Solo guías"],
  ["ambos", "Ambos", "Facturas y guías"],
]

const COPIAS = [
  ["cedible", "Cedible", "3 páginas · original + 2 cedibles"],
  ["solo_original", "Solo original", "1 página · sin cedibles"],
]

function formatearFecha(valor) {
  if (!valor) return "—"
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return "—"
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(fecha)
}

function GrupoOpciones({ nombre, descripcion, valor, opciones, onElegir, desactivado }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-semibold">{nombre}</h3>
      <p className="mt-1 text-xs text-neutral-500">{descripcion}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {opciones.map(([clave, etiqueta, detalle]) => {
          const elegido = valor === clave
          return (
            <button
              key={clave}
              type="button"
              disabled={desactivado}
              aria-pressed={elegido}
              onClick={() => onElegir(clave)}
              className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]! flex-col items-start gap-0 text-left"
              style={
                elegido ? { background: "#282828", color: "#fafafa" } : undefined
              }
            >
              <span>{etiqueta}</span>
              <span className="text-[10px] font-normal opacity-75">{detalle}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Configuracion({
  configuracion,
  estadosEnVivo = {},
  conexion,
  sesionVencida,
  onSincronizar,
}) {
  const dialogo = useRef(null)
  const tituloDialogo = useId()
  const [impresoras, setImpresoras] = useState([])
  const [cargando, setCargando] = useState(false)
  const [ocupado, setOcupado] = useState("")
  const [mensaje, setMensaje] = useState(null)
  const [diagnosticos, setDiagnosticos] = useState({})

  const sinDatos = !configuracion
  const activo = configuracion?.activo ?? null
  const modoPruebas = configuracion?.modoPruebas ?? null

  function manejarError(error) {
    if (error?.status === 401) {
      sesionVencida?.()
      dialogo.current?.close()
      return
    }
    setMensaje({ tipo: "error", texto: error?.message || "No se pudo completar la acción" })
  }

  async function cargarImpresoras() {
    setCargando(true)
    try {
      const datos = await configuracionApi.obtenerImpresoras()
      setImpresoras(Array.isArray(datos.impresoras) ? datos.impresoras : [])
    } catch (error) {
      manejarError(error)
    } finally {
      setCargando(false)
    }
  }

  async function ejecutar(clave, accion, texto, despues) {
    setOcupado(clave)
    setMensaje(null)
    try {
      await accion()
      if (despues) await despues()
      onSincronizar?.()
      setMensaje({ tipo: "ok", texto })
    } catch (error) {
      manejarError(error)
    } finally {
      setOcupado("")
    }
  }

  function abrir() {
    setMensaje(null)
    dialogo.current?.showModal()
    onSincronizar?.()
    cargarImpresoras()
  }

  const cambiarActivo = () =>
    ejecutar(
      "global",
      () => configuracionApi.establecerActivo(!activo),
      activo ? "Impresión pausada." : "Impresión reanudada.",
    )

  const cambiarDocumento = (documento) =>
    ejecutar(
      "documento-" + documento,
      () => configuracionApi.establecerDocumento(documento),
      "Selección actualizada a " + documento + ".",
    )

  const cambiarModo = (tipo, copias) =>
    ejecutar(
      "modo-" + tipo,
      () => configuracionApi.establecerModo({ [tipo]: copias }),
      "Copias de " + tipo + " actualizadas a " + copias + ".",
    )

  const cambiarImpresora = (impresora) => {
    const code = String(impresora.code)
    const activaAhora = estadosEnVivo[code]?.activa ?? impresora.activa
    return ejecutar(
      "impresora-" + code,
      () => configuracionApi.establecerImpresora(code, !activaAhora),
      "Impresora " + (impresora.id || code) + (activaAhora ? " desactivada." : " activada."),
      cargarImpresoras,
    )
  }

  const probar = (impresora) => {
    const code = String(impresora.code)
    return ejecutar(
      "prueba-" + code,
      async () => {
        const datos = await configuracionApi.probarImpresora(code)
        const salud = datos.prueba?.salud || {}
        const texto = [
          salud.tcp ? "TCP ok" : "TCP sin respuesta",
          salud.snmp ? "SNMP ok" : "SNMP sin respuesta",
          salud.latenciaMs != null ? salud.latenciaMs + " ms" : null,
          salud.contador != null ? "contador " + salud.contador : null,
        ]
          .filter(Boolean)
          .join(" · ")
        setDiagnosticos((anteriores) => ({
          ...anteriores,
          [code]: texto || "Prueba completada sin detalle.",
        }))
      },
      "Diagnóstico de " + (impresora.id || code) + " completado.",
    )
  }

  return (
    <>
      <button type="button" className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]!" onClick={abrir} aria-haspopup="dialog">
        <Icon name="settings" />
        Configuración
      </button>
      <dialog
        ref={dialogo}
        aria-labelledby={tituloDialogo}
        onClose={() => setMensaje(null)}
        className="m-auto max-h-[85vh] w-[min(92vw,44rem)] overflow-auto rounded-xl border border-neutral-300 bg-[#fafaf7] p-5 text-neutral-900 shadow-lg backdrop:bg-black/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={tituloDialogo} className="text-xl">
              Configuración de impresión
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Pausa, documentos, copias e impresoras en tiempo real.
            </p>
          </div>
          <form method="dialog">
            <button className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]!">Cerrar</button>
          </form>
        </div>

        {mensaje && (
          <p
            role={mensaje.tipo === "error" ? "alert" : "status"}
            className={
              "mt-4 rounded-lg p-3 text-sm " +
              (mensaje.tipo === "error"
                ? "bg-red-50 text-red-800"
                : "bg-neutral-100 text-neutral-800")
            }
          >
            {mensaje.texto}
          </p>
        )}

        <div className="mt-5 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-3 text-xs text-neutral-600">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong className="font-semibold text-neutral-800">Impresión global</strong>
            <span
              className={
                "rounded-full px-2 py-0.5 font-semibold " +
                (activo === null
                  ? "bg-neutral-200 text-neutral-500"
                  : activo
                    ? "bg-neutral-800 text-white"
                    : "bg-amber-200 text-amber-900")
              }
            >
              {activo === null ? "Sin datos" : activo ? "En marcha" : "Pausada"}
            </span>
          </div>
          <p className="mt-2">
            Al pausar, los trabajos en curso terminan y no se toman documentos nuevos.
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]! mt-3"
            disabled={sinDatos || Boolean(ocupado)}
            onClick={cambiarActivo}
          >
            <Icon name={activo ? "box" : "activity"} />
            {activo ? "Pausar impresión" : "Reanudar impresión"}
          </button>
        </div>

        {sinDatos && (
          <p className="mt-5 text-sm text-neutral-600" role="status">
            Esperando el estado del asistente por WebSocket…
          </p>
        )}

        <GrupoOpciones
          nombre="Tipo de documento"
          descripcion="Elige qué se procesa: facturas, guías o ambas colas a la vez."
          valor={configuracion?.documento}
          opciones={DOCUMENTOS}
          onElegir={cambiarDocumento}
          desactivado={sinDatos || Boolean(ocupado)}
        />

        <GrupoOpciones
          nombre="Copias de factura"
          descripcion="Con cedible salen 3 páginas; con solo original, 1."
          valor={configuracion?.modo?.factura}
          opciones={COPIAS}
          onElegir={(copias) => cambiarModo("factura", copias)}
          desactivado={sinDatos || Boolean(ocupado)}
        />

        <GrupoOpciones
          nombre="Copias de guía"
          descripcion="Se aplica a las guías, incluso cuando ambas colas están activas."
          valor={configuracion?.modo?.guia}
          opciones={COPIAS}
          onElegir={(copias) => cambiarModo("guia", copias)}
          desactivado={sinDatos || Boolean(ocupado)}
        />

        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Impresoras</h3>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]!"
              disabled={cargando || Boolean(ocupado)}
              onClick={cargarImpresoras}
            >
              Actualizar lista
            </button>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Desactivar omite sus documentos sin borrarlos. «Probar» solo diagnostica red: no
            imprime ni gasta papel.
          </p>
          {cargando && impresoras.length === 0 && (
            <p className="mt-3 text-sm text-neutral-600" role="status">
              Cargando impresoras…
            </p>
          )}
          <ul className="mt-3 max-h-64 divide-y divide-neutral-200 overflow-auto rounded-lg border border-neutral-200">
            {impresoras.map((impresora) => {
              const code = String(impresora.code)
              const activaAhora = estadosEnVivo[code]?.activa ?? impresora.activa
              const clave = "impresora-" + code
              return (
                <li key={code} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {impresora.id || code}
                      {impresora.modelo ? " · " + impresora.modelo : ""}
                    </p>
                    <p className="text-neutral-500">
                      {impresora.ip || "Sin IP"} · {impresora.pendientes ?? 0} pendientes ·{" "}
                      {impresora.fallidos ?? 0} fallidos
                    </p>
                    {diagnosticos[code] && (
                      <p className="mt-1 text-neutral-600" role="status">
                        Diagnóstico: {diagnosticos[code]}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 font-semibold " +
                        (activaAhora
                          ? "bg-neutral-800 text-white"
                          : "bg-neutral-200 text-neutral-600")
                      }
                    >
                      {activaAhora ? "Activa" : "Inactiva"}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]!"
                      disabled={Boolean(ocupado)}
                      onClick={() => cambiarImpresora(impresora)}
                    >
                      {activaAhora ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]!"
                      disabled={ocupado === "prueba-" + code}
                      onClick={() => probar(impresora)}
                    >
                      Probar
                    </button>
                  </div>
                </li>
              )
            })}
            {!cargando && impresoras.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-neutral-500">
                No hay impresoras disponibles en el asistente.
              </li>
            )}
          </ul>
        </div>

        <div className="mt-5 rounded-lg border border-dashed border-neutral-300 p-3 text-xs text-neutral-600">
          <strong className="font-semibold text-neutral-800">Modo PRUEBAS</strong>
          <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 font-semibold text-neutral-600">
            {modoPruebas === null ? "Sin datos" : modoPruebas ? "Activo" : "Desactivado"}
          </span>
          <p className="mt-2">
            Es una variable de entorno del daemon: no se cambia desde este panel. Con PRUEBAS
            activo, todas las impresoras arrancan desactivadas al reiniciar.
          </p>
        </div>

        <div className="mt-5 border-t border-dashed border-neutral-300 pt-4 text-xs text-neutral-600">
          <strong className="font-semibold text-neutral-800">Monitoreo en tiempo real</strong>
          <p className="mt-1">
            Canal: {conexion || "—"} · Último cambio: {formatearFecha(configuracion?.actualizadoEn)}{" "}
            (hora de Chile).
          </p>
          <p className="mt-1">
            Cada cambio emite <code>impresion:estado</code> y el panel vuelve a pedir el snapshot
            para confirmarlo.
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]! mt-3"
            onClick={() => onSincronizar?.()}
          >
            <Icon name="activity" />
            Sincronizar ahora
          </button>
        </div>
      </dialog>
    </>
  )
}
