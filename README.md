# ModuloTrazo
Modulo Trazabilidad Alsacia

## Desarrollo con Docker (hot reload)

Requiere Docker con Compose v2.24 o superior.

```powershell
docker compose -f docker-compose.dev.yml up --build
```

- Frontend: http://localhost:5174 (Next dev, Fast Refresh + polling).
- Backend: http://localhost:5173/api (Express con `nodemon` en modo polling, se reinicia al cambiar `backend/src`).
- Las peticiones `/api/*` del frontend se proxyan al servicio `backend` del compose.

Para abrir el frontend desde otro equipo de la red local usa `http://172.16.21.150:5174`. Docker publica el puerto en `0.0.0.0` y Next acepta ese host en desarrollo mediante `DEV_ALLOWED_ORIGINS` (configurable en el compose). Si el firewall de Windows bloquea el acceso, ejecuta esto en PowerShell **como administrador**:

```powershell
New-NetFirewallRule -DisplayName "Trazo Frontend 5174" -Direction Inbound -Protocol TCP -LocalPort 5174 -Action Allow -Profile Domain,Private
```

El código se monta como bind mount (`./backend` y `./frontend`); `node_modules` y `.next` viven en volúmenes del contenedor, así que los binarios son siempre de Linux. El entrypoint reinstala las dependencias automáticamente cuando cambia `package-lock.json`.

La pantalla de carga de Trazo se mantiene hasta que cada página recibe sus datos reales: snapshot WebSocket de impresión, inventario de impresoras, catálogo y logs, historial de trabajos y servidores. En **Impresoras**, los contadores de pendientes se consultan en segundo plano cada 15 s para no bloquear la vista; el estado activo/inactivo llega con el snapshot WebSocket. El backend cachea `/api/impresoras/estados` durante 15 s e invalida la caché al cambiar estados, y también cachea las IP descifradas del inventario. Mientras llegan los pendientes por primera vez, cada tarjeta muestra un loader que ocupa toda la card, con el mismo anillo y el trazo animado de la pantalla de carga; el botón de estado usa un spinner pequeño mientras guarda (con `prefers-reduced-motion` ambos quedan quietos). Si una consulta falla, la pantalla se oculta para mostrar el error en la página.

### Configuración

Las variables del backend se leen de `backend/.env` (opcional). Copia la plantilla y complétala:

```powershell
Copy-Item backend\.env.example backend\.env
notepad backend\.env
```

Si SQL Server está en tu máquina (no en otro servidor), usa `DB_SERVER=host.docker.internal`. El asistente de impresión usa por defecto `http://10.0.40.8:5015` para HTTP y `http://10.0.40.8:5015/impresion` para WebSocket. Para cambiarlo, ajusta `IMPRESION_API_URL` en `backend/.env` y `NEXT_PUBLIC_IMPRESION_URL` al levantar el compose.

### Configuración de impresión desde el panel

En la vista **Impresoras** hay un botón **Configuración** (engranaje) que abre un modal para:

- Pausar o reanudar la impresión global.
- Elegir factura, guía o ambos.
- Elegir copias de forma independiente: `cedible` (3 páginas) o `solo_original` (1 página).
- Activar o desactivar impresoras y ejecutar su diagnóstico (no imprime ni gasta papel).
- Consultar el modo `PRUEBAS`, que es una variable del daemon y no se cambia desde el panel.

El backend publica estas acciones en `/api/impresion` y `/api/impresoras/*` con autenticación Bearer y las proxya al asistente. Tras cada cambio, el frontend recibe `impresion:estado` y vuelve a pedir `impresion:snapshot`, así que el modal se actualiza en tiempo real.

El enlace **Ver trabajos** de cada impresora abre `/trabajos?impresora=<Code>` y consulta `GET /api/impresoras/<Code>/trabajos?fecha=YYYY-MM-DD`. El historial une las facturas de `AI_Factura` y las guías de `DESP_CABGUIA` con `WITH (NOLOCK)`, filtrando ambas por `IdImpresora = Code` y por día (por defecto hoy). Cada documento se relaciona con la última fila de `AI_Estadisticas` por su número (`AI_Factura.Factura` o `DESP_CABGUIA.N_Guia` contra `AI_Estadisticas.idDocumento`) para mostrar las páginas impresas desde `QtyPaginas` y los tiempos en segundos al desplegarlo. El `Status` se interpreta como `2 = Impreso`, `3 = Error` y `4 = Reimpreso`; los registros con `Status = 1` se excluyen del historial. La vista tiene selector de fecha y botón **Hoy**, igual que **Logs**, y un buscador local por número de documento, tipo o estado que ignora tildes y mayúsculas.

### Servidores

La sección **Servidores** consulta `GET /api/servidores` con autenticación Bearer cada 1 segundo. La consulta usa `WITH (NOLOCK)`, omite el registro `LOCAL` y devuelve una card por servidor con `ID`, nombre (`SERVER`), estado y latencia. El estado se obtiene con una conexión TCP al puerto `5015` del equipo (configurable con `SERVIDORES_PUERTO`; el tiempo de espera con `SERVIDORES_TIMEOUT_MS`).

### Logs de `tz_log`

La sección **Logs** muestra primero una card por aplicación de `TZ_APP` con su servidor de `TZ_SERVER`. Al elegir una app se abre `/logs?app=<ID>` y se conecta un WebSocket autenticado en `/ws/logs?token=...&fecha=YYYY-MM-DD`. Por defecto solo se muestran los registros del día; el selector de fecha (y el botón **Hoy**) vuelve a conectarse con otra fecha. El backend ejecuta `SELECT *, CONVERT(varchar(19), Fecha, 120) AS FechaTexto FROM tz_log WITH (NOLOCK) WHERE Fecha >= CAST(@fecha AS date) AND Fecha < DATEADD(day, 1, CAST(@fecha AS date)) ORDER BY ID DESC` cada 500 ms mientras haya clientes conectados. La hora se envía ya formateada por SQL Server (`yyyy-MM-dd HH:mm:ss`) y se muestra tal cual, sin conversiones de zona horaria. La vista incluye una leyenda de colores por tipo según `TZ_TIPOLOG`, permite filtrar por `IDAPP` y muestra `ID`, `IDAPP`, tipo, `Fecha (BD)` y el `CUERPO` sin el prefijo `fecha [tipo] ... [último corchete]`. El buscador local filtra sobre los registros ya recibidos por ID, app, tipo, fecha y cuerpo, combinándose con los filtros de app/tipo/fecha, sin tildes ni mayúsculas y sin abrir otra conexión.

### Comandos útiles

```powershell
docker compose -f docker-compose.dev.yml logs -f backend frontend
docker compose -f docker-compose.dev.yml restart backend
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml down -v   # también borra cachés de node_modules/.next
```
