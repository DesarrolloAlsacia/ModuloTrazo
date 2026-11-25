import { Titulo } from "../../../../components/ui/Titulo.jsx"
import { Cabecera } from "../../../../components/ui/Cabecera.jsx"
import { Vacio } from "../../../../components/ui/Vacio.jsx"
export function Despliegues() {
  return (
    <>
      <Titulo
        nombre={"Despliegues"}
        descripcion={"Espacio para las futuras versiones de tus interfaces."}
      />
      <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]">
        <Cabecera
          nombre={"Versiones y paquetes"}
          descripcion={"Subida y despliegue pendientes"}
        />
        <Vacio
          glyph={"box"}
          nombre={"Esta funcionalidad aún no está disponible"}
          descripcion={
            "Aquí podremos cargar paquetes y revisar sus versiones cuando implementemos ese proceso."
          }
        />
      </section>
    </>
  )
}
