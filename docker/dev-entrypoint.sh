#!/bin/sh
set -eu

# Reinstala dependencias cuando cambia package-lock.json (el volumen de
# node_modules sobrevive a los rebuilds de la imagen).
lock_hash=$(sha256sum package-lock.json | cut -d ' ' -f 1)
marker="node_modules/.docker-dev-lock"

if [ ! -f "$marker" ] || [ "$(cat "$marker")" != "$lock_hash" ]; then
    echo "[docker-dev] Instalando dependencias..."
    npm ci --no-audit --no-fund
    printf '%s' "$lock_hash" > "$marker"
fi

exec "$@"
