import { Titulo, Cabecera, Vacio } from "./components.jsx"
export function Interfaces() {
  return (
    <>
      <Titulo
        nombre={"Interfaces"}
        descripcion={"Listado de interfaces por servidor."}
      />
      <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]">
        <Cabecera
          nombre={"Listado de interfaces"}
          descripcion={"Vista preliminar"}
        />
        <div>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="border-b border-dashed border-[#aaa] px-[22px] py-[15px] font-[family-name:var(--hand)] text-[11px] text-[#666]">Interfaz</th>
                <th className="border-b border-dashed border-[#aaa] px-[22px] py-[15px] font-[family-name:var(--hand)] text-[11px] text-[#666]">Servidor</th>
                <th className="border-b border-dashed border-[#aaa] px-[22px] py-[15px] font-[family-name:var(--hand)] text-[11px] text-[#666]">Estado</th>
                <th className="border-b border-dashed border-[#aaa] px-[22px] py-[15px] font-[family-name:var(--hand)] text-[11px] text-[#666]">Versión</th>
              </tr>
            </thead>
          </table>
        </div>
        <Vacio
          glyph={"layers"}
          nombre={"El listado está pendiente de conectar"}
          descripcion={
            "El registro, la ejecución y los horarios se agregarán después."
          }
        />
      </section>
    </>
  )
}
