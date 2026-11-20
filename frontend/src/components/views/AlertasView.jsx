import { Titulo, Cabecera, Vacio } from "./components.jsx"
export function Alertas() {
  return (
    <>
      <Titulo
        nombre={"Alertas"}
        descripcion={"Aquí se mostrarán los avisos de las interfaces."}
      />
      <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]">
        <Cabecera
          nombre={"Centro de alertas"}
          descripcion={"Monitoreo pendiente de conectar"}
        />
        <Vacio
          glyph={"bell"}
          nombre={"Sin monitoreo activo"}
          descripcion={
            "Las reglas de error y las notificaciones se definirán más adelante."
          }
        />
      </section>
    </>
  )
}
