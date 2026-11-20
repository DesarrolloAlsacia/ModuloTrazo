import { Titulo, Cabecera, Vacio } from "./components.jsx"
export function Servidores() {
  return (
    <>
      <Titulo
        nombre={"Servidores"}
        descripcion={"Aquí administraremos los servidores de tus interfaces."}
      />
      <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]">
        <Cabecera
          nombre={"Servidores disponibles"}
          descripcion={"Conexiones pendientes de implementar"}
        />
        <Vacio
          glyph={"server"}
          nombre={"Todavía no hay servidores conectados"}
          descripcion={
            "Primero definiremos cómo registrar y conectar cada equipo."
          }
        />
      </section>
    </>
  )
}
