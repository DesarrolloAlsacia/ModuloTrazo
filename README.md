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

### Configuración

Las variables del backend se leen de `backend/.env` (opcional). Copia la plantilla y complétala:

```powershell
Copy-Item backend\.env.example backend\.env
notepad backend\.env
```

Si SQL Server está en tu máquina (no en otro servidor), usa `DB_SERVER=host.docker.internal`. Para el servicio de impresión en la red, ajusta `IMPRESION_API_URL` y, si lo consume el navegador, `NEXT_PUBLIC_IMPRESION_URL` (también se puede pasar como variable de entorno al compose).

### Configuración de impresión desde el panel

En la vista **Impresoras** hay un botón **Configuración** (engranaje) que abre un modal para:

- Pausar o reanudar la impresión global.
- Elegir factura, guía o ambos.
- Elegir copias de forma independiente: `cedible` (3 páginas) o `solo_original` (1 página).
- Activar o desactivar impresoras y ejecutar su diagnóstico (no imprime ni gasta papel).
- Consultar el modo `PRUEBAS`, que es una variable del daemon y no se cambia desde el panel.

El backend publica estas acciones en `/api/impresion` y `/api/impresoras/*` con autenticación Bearer y las proxya al asistente. Tras cada cambio, el frontend recibe `impresion:estado` y vuelve a pedir `impresion:snapshot`, así que el modal se actualiza en tiempo real.

### Comandos útiles

```powershell
docker compose -f docker-compose.dev.yml logs -f backend frontend
docker compose -f docker-compose.dev.yml restart backend
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml down -v   # también borra cachés de node_modules/.next
```
