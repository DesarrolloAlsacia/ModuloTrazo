import Icon from '../Icon.jsx';
import {mascotUrl} from '../branding.js';


const menu = [
    ['dashboard', 'grid', 'Vista general'],
    ['servidores', 'server', 'Servidores'],
    ['interfaces', 'layers', 'Interfaces'],
    ['impresoras', 'server', 'Impresoras'],
    ['despliegues', 'rocket', 'Despliegues'],
    ['alertas', 'bell', 'Alertas']
];

export function Layout({children, ruta, usuario, cerrarSesion}) {
    const nombre = usuario?.nombre || 'Usuario';
    const titulo = menu.find(item => item[0] === ruta)?.[2] || 'Vista general';
    return <><div className="tz-app">
        <aside className="tz-side">
            <a className="tz-logo" href="#/dashboard"><span className="tz-logomark"><img className="tz-mascot" src={mascotUrl} alt="" width="64" height="64" /></span><span className="tz-wordmark"><b>Trazo</b><small>.</small></span></a>
            <div className="tz-nav-label">CENTRO DE OPERACIONES</div>
            <nav className="tz-nav" aria-label="Navegación principal">{menu.map(([id, glyph, texto]) => <a key={id} className={id === ruta ? "tz-menu-link active" : "tz-menu-link"} href={"#/" + id} aria-label={texto} title={texto}><Icon name={glyph} /><span>{texto}</span></a>)}</nav>
            <div className="tz-side-bottom"><div className="tz-side-card"><strong>Interfaz en desarrollo</strong><p>Por ahora: login y navegación.</p></div><div className="tz-user"><div className="tz-avatar">TR</div><div>{nombre}<small>Sesión iniciada</small></div></div></div>
        </aside>
        <main className="tz-main">
            <header className="tz-top"><div className="tz-crumb">Trazo <span>/</span><strong>{titulo}</strong></div><div className="tz-session-controls"><span className="tz-session-name">{nombre}</span><button className="tz-btn small" onClick={() => cerrarSesion()}>Cerrar sesión</button></div></header>
            <div className="tz-content"><div className="tz-page-enter">{children}</div><footer className="tz-footer"><span>Trazo · Centro de operaciones</span><span>Vistas preliminares · Funcionalidades pendientes</span></footer></div>
        </main>
    </div></>;
}
