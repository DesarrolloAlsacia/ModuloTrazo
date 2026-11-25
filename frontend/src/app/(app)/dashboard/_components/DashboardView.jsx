import Icon from "../../../../components/ui/Icon.jsx"
import { Titulo } from "../../../../components/ui/Titulo.jsx"
import { Cabecera } from "../../../../components/ui/Cabecera.jsx"
import { Vacio } from "../../../../components/ui/Vacio.jsx"
import TrazoAnimado from "../../../../components/ui/TrazoAnimado.jsx"

export function Dashboard() {
  const indicadores = [
    ["Interfaces", "layers"],
    ["En ejecución", "activity"],
    ["Alertas", "bell"],
    ["Ejecuciones correctas", "check"],
  ]
  return (
    <>
      <Titulo
        nombre={"Centro de operaciones"}
        descripcion={"Una vista central para tus servidores e interfaces."}
      />
      <section className="relative mb-7 flex min-h-[290px] items-center overflow-hidden rounded-[5px_12px_6px_9px] border-2 border-[#333] bg-[#e7e7e7] px-9 py-[35px] shadow-[3px_4px_0_#999] after:pointer-events-none after:absolute after:inset-1 after:rounded-[6px_8px_3px_11px] after:border after:border-[#999] after:content-[''] max-[650px]:min-h-[330px] max-[650px]:items-start max-[650px]:px-[23px] max-[650px]:py-[26px]">
        <div className="relative z-1 max-w-[60%] max-[800px]:max-w-[65%] max-[650px]:max-w-[90%]">
          <div className="flex items-center gap-[7px] text-[9px] tracking-[2px] text-[#666]">
            <span className="inline-block h-[5px] w-[5px] rounded-full bg-current"></span> IDEAS QUE SE CONECTAN
          </div>
          <h2 className="mb-[10px] mt-4 text-[44px] leading-[1.3] max-[1100px]:text-[36px] max-[650px]:text-[33px]">Vamos trazando.</h2>
          <p className="m-0 text-xs leading-[1.9] text-[#555] max-[650px]:max-w-[230px]">
            Un lugar para darle forma a tus interfaces.
            <br />
            Un paso, una conexión, un trazo a la vez.
          </p>
        </div>
        <TrazoAnimado className="absolute! bottom-[7px] right-[25px] block! h-[270px] w-[270px] max-[1100px]:right-[10px] max-[1100px]:h-[230px] max-[1100px]:w-[220px] max-[800px]:h-[180px] max-[800px]:w-[180px] max-[650px]:bottom-[3px] max-[650px]:right-[2px] max-[650px]:h-[150px] max-[650px]:w-[145px] mb-1 scale-90" />
      </section>
      <div className="mb-[26px] grid grid-cols-4 gap-[17px] max-[1100px]:grid-cols-2 max-[650px]:gap-[13px]">
        {indicadores.map(([nombre, glyph]) => (
          <div key={nombre} className="relative rounded-[6px_3px_7px_4px] border-[1.6px] border-[#444] bg-[#f3f3ef] p-[18px] shadow-[2px_2px_0_#aaa] [&:nth-child(2)]:-rotate-[0.5deg] [&:nth-child(3)]:rotate-[0.5deg] max-[650px]:p-[14px]">
            <div className="flex items-center justify-between gap-[10px] font-[family-name:var(--hand)] text-[11px] [&_svg]:h-[17px] [&_svg]:w-[17px] max-[650px]:text-[10px]">
              <span>{nombre}</span>
              <Icon name={glyph} />
            </div>
            <div className="mb-[7px] mt-3 font-[family-name:var(--hand)] text-[32px]">—</div>
            <div className="text-[10px] text-[#777]">Pendiente de conectar</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1.2fr_1fr] gap-[23px] max-[800px]:grid-cols-1">
        <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]">
          <Cabecera
            nombre={"Interfaces"}
            descripcion={"Aquí aparecerán las integraciones"}
          />
          <Vacio
            glyph={"layers"}
            nombre={"Sin datos conectados"}
            descripcion={
              "El registro y monitoreo de interfaces se desarrollará después."
            }
          />
        </section>
        <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]">
          <Cabecera
            nombre={"Infraestructura"}
            descripcion={"Servidores y entorno"}
          />
          <Vacio
            glyph={"server"}
            nombre={"Conexión pendiente"}
            descripcion={"Esta vista todavía no se conecta a ningún servidor."}
          />
        </section>
      </div>
      <section className="overflow-hidden rounded-[5px_8px_4px_6px] border-[1.5px] border-[#555] bg-[#f1f1ee] shadow-[2px_2px_0_#aaa]" style={{ marginTop: 24 }}>
        <Cabecera
          nombre={"Actividad reciente"}
          descripcion={"Historial de operaciones"}
        />
        <Vacio
          glyph={"terminal"}
          nombre={"Sin actividad"}
          descripcion={
            "Las ejecuciones y sus registros se implementarán más adelante."
          }
        />
      </section>
    </>
  )
}
