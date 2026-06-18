#!/bin/bash
set -e

[ "$EUID" -ne 0 ] && echo "Ejecuta con sudo: sudo bash uninstall.sh" && exit 1

echo "Desinstalando App de Recetas..."

systemctl stop recetas-backend 2>/dev/null || true
systemctl disable recetas-backend 2>/dev/null || true
rm -f /etc/systemd/system/recetas-backend.service
systemctl daemon-reload

rm -f /etc/nginx/sites-enabled/recetas
rm -f /etc/nginx/sites-available/recetas
systemctl restart nginx

read -rp "¿Borrar también los datos y recetas guardadas en /opt/recetas? [s/N] " resp
if [[ "$resp" =~ ^[sS]$ ]]; then
  rm -rf /opt/recetas
  echo "Datos eliminados."
else
  echo "Los datos se conservan en /opt/recetas/data/"
fi

echo "Desinstalación completada."
