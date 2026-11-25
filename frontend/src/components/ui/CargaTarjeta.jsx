import TrazoAnimado from "./TrazoAnimado.jsx"

export default function CargaTarjeta({
  mensaje = "Cargando impresora…",
  className = "",
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={mensaje}
      className={[
        "grid place-items-center rounded-[3px_7px_4px_9px] border-2! border-[#333]! bg-[#f5f3e8] p-4 shadow-[2px_2px_0_#333]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative grid size-28 place-items-center rounded-[10px_6px_12px_7px] border-2 border-[#333] bg-[#f5f3e8] shadow-[3px_3px_0_#999]">
          <div className="absolute size-20 animate-spin rounded-full border-[4px] border-[#d6d6cf] border-t-[#333] motion-reduce:animate-none" />
          <TrazoAnimado className="relative z-1 size-14" />
        </div>
        <p className="text-center font-[family-name:var(--hand)] text-[11px] tracking-[1px] text-[#555]">
          {mensaje}
        </p>
      </div>
    </div>
  )
}
