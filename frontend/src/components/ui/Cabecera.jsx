export function Cabecera({ nombre, descripcion }) {
  return (
    <div className="border-b border-dashed border-[#999] px-6 py-[21px]">
      <div>
        <h2 className="m-0 text-xl">{nombre}</h2>
        <p className="mb-0 mt-[6px] text-[11px] text-[#777]">{descripcion}</p>
      </div>
    </div>
  )
}
