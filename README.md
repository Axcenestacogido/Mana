# Mana - Recetas y Menú Semanal

Aplicación web completa para gestionar recetas de cocina y planificar el menú semanal con ayuda de inteligencia artificial.

## Características

- Gestión de recetas (crear, editar, eliminar, buscar)
- Planificación de menú semanal con drag & drop
- Generación automática de lista de compras
- IA para generar recetas desde ingredientes
- IA para crear variaciones de recetas
- IA para sugerir menú semanal
- Modo cocina paso a paso

## Instalación

### Requisitos
- Docker y Docker Compose
- Clave API de Anthropic

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/Axcenestacogido/Mana.git
cd Mana
```

2. Instalar Docker (Debian/Ubuntu). Si ya lo tienes, salta este paso:
```bash
sudo bash install-docker.sh
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env y añadir tu ANTHROPIC_API_KEY
```

4. Iniciar la aplicación:
```bash
docker compose -f docker-compose.local.yml up -d --build
```

5. Abrir en el navegador: http://localhost:3000

Los datos se guardan en `./data/recipes.db`.

### Exponer la app en tu tailnet (opcional)

El `docker-compose.yml` principal publica Mana en Tailscale con HTTPS en lugar
de en `localhost`. Requiere una `TS_AUTHKEY` en el `.env` (ver `.env.example`):

```bash
docker compose up -d --build
```

## Instalación sin Docker

Alternativa con systemd + nginx, sin contenedores:

```bash
sudo bash install.sh
```

## Desarrollo local

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tecnologías

- **Backend**: FastAPI (Python), SQLite, SQLAlchemy
- **Frontend**: React, TypeScript, Vite
- **IA**: Claude claude-sonnet-4-6 (Anthropic)
- **Infraestructura**: Docker Compose

