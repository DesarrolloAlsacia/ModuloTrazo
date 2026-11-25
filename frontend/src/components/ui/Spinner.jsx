export default function Spinner({
  className = "size-3.5",
  etiqueta = "Cargando",
}) {
  return (
    <span
      role="status"
      aria-label={etiqueta}
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-[#d6d6cf] border-t-[#333] motion-reduce:animate-none ${className}`}
    />
  )
}
