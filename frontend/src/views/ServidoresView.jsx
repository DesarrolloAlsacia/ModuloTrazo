import {Titulo, Cabecera, Vacio} from './components.jsx';
export function Servidores() {
    return <><Titulo nombre={'Servidores'} descripcion={'Aquí administraremos los servidores de tus interfaces.'} /><section className="tz-panel"><Cabecera nombre={'Servidores disponibles'} descripcion={'Conexiones pendientes de implementar'} /><Vacio glyph={'server'} nombre={'Todavía no hay servidores conectados'} descripcion={'Primero definiremos cómo registrar y conectar cada equipo.'} /></section></>;
}
