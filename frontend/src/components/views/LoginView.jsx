import { useState } from "react"
import { mascotUrl } from "../../lib/branding.js"
import Icon from "../Icon.jsx"
import { login } from "../../lib/services/login.service.js"

export default function LoginView({ mensaje, onAuthenticated }) {
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  async function enviar(event) {
    event.preventDefault()
    const form = event.currentTarget
    const valores = new FormData(form)
    setError("")
    setCargando(true)
    try {
      await login(valores.get("usuario").trim(), valores.get("password").trim())
      await onAuthenticated()
    } catch (error) {
      setError(error.message)
      form.elements.password.value = ""
      form.elements.password.focus()
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-[1.1fr_1fr] max-[800px]:grid-cols-1">
      <section className="relative flex flex-col items-start justify-center border-r border-dashed border-[#999] px-[clamp(35px,7vw,100px)] py-10 max-[800px]:hidden" aria-hidden="true">
        <div className="absolute left-10 top-[30px] flex items-center gap-2 font-[family-name:var(--hand)] text-[35px] font-bold">
          <img className="h-12 w-12" src={mascotUrl} alt="" />
          <span>Trazo</span>
        </div>
        <img className="mx-auto mb-[10px] mt-[45px] block h-[285px] w-[310px] max-w-[90%] animate-[paperFloat_5s_ease-in-out_infinite] self-center object-contain mix-blend-darken" src={mascotUrl} alt="" />
      </section>
      <section className="flex flex-col items-center justify-center px-6 py-10 max-[800px]:min-h-screen">
        <div className="relative w-full max-w-[410px] rounded-[6px_14px_5px_9px] border-2 border-[#333] bg-[#f4f4ef] px-8 py-[38px] shadow-[5px_5px_0_#777] before:absolute before:left-[40%] before:top-[-12px] before:h-[23px] before:w-[65px] before:-rotate-5 before:border-x before:border-dashed before:border-[#aaa] before:bg-[#d2d0c9a8] before:content-[''] max-[650px]:px-[25px] max-[650px]:py-8">
          <div className="text-[9px] tracking-[2px] text-[#777]">HOLA, ESTÁS EN TRAZO</div>
          <h1 className="mb-[10px] mt-[15px] text-[26px] leading-[1.4] max-[650px]:text-[25px]">Qué bueno verte.</h1>
          <p className="mb-7 mt-0 text-xs text-[#777]">Inicia sesión y seguimos desde aquí.</p>
          <form onSubmit={enviar}>
            <label className="mb-[9px] mt-[21px] block font-[family-name:var(--hand)] text-xs" htmlFor="login-user">Tu usuario</label>
            <div className="flex items-center gap-[10px] rounded-[4px_6px_3px_5px] border-[1.5px] border-[#666] bg-[#fbfbf8] px-3 focus-within:border-[#222] focus-within:shadow-[1px_2px_0_#888]">
              <Icon name="user" className="h-4 w-4 text-[#666]" />
              <input
                className="min-w-0 w-full border-0 bg-transparent px-0 py-[13px] text-sm text-[#222] outline-none!"
                id="login-user"
                name="usuario"
                autoComplete="username"
                maxLength={128}
                required
                spellCheck={false}
                autoCapitalize="none"
                autoFocus
              />
            </div>
            <label className="mb-[9px] mt-[21px] block font-[family-name:var(--hand)] text-xs" htmlFor="login-password">Tu contraseña</label>
            <div className="flex items-center gap-[10px] rounded-[4px_6px_3px_5px] border-[1.5px] border-[#666] bg-[#fbfbf8] px-3 focus-within:border-[#222] focus-within:shadow-[1px_2px_0_#888]">
              <Icon name="shield" className="h-4 w-4 text-[#666]" />
              <input
                className="min-w-0 w-full border-0 bg-transparent px-0 py-[13px] text-sm text-[#222] outline-none!"
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                maxLength={512}
                required
              />
            </div>
            <p className="my-[15px] min-h-5 text-xs leading-[1.8] text-[#8e3026]" role="alert">
              {error ?? mensaje}
            </p>
            <button
              className="inline-flex items-center justify-center gap-[9px] rounded-[3px_6px_3px_5px] border-[1.7px] border-[#252525] bg-[#f8f8f3] px-[15px] py-[10px] font-[family-name:var(--hand)] text-xs text-[#222] shadow-[2px_2px_0_#252525] transition-[background,transform,box-shadow] duration-[180ms] hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#252525] [&_svg]:h-4 [&_svg]:w-4 bg-[#282828]! text-[#fafafa] min-h-[45px] w-full justify-between! aria-busy:after:animate-[pencilBlink_1s_steps(2)_infinite] aria-busy:after:content-['…'] aria-busy:after:text-xl aria-busy:[&>svg]:hidden"
              type="submit"
              disabled={cargando}
              aria-busy={cargando}
            >
              <span>{cargando ? "Un momento" : "Entrar a Trazo"}</span>
              {!cargando && <Icon name="arrow" />}
            </button>
            <p className="mt-[23px] flex items-center justify-center gap-[6px] text-[10px] text-[#777]">
              <Icon name="shield" className="h-[13px] w-[13px]" />
              Con tu usuario corporativo de siempre.
            </p>
          </form>
        </div>
        <footer className="mt-[30px] font-[family-name:var(--hand)] text-[11px] text-[#777]">
          Hecho para conectar los puntos. ✳
        </footer>
      </section>
    </main>
  )
}
