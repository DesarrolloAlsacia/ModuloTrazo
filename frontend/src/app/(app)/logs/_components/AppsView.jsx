import Link from "next/link"
import { Titulo } from "../../../../components/ui/Titulo.jsx"
import { Vacio } from "../../../../components/ui/Vacio.jsx"

export default function AppsView({ apps, cargando, error }) {
  return (
    <>
      <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#999] px-6 py-[21px]">
          <h2 className="m-0 text-xl">Apps disponibles</h2>
          <p className="m-0 text-[11px] text-[#777]">
            {cargando ? "Consultando TZ_APP…" : `${apps.length} apps en TZ_APP`}
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
            Cargando aplicaciones…
          </p>
        ) : apps.length === 0 ? (
          <Vacio
            glyph="box"
            nombre="Sin aplicaciones"
            descripcion="No hay registros disponibles en TZ_APP."
          />
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5 p-5">
            {apps.map((app) => (
              <li key={app.id} className="min-w-0">
                <Link
                  className="flex h-full flex-col rounded-[3px_7px_4px_9px] border-2! border-[#333]! bg-[#f5f5f1] p-4 shadow-[2px_2px_0_#333] transition-[transform,box-shadow,background] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-[3px_4px_0_#333]"
                  href={"/logs?app=" + encodeURIComponent(app.id)}
                >
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
                  <span className="mt-3 text-lg break-words font-[family-name:var(--hand)]">
                    {app.nombre || `App ${app.id}`}
                  </span>
                  <span className="mt-1 text-xs break-words text-neutral-600">
                    Servidor: {app.server || "—"}
                  </span>
                  <span className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-neutral-200 pt-3 text-[11px] text-neutral-600">
                    <span>
                      ID app{" "}
                      <strong className="font-mono text-[#333]">
                        {app.id}
                      </strong>
                    </span>
                  </span>
                  <span className="mt-4 flex items-center justify-between font-[family-name:var(--hand)] text-xs">
                    Ver logs <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
