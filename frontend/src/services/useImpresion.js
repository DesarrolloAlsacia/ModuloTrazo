import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';

const eventos = [
    'trabajo:encolado', 'trabajo:enviando', 'trabajo:enviado',
    'trabajo:papel', 'trabajo:terminado', 'trabajo:error'
];

export function useImpresion(activa) {
    const [conexion, setConexion] = useState('Conectando…');
    const [trabajos, setTrabajos] = useState([]);
    const [colas, setColas] = useState([]);
    const [estadosEnVivo, setEstadosEnVivo] = useState({});
    const [reconexion, setReconexion] = useState(0);

    useEffect(() => {
        if (!activa) return;
        setConexion('Conectando…');
        setTrabajos([]);
        setColas([]);
        setEstadosEnVivo({});
        const url = process.env.NEXT_PUBLIC_IMPRESION_URL || 'http://172.16.21.150:3000/impresion';

        const socket = io(url, {autoConnect: false});
        let actualizacion;
        function solicitarSnapshot() {
            if (actualizacion) return;
            actualizacion = setTimeout(() => {
                actualizacion = undefined;
                if (socket.connected) socket.emit('impresion:solicitar');
            }, 150);
        }
        socket.on('connect', () => {
            setConexion('En vivo');
            setEstadosEnVivo({});
            setReconexion(numero => numero + 1);
            socket.emit('impresion:solicitar');
        });
        socket.on('impresora:estado', ({codigo, activa} = {}) => {
            if (codigo == null || typeof activa !== 'boolean') return;
            setEstadosEnVivo(estados => ({...estados, [String(codigo)]: {activa}}));
            solicitarSnapshot();
        });
        socket.on('disconnect', () => setConexion('Desconectado · última lectura'));
        socket.on('connect_error', () => setConexion('Sin conexión · reintentando'));
        socket.on('impresion:snapshot', datos => {
            console.log('[Impresión] snapshot', datos);
            setColas(Array.isArray(datos.colas) ? datos.colas : []);
            const estadosIniciales = Object.fromEntries((datos.impresoras || [])
                .filter(({codigo, code, activa}) => (codigo ?? code) != null && typeof activa === 'boolean')
                .map(({codigo, code, activa}) => [String(codigo ?? code), {activa}]));
            setEstadosEnVivo(estados => ({...estadosIniciales, ...estados}));
            setTrabajos(lista => (datos.trabajos || []).map(trabajo => ({
                ...trabajo,
                etapas: lista.find(item => item.id === trabajo.id)?.etapas || []
            })));
        });
        for (const evento of eventos) {
            socket.on(evento, ({trabajo, error, tiempos, envioMs, papelMs, paginasDetectadas, timestamp}) => {
                solicitarSnapshot();
                if (!trabajo?.id) return;
                setTrabajos(lista => {
                    const anterior = lista.find(item => item.id === trabajo.id);
                    const estado = evento.split(':')[1];
                    const fecha = timestamp || trabajo.actualizadoEn;
                    const etapas = (anterior?.etapas || []).filter(etapa =>
                        etapa.estado !== estado || etapa.fecha !== fecha
                    );
                    const actualizado = {
                        ...anterior, ...trabajo,
                        estado,
                        etapas: [...etapas, {estado, fecha}].slice(-30),
                        error: error ?? trabajo.error ?? anterior?.error,
                        tiempos: tiempos ?? trabajo.tiempos ?? anterior?.tiempos,
                        envioMs: envioMs ?? trabajo.envioMs ?? anterior?.envioMs,
                        papelMs: papelMs ?? trabajo.papelMs ?? anterior?.papelMs,
                        paginasDetectadas: paginasDetectadas ?? trabajo.paginasDetectadas ?? anterior?.paginasDetectadas
                    };
                    return [actualizado, ...lista.filter(item => item.id !== trabajo.id)].slice(0, 200);
                });
            });
        }
        socket.connect();
        return () => {
            clearTimeout(actualizacion);
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [activa]);

    return {conexion, trabajos, colas, estadosEnVivo, reconexion};
}
