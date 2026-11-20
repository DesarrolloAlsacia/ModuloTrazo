'use client';

import { useCallback, useEffect, useState } from 'react';
import LoginView from '../src/views/LoginView.jsx';
import { Layout } from '../src/views/LayoutView.jsx';
import TrabajosView from '../src/views/TrabajosView.jsx';
import { useImpresion } from '../src/services/useImpresion.js';
import { routes } from '../src/routes.js';
import * as sesion from '../src/services/login.service.js';

export default function Home() {
    const [usuario, setUsuario] = useState(undefined);
    const [ruta, setRuta] = useState('dashboard');
    const [impresora, setImpresora] = useState(null);
    const [mensaje, setMensaje] = useState('');

    const cerrarSesion = useCallback((aviso = '') => {
        sesion.cerrarSesion();
        setMensaje(aviso);
        setUsuario(null);
    }, []);

    const validar = useCallback(async () => {
        try {
            if (await sesion.validarSesion()) setUsuario(sesion.obtenerUsuario());
            else cerrarSesion();
        } catch {
            cerrarSesion('No se pudo conectar con Trazo. Revisa que el backend esté iniciado.');
        }
    }, [cerrarSesion]);

    useEffect(() => {
        function leerRuta() {
            const [nombre, consulta] = location.hash.slice(2).split('?');
            const campos = new URLSearchParams(consulta);
            const codigo = campos.get('impresora');
            setImpresora(codigo ? {codigo, idCHK: campos.get('idCHK'), ip: campos.get('ip')} : null);
            setRuta(nombre === 'trabajos' ? (codigo ? nombre : 'impresoras') :
                Object.hasOwn(routes, nombre) ? nombre : 'dashboard');
        }

        leerRuta();
        validar();
        window.addEventListener('hashchange', leerRuta);
        return () => window.removeEventListener('hashchange', leerRuta);
    }, [validar]);

    useEffect(() => {
        if (usuario) window.scrollTo(0, 0);
    }, [ruta, usuario]);

    const sesionVencida = useCallback(() => cerrarSesion('Tu sesión expiró.'), [cerrarSesion]);

    const {conexion, trabajos, colas, estadosEnVivo, reconexion} = useImpresion(Boolean(usuario));

    if (usuario === undefined) return <p role="status">Cargando Trazo…</p>;
    if (!usuario) return <LoginView mensaje={mensaje} onAuthenticated={validar} />;

    const Vista = routes[ruta];
    return <Layout ruta={ruta === 'trabajos' ? 'impresoras' : ruta} usuario={usuario} cerrarSesion={cerrarSesion}>
        {ruta === 'trabajos'
            ? <TrabajosView key={impresora?.codigo} impresora={impresora} conexion={conexion} trabajos={trabajos} />
            : <Vista key={ruta} sesionVencida={sesionVencida} conexion={conexion} trabajos={trabajos}
                colas={colas} estadosEnVivo={estadosEnVivo} reconexion={reconexion} />}
    </Layout>;
}
