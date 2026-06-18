# App de Recetas y Menú Semanal

App completa para gestionar recetas y el menú semanal familiar, con generación de platos mediante IA (Claude).

## Instalación rápida

1. Clonar el repositorio
2. Copiar `.env.example` a `.env` y añadir tu `ANTHROPIC_API_KEY`
3. Ejecutar:

```bash
docker compose up --build
```

4. Abrir http://localhost:3000

## Funcionalidades

- Gestión completa de recetas (ingredientes, pasos, fotos, categorías)
- Escalado automático de porciones
- Tablero semanal drag & drop (comida y cena)
- Generación automática de menú respetando reglas (ej: viernes pescado)
- Historial de comidas para evitar repeticiones
- IA: generar receta con ingredientes disponibles
- IA: variaciones de receta (sin gluten, más ligera...)
- IA: sugerir menú semanal completo
- Lista de la compra automática
- Modo cocina: pasos a pantalla completa

## Stack técnico

- Backend: FastAPI + SQLAlchemy + SQLite
- Frontend: React + TypeScript + Vite
- IA: Anthropic Claude API
- Despliegue: Docker Compose
