import {Dashboard as dashboard} from './views/DashboardView.jsx';
import {Servidores as servidores} from './views/ServidoresView.jsx';
import {Interfaces as interfaces} from './views/InterfacesView.jsx';
import {Despliegues as despliegues} from './views/DesplieguesView.jsx';
import {Alertas as alertas} from './views/AlertasView.jsx';
import {Impresoras as impresoras} from './views/ImpresorasView.jsx';

export const routes = { dashboard, servidores, interfaces, despliegues, alertas, impresoras };
