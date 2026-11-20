import {mascotUrl} from '../branding.js';
import Icon from '../Icon.jsx';
import {Titulo, Cabecera, Vacio} from './components.jsx';

export function Dashboard() {
    const indicadores = [['Interfaces','layers'],['En ejecución','activity'],['Alertas','bell'],['Ejecuciones correctas','check']];
    return <><Titulo nombre={'Centro de operaciones'} descripcion={'Una vista central para tus servidores e interfaces.'} />
        <section className="tz-hero"><div className="tz-hero-copy"><div className="tz-hero-label"><span className="tz-dot"></span> IDEAS QUE SE CONECTAN</div><h2>Vamos trazando.</h2><p>Un lugar para darle forma a tus interfaces.<br />Un paso, una conexión, un trazo a la vez.</p></div><img className="tz-hero-character" src={mascotUrl} alt="El personaje de Trazo dibujado a mano" /></section>
        <div className="tz-stats">{indicadores.map(([nombre, glyph]) => <div key={nombre} className="tz-stat"><div className="tz-stat-top"><span>{nombre}</span><Icon name={glyph} /></div><div className="tz-stat-value">—</div><div className="tz-stat-bottom">Pendiente de conectar</div></div>)}</div>
        <div className="tz-split"><section className="tz-panel"><Cabecera nombre={'Interfaces'} descripcion={'Aquí aparecerán las integraciones'} /><Vacio glyph={'layers'} nombre={'Sin datos conectados'} descripcion={'El registro y monitoreo de interfaces se desarrollará después.'} /></section><section className="tz-panel"><Cabecera nombre={'Infraestructura'} descripcion={'Servidores y entorno'} /><Vacio glyph={'server'} nombre={'Conexión pendiente'} descripcion={'Esta vista todavía no se conecta a ningún servidor.'} /></section></div>
        <section className="tz-panel" style={{marginTop: 24}}><Cabecera nombre={'Actividad reciente'} descripcion={'Historial de operaciones'} /><Vacio glyph={'terminal'} nombre={'Sin actividad'} descripcion={'Las ejecuciones y sus registros se implementarán más adelante.'} /></section></>;
}
