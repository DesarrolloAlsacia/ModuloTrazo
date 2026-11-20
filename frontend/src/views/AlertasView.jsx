import {Titulo, Cabecera, Vacio} from './components.jsx';
export function Alertas() {
    return <><Titulo nombre={'Alertas'} descripcion={'Aquí se mostrarán los avisos de las interfaces.'} /><section className="tz-panel"><Cabecera nombre={'Centro de alertas'} descripcion={'Monitoreo pendiente de conectar'} /><Vacio glyph={'bell'} nombre={'Sin monitoreo activo'} descripcion={'Las reglas de error y las notificaciones se definirán más adelante.'} /></section></>;
}
