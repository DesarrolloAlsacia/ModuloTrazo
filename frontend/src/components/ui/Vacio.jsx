import Icon from "./Icon.jsx"

export function Vacio({ glyph, nombre, descripcion }) {
  return (
    <div className="px-[25px] py-[38px] text-center text-[11px] leading-[1.9] text-[#777]">
      <Icon
        name={glyph}
        className="mx-auto mb-[15px] h-[30px] w-[30px] -rotate-7"
      />
      <strong className="block font-[family-name:var(--hand)] text-sm text-[#333]">
        {nombre}
      </strong>
      <p className="mx-auto mt-[10px] max-w-[350px]">{descripcion}</p>
    </div>
  )
}
