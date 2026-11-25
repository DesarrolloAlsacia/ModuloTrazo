export function Titulo({ nombre, descripcion }) {
  return (
    <div className="mb-7 flex items-center justify-between">
      <div>
        <div className="text-[9px] tracking-[1.6px] text-[#777]">TRAZO / VISTA PRELIMINAR</div>
        <h1 className="mb-2 mt-[7px] text-[30px] leading-[1.4] max-[650px]:text-[25px]">{nombre}</h1>
        <p className="m-0 text-xs leading-[1.8] text-[#666]">{descripcion}</p>
      </div>
    </div>
  )
}
