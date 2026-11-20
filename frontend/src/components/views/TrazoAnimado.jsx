import { useEffect, useState } from "react"
import { trazoAnimadoUrl } from "../../lib/branding.js"

const CICLO_MS = 8000

export default function TrazoAnimado({ className = "" }) {
  const [ciclo, setCiclo] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const intervalo = setInterval(() => setCiclo((numero) => numero + 1), CICLO_MS)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className={["relative inline-block", className].filter(Boolean).join(" ")} aria-hidden="true">
      <span key={ciclo} className="pointer-events-none absolute inset-0 block overflow-hidden mix-blend-multiply">
        <img src={trazoAnimadoUrl} alt="" className="absolute left-[-50%] top-[-46.94%] h-[153.06%] w-[204.08%] max-w-none [filter:grayscale(1)_brightness(1.0845)]" />
      </span>
    </div>
  )
}
