import {Titulo, Cabecera, Vacio} from './components.jsx';
export function Despliegues() {
    return <><Titulo nombre={'Despliegues'} descripcion={'Espacio para las futuras versiones de tus interfaces.'} /><section className="tz-panel"><Cabecera nombre={'Versiones y paquetes'} descripcion={'Subida y despliegue pendientes'} /><Vacio glyph={'box'} nombre={'Esta funcionalidad aún no está disponible'} descripcion={'Aquí podremos cargar paquetes y revisar sus versiones cuando implementemos ese proceso.'} /></section></>;
}
