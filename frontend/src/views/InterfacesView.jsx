import {Titulo, Cabecera, Vacio} from './components.jsx';
export function Interfaces() {
    return <><Titulo nombre={'Interfaces'} descripcion={'Listado de interfaces por servidor.'} /><section className="tz-panel"><Cabecera nombre={'Listado de interfaces'} descripcion={'Vista preliminar'} /><div className="tz-table-wrap"><table className="tz-table"><thead><tr><th>Interfaz</th><th>Servidor</th><th>Estado</th><th>Versión</th></tr></thead></table></div><Vacio glyph={'layers'} nombre={'El listado está pendiente de conectar'} descripcion={'El registro, la ejecución y los horarios se agregarán después.'} /></section></>;
}
