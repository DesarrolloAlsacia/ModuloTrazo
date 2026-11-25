import TrazoAnimado from "./TrazoAnimado.jsx"

export default function PantallaCarga({ mensaje = "Cargando Trazo…" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={mensaje}
      className="fixed inset-0 z-[100] grid place-items-center bg-[#e7e7e7] px-6"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative grid size-56 place-items-center rounded-[14px_8px_16px_10px] border-2 border-[#333] bg-[#f5f3e8] shadow-[5px_5px_0_#999]">
          <div className="absolute size-40 animate-spin rounded-full border-[5px] border-[#d6d6cf] border-t-[#333] motion-reduce:animate-none" />
          <TrazoAnimado className="relative z-1 size-28" />
        </div>
        <p className="font-[family-name:var(--hand)] text-xs tracking-[1px] text-[#555]">
          {mensaje}
        </p>
      </div>
    </div>
  )
}
