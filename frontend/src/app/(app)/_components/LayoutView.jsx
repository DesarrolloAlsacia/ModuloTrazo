import Link from "next/link"
import Icon from "../../../components/ui/Icon.jsx"
import { mascotUrl } from "../../../lib/branding.js"

const menu = [
  ["dashboard", "grid", "Vista general"],
  ["servidores", "server", "Servidores"],
  ["interfaces", "layers", "Interfaces"],
  ["impresoras", "server", "Impresoras"],
  ["despliegues", "rocket", "Despliegues"],
  ["alertas", "bell", "Alertas"],
  ["logs", "terminal", "Logs"],
]

export function Layout({ children, ruta, usuario, cerrarSesion }) {
  const nombre = usuario?.nombre || "Usuario"
  const titulo = menu.find((item) => item[0] === ruta)?.[2] || "Vista general"
  return (
    <>
      <div className="grid min-h-screen grid-cols-[240px_minmax(0,1fr)] min-[651px]:max-[950px]:grid-cols-[78px_minmax(0,1fr)] max-[650px]:block">
        <aside className="sticky top-0 flex h-screen flex-col border-r-2 border-[#333] bg-[#e7e7e7] px-5 pb-[22px] pt-[35px] min-[651px]:max-[950px]:px-[10px] min-[651px]:max-[950px]:py-[22px] max-[650px]:top-0 max-[650px]:z-10 max-[650px]:h-16 max-[650px]:flex-row max-[650px]:items-center max-[650px]:justify-between max-[650px]:border-r-0 max-[650px]:border-b-2 max-[650px]:border-b-[#555] max-[650px]:px-[15px] max-[650px]:py-[9px]">
          <Link
            className="flex items-center gap-[10px] min-[651px]:max-[950px]:justify-center max-[650px]:gap-1"
            href="/dashboard"
          >
            <span>
              <img
                className="block h-[53px] w-[53px] object-contain mix-blend-darken min-[651px]:max-[950px]:h-11 min-[651px]:max-[950px]:w-11 max-[650px]:h-[38px] max-[650px]:w-[35px]"
                src={mascotUrl}
                alt=""
                width="64"
                height="64"
              />
            </span>
            <span className="font-[family-name:var(--hand)] text-[32px] font-bold tracking-[-1.2px] min-[651px]:max-[950px]:hidden max-[650px]:text-[23px]">
              <b>Trazo</b>
              <small className="text-[34px] max-[650px]:text-[23px]">.</small>
            </span>
          </Link>
          <div className="mb-[18px] mt-[44px] font-[family-name:var(--hand)] text-[10px] tracking-[1px] text-[#666] min-[651px]:max-[950px]:hidden max-[650px]:hidden">
            CENTRO DE OPERACIONES
          </div>
          <nav
            className="flex flex-col gap-[13px] min-[651px]:max-[950px]:mt-[35px] max-[650px]:flex-row max-[650px]:gap-1.5"
            aria-label="Navegación principal"
          >
            {menu.map(([id, glyph, texto]) => (
              <Link
                key={id}
                className={
                  "ml-1 relative flex items-center gap-3 border-[1.5px] border-transparent px-3 py-[11px] font-[family-name:var(--hand)] text-sm hover:bg-[#ffffff55] min-[651px]:max-[950px]:justify-center min-[651px]:max-[950px]:px-2 min-[651px]:max-[950px]:py-3 max-[650px]:p-[7px] before:absolute before:left-[-20px] before:top-[5px] before:text-[23px] before:content-['↳'] min-[651px]:max-[950px]:before:hidden max-[650px]:before:hidden max-[650px]:[&_svg]:h-4 max-[650px]:[&_svg]:w-4" +
                  (id === ruta
                    ? " rounded-[3px_7px_4px_9px] border-2! border-[#333]! bg-[#f5f5f1] shadow-[2px_2px_0_#333] -rotate-1"
                    : "")
                }
                href={"/" + id}
                aria-label={texto}
                title={texto}
              >
                <Icon name={glyph} />
                <span className="min-[651px]:max-[950px]:hidden max-[650px]:hidden">
                  {texto}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto max-[650px]:hidden">
            <div className="mt-[35px] rounded-[3px_8px_5px_6px] border-[1.5px] border-dashed border-[#777] p-[13px] text-[11px] leading-[1.8] min-[651px]:max-[950px]:hidden max-[650px]:hidden">
              <strong className="font-[family-name:var(--hand)] text-xs">
                Interfaz en desarrollo
              </strong>
              <p className="my-[5px] text-[#666]">
                Por ahora: login y navegación.
              </p>
            </div>
            <div className="mt-[25px] flex items-center gap-[10px] text-xs min-[651px]:max-[950px]:justify-center max-[650px]:justify-center">
              <div className="grid h-8 w-8 place-items-center rounded-[50%_44%_48%_41%] border-[1.5px] border-[#333] bg-[#f5f5f1] font-[family-name:var(--hand)] text-[11px]">
                TR
              </div>
              <div className="min-[651px]:max-[950px]:hidden">
                {nombre}
                <small className="mt-[3px] block text-[10px] text-[#666]">
                  Sesión iniciada
                </small>
              </div>
            </div>
          </div>
        </aside>
        <main className="min-w-0">
          <header className="flex h-[78px] items-center justify-between gap-4 border-b-[1.5px] border-b-[#888] px-[38px] max-[650px]:h-[65px] max-[650px]:px-5">
            <div className="flex gap-3 text-xs text-[#666] max-[650px]:gap-2 max-[650px]:text-[10px]">
              Trazo <span>/</span>
              <strong className="font-[family-name:var(--hand)] text-[13px] text-[#333] max-[650px]:text-[11px]">
                {titulo}
              </strong>
            </div>
            <div className="flex items-center gap-[14px]">
              <span className="max-w-[150px] truncate text-[11px] max-[800px]:hidden">
                {nombre}
              </span>
              <button
                className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 px-[11px]! py-[7px]! text-[10px] shadow-[1px_2px_0_#444]! hover:shadow-[1px_2px_0_#444]!"
                onClick={() => cerrarSesion()}
              >
                Cerrar sesión
              </button>
            </div>
          </header>
          <div className="mx-auto max-w-[1440px] px-[38px] pb-[25px] pt-[35px] min-[651px]:max-[950px]:p-[27px] max-[650px]:px-[18px] max-[650px]:py-[25px]">
            <div className="animate-[pageIn_.35s_ease-out]">{children}</div>
            <footer className="mt-[35px] flex justify-between gap-[15px] border-t border-dashed border-t-[#999] pt-[21px] text-[10px] text-[#777] max-[650px]:flex-col max-[650px]:leading-[1.7]">
              <span>Trazo · Centro de operaciones</span>
              <span>Vistas preliminares · Funcionalidades pendientes</span>
            </footer>
          </div>
        </main>
      </div>
    </>
  )
}
