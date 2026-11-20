export const estados = {
    encolado: 'En cola',
    enviando: 'Enviando a la impresora',
    enviado: 'Enviado a la impresora',
    papel: 'Salida de papel detectada',
    terminado: 'Impresión terminada',
    error: 'Error de impresión'
};

function hora(fecha) {
    const valor = new Date(fecha);
    return fecha && Number.isFinite(valor.getTime()) ? valor.toLocaleTimeString('es-CL') : '';
}

function LineaDeTiempo({trabajo}) {
    const etapas = trabajo.etapas?.length
        ? trabajo.etapas
        : [{estado: trabajo.estado, fecha: trabajo.actualizadoEn}];

    return <div className="mt-3">
        <h3>Progreso del trabajo</h3>
        {!trabajo.etapas?.length && <p className="text-sm">Último estado informado por el asistente.</p>}
        <ol className="mt-2 border-l pl-4">
            {etapas.map(({estado, fecha}, indice) => <li key={indice} className="py-1">
                <strong>{estados[estado] || estado || 'Sin estado'}</strong>
                {hora(fecha) && <time className="ml-3 text-sm" dateTime={fecha}>{hora(fecha)}</time>}
            </li>)}
        </ol>
    </div>;
}

export default function TrabajosView({impresora, conexion, trabajos}) {
    const normalizar = valor => String(valor ?? '').trim().toLowerCase();
    const identificadores = impresora ? Object.values(impresora).map(normalizar).filter(Boolean) : [];
    const visibles = impresora ? trabajos.filter(trabajo => identificadores.includes(normalizar(trabajo.impresora))) : trabajos;
    const enCurso = visibles.filter(item => !['terminado', 'error'].includes(item.estado)).length;

    return <section className="tz-panel">
        <div className="tz-panel-head">
            {impresora ? <>
                <a className="tz-btn small mb-4" href="#/impresoras">Volver a Impresoras</a>
                <h1>Trabajos de {impresora.codigo}</h1>
            </> : <h2>Actividad en vivo</h2>}
            <p role="status">{conexion}</p>
        </div>
        <div className="p-4">
            <p className="mb-4">{enCurso} en curso · {visibles.length} trabajos recientes</p>
            {visibles.length === 0 && <p>{impresora ? 'No hay trabajos recientes vinculados a esta impresora.' : 'Todavía no se han recibido trabajos.'}</p>}
            {visibles.map(trabajo => <details key={trabajo.id} className="border-t p-3">
                <summary className="cursor-pointer">{trabajo.documento || trabajo.id} · {trabajo.impresora || '—'} · {estados[trabajo.estado] || trabajo.estado}</summary>
                <LineaDeTiempo trabajo={trabajo} />
                <dl className="mt-2 text-sm">
                    <dt>Tipo</dt><dd>{trabajo.tipo ?? '—'}</dd>
                    <dt>Páginas esperadas</dt><dd>{trabajo.paginas ?? '—'}</dd>
                    <dt>Páginas detectadas</dt><dd>{trabajo.paginasDetectadas ?? '—'}</dd>
                    <dt>Tiempo de envío</dt><dd>{trabajo.envioMs == null ? '—' : trabajo.envioMs + ' ms'}</dd>
                    <dt>Tiempo total</dt><dd>{trabajo.tiempos?.totalMs == null ? '—' : trabajo.tiempos.totalMs + ' ms'}</dd>
                    {trabajo.error && <><dt>Error</dt><dd>{trabajo.error}</dd></>}
                </dl>
            </details>)}
        </div>
    </section>;
}
