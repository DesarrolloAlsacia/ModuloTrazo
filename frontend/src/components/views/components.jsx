import Icon from "../Icon.jsx"

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

export function Vacio({ glyph, nombre, descripcion }) {
  return (
    <div className="px-[25px] py-[38px] text-center text-[11px] leading-[1.9] text-[#777]">
      <Icon name={glyph} className="mx-auto mb-[15px] h-[30px] w-[30px] -rotate-7" />
      <strong className="block font-[family-name:var(--hand)] text-sm text-[#333]">{nombre}</strong>
      <p className="mx-auto mt-[10px] max-w-[350px]">{descripcion}</p>
    </div>
  )
}
