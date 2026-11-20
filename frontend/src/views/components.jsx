import Icon from '../Icon.jsx';

export function Titulo({nombre, descripcion}) {
    return <div className="tz-title-row"><div>
        <div className="tz-eyebrow">TRAZO / VISTA PRELIMINAR</div>
        <h1>{nombre}</h1><p className="tz-subtitle">{descripcion}</p>
    </div></div>;
}

export function Cabecera({nombre, descripcion}) {
    return <div className="tz-panel-head"><div><h2>{nombre}</h2><p>{descripcion}</p></div></div>;
}

export function Vacio({glyph, nombre, descripcion}) {
    return <div className="tz-empty"><Icon name={glyph} /><strong>{nombre}</strong><p>{descripcion}</p></div>;
}
