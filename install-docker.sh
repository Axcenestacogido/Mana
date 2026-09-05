#!/bin/bash
# Instala Docker Engine + Docker Compose en Debian/Ubuntu desde el repositorio oficial.
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

[ "$EUID" -ne 0 ] && error "Ejecuta con sudo: sudo bash install-docker.sh"

if ! command -v apt-get &>/dev/null; then
  error "Este script sólo soporta Debian/Ubuntu. Consulta https://docs.docker.com/engine/install/"
fi

if command -v docker &>/dev/null && docker compose version &>/dev/null; then
  info "Docker ya está instalado: $(docker --version)"
else
  info "Instalando dependencias..."
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl gnupg

  info "Añadiendo la clave GPG oficial de Docker..."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
  chmod a+r /etc/apt/keyrings/docker.gpg

  info "Añadiendo el repositorio de Docker..."
  . /etc/os-release
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu ${UBUNTU_CODENAME:-$VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list

  info "Instalando Docker Engine y Docker Compose..."
  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin
fi

# ─── Arrancar el servicio ─────────────────────────────────────────────────────
if command -v systemctl &>/dev/null && systemctl is-system-running &>/dev/null; then
  systemctl enable docker >/dev/null 2>&1 || true
  systemctl start docker
else
  warning "systemd no está activo; arranca el daemon a mano con: dockerd &"
fi

# ─── Permitir usar docker sin sudo ────────────────────────────────────────────
TARGET_USER="${SUDO_USER:-}"
if [ -n "$TARGET_USER" ] && [ "$TARGET_USER" != "root" ]; then
  info "Añadiendo '$TARGET_USER' al grupo docker..."
  groupadd -f docker
  usermod -aG docker "$TARGET_USER"
  warning "Cierra sesión y vuelve a entrar para usar docker sin sudo."
fi

# ─── Verificar ────────────────────────────────────────────────────────────────
if docker info >/dev/null 2>&1; then
  info "Docker funciona correctamente."
  docker --version
  docker compose version
else
  warning "El daemon de Docker no responde todavía. Comprueba: sudo systemctl status docker"
fi
