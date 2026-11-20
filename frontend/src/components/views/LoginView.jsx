import { useState } from 'react';
import { mascotUrl } from '../branding.js';
import Icon from '../Icon.jsx';
import { login } from '../services/login.service.js';

export default function LoginView({ mensaje, onAuthenticated }) {
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    async function enviar(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const valores = new FormData(form);
        setError('');
        setCargando(true);
        try {
            await login(valores.get('usuario').trim(), valores.get('password').trim());
            await onAuthenticated();
        } catch (error) {
            setError(error.message);
            form.elements.password.value = '';
            form.elements.password.focus();
        } finally {
            setCargando(false);
        }
    }

    return <main className="trazo-login">
        <section className="trazo-login-story" aria-hidden="true">
            <div className="trazo-login-logo"><img className="tz-mascot" src={mascotUrl} alt="" /><span>Trazo</span></div>
            <img className="login-character" src={mascotUrl} alt="" />
        </section>
        <section className="trazo-login-panel">
            <div className="login-card">
                <div className="login-eyebrow">HOLA, ESTÁS EN TRAZO</div>
                <h1>Qué bueno verte.</h1>
                <p className="login-subtitle">Inicia sesión y seguimos desde aquí.</p>
                <form onSubmit={enviar}>
                    <label htmlFor="login-user">Tu usuario</label>
                    <div className="login-input"><Icon name="user" /><input id="login-user" name="usuario" autoComplete="username" maxLength={128} required spellCheck={false} autoCapitalize="none" autoFocus /></div>
                    <label htmlFor="login-password">Tu contraseña</label>
                    <div className="login-input"><Icon name="shield" /><input id="login-password" name="password" type="password" autoComplete="current-password" maxLength={512} required /></div>
                    <p className="login-error" role="alert">{error ?? mensaje}</p>
                    <button className="tz-btn red login-submit" type="submit" disabled={cargando} aria-busy={cargando}>
                        <span>{cargando ? 'Un momento' : 'Entrar a Trazo'}</span>{!cargando && <Icon name="arrow" />}
                    </button>
                    <p className="login-access-note"><Icon name="shield" />Con tu usuario corporativo de siempre.</p>
                </form>
            </div>
            <footer className="login-footer">Hecho para conectar los puntos. ✳</footer>
        </section>
    </main>;
}
