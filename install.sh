#!/bin/bash
set -e

# ─── Colores ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
INSTALL_DIR="/opt/recetas"
SERVICE_USER="${SUDO_USER:-$(whoami)}"

# ─── Root check ────────────────────────────────────────────────────────────────
[ "$EUID" -ne 0 ] && error "Ejecuta con sudo: sudo bash install.sh"

# ─── ANTHROPIC_API_KEY ─────────────────────────────────────────────────────────
if [ -f "$APP_DIR/.env" ]; then
  export $(grep -v '^#' "$APP_DIR/.env" | xargs)
fi
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo ""
  read -rp "Introduce tu ANTHROPIC_API_KEY: " ANTHROPIC_API_KEY
  [ -z "$ANTHROPIC_API_KEY" ] && error "La clave API es obligatoria"
  echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" > "$APP_DIR/.env"
fi

info "Instalando App de Recetas y Menú Semanal..."
info "Directorio de instalación: $INSTALL_DIR"

# ─── Dependencias del sistema ──────────────────────────────────────────────────
info "Actualizando paquetes del sistema..."
apt-get update -qq

info "Instalando Python 3, pip y nginx..."
apt-get install -y -qq python3 python3-pip python3-venv nginx curl

# Node.js 20 LTS
if ! command -v node &>/dev/null || [[ "$(node -v)" != v20* ]]; then
  info "Instalando Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null 2>&1
  apt-get install -y -qq nodejs
fi

# ─── Copiar archivos ───────────────────────────────────────────────────────────
info "Copiando archivos a $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"
cp -r "$APP_DIR/backend" "$INSTALL_DIR/"
cp -r "$APP_DIR/frontend" "$INSTALL_DIR/"
cp "$APP_DIR/.env" "$INSTALL_DIR/"
mkdir -p "$INSTALL_DIR/data"
chown -R "$SERVICE_USER":"$SERVICE_USER" "$INSTALL_DIR"

# ─── Backend: virtualenv + dependencias ───────────────────────────────────────
info "Instalando dependencias del backend..."
python3 -m venv "$INSTALL_DIR/venv"
"$INSTALL_DIR/venv/bin/pip" install --quiet --upgrade pip
"$INSTALL_DIR/venv/bin/pip" install --quiet -r "$INSTALL_DIR/backend/requirements.txt"

# ─── Frontend: build ──────────────────────────────────────────────────────────
info "Construyendo el frontend (puede tardar unos minutos)..."
cd "$INSTALL_DIR/frontend"
npm install --silent
npm run build --silent
cd "$APP_DIR"

# ─── Servicio systemd: backend ────────────────────────────────────────────────
info "Creando servicio systemd para el backend..."
cat > /etc/systemd/system/recetas-backend.service <<EOF
[Unit]
Description=Recetas App - Backend (FastAPI)
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR/backend
Environment="DB_PATH=$INSTALL_DIR/data/recipes.db"
EnvironmentFile=$INSTALL_DIR/.env
ExecStart=$INSTALL_DIR/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# ─── nginx: frontend + proxy al backend ───────────────────────────────────────
info "Configurando nginx..."
cat > /etc/nginx/sites-available/recetas <<EOF
server {
    listen 80;
    server_name _;

    root $INSTALL_DIR/frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_read_timeout 120s;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

ln -sf /etc/nginx/sites-available/recetas /etc/nginx/sites-enabled/recetas
rm -f /etc/nginx/sites-enabled/default
nginx -t >/dev/null 2>&1 || error "Error en la configuración de nginx"

# ─── Arrancar servicios ───────────────────────────────────────────────────────
info "Activando y arrancando servicios..."
systemctl daemon-reload
systemctl enable recetas-backend >/dev/null 2>&1
systemctl restart recetas-backend
systemctl enable nginx >/dev/null 2>&1
systemctl restart nginx

# ─── Verificar ────────────────────────────────────────────────────────────────
sleep 3
if systemctl is-active --quiet recetas-backend; then
  info "Backend arrancado correctamente"
else
  warning "El backend puede tardar unos segundos en arrancar"
  warning "Comprueba: sudo systemctl status recetas-backend"
fi

# ─── IP local ─────────────────────────────────────────────────────────────────
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Instalación completada${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  🌐 Abre en el navegador:  http://$LOCAL_IP"
echo -e "  📁 Datos guardados en:    $INSTALL_DIR/data/"
echo ""
echo -e "  Comandos útiles:"
echo -e "    sudo systemctl status recetas-backend"
echo -e "    sudo systemctl restart recetas-backend"
echo -e "    sudo journalctl -u recetas-backend -f"
echo ""
