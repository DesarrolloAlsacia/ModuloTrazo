import { Titulo } from "../../../../components/ui/Titulo.jsx"
import { Vacio } from "../../../../components/ui/Vacio.jsx"

function horaVerificacion(valor) {
  if (!valor) return "—"
  const fecha = new Date(valor)
  return Number.isFinite(fecha.getTime())
    ? fecha.toLocaleTimeString("es-CL")
    : String(valor)
}

export function Servidores({ servidores, cargando, error }) {
  return (
    <>
      <Titulo
        nombre="Servidores"
        descripcion="Equipos registrados en TZ_SERVER, excepto LOCAL."
      />
      <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#999] px-6 py-[21px]">
          <h2 className="m-0 text-xl">Servidores disponibles</h2>
          <p className="m-0 text-[11px] text-[#777]">
            {cargando
              ? "Consultando TZ_SERVER…"
              : `${servidores.length} servidores · verificación cada 1 s`}
          </p>
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
            Cargando servidores…
          </p>
        ) : servidores.length === 0 ? (
          <Vacio
            glyph="server"
            nombre="Sin servidores"
            descripcion="No hay registros disponibles en TZ_SERVER."
          />
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5 p-5">
            {servidores.map((servidor) => {
              const enLinea = servidor.estado === "online"
              return (
                <li key={servidor.id} className="min-w-0">
                  <div className="flex h-full flex-col rounded-[3px_7px_4px_9px] border-2! border-[#333]! bg-[#f5f5f1] p-4 shadow-[2px_2px_0_#333]">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-10 place-items-center rounded-lg border border-neutral-400 bg-white/60">
                        <svg
                          className="size-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <rect x="3" y="4" width="18" height="6" rx="2" />
                          <rect x="3" y="14" width="18" height="6" rx="2" />
                          <path d="M7 7h.01M7 17h.01" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span
                        title={servidor.detalle || ""}
                        className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[10px] whitespace-nowrap ${
                          enLinea
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-red-300 bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-2 rounded-full ${
                            enLinea ? "bg-emerald-600" : "bg-red-600"
                          }`}
                        />
                        {enLinea ? "En línea" : "Sin conexión"}
                      </span>
                    </div>
                    <span className="mt-3 text-lg break-words font-[family-name:var(--hand)]">
                      {servidor.nombre || `Servidor ${servidor.id}`}
                    </span>
                    <span className="mt-1 text-[11px] text-neutral-600">
                      {servidor.latenciaMs == null
                        ? "Latencia —"
                        : `Latencia ${servidor.latenciaMs} ms`}{" "}
                      · verificado {horaVerificacion(servidor.verificadoEn)}
                    </span>
                    <span className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-neutral-200 pt-3 text-[11px] text-neutral-600">
                      <span>
                        ID servidor{" "}
                        <strong className="font-mono text-[#333]">
                          {servidor.id}
                        </strong>
                      </span>
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
