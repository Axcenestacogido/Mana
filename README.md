# App de Recetas y Menú Semanal

App completa para gestionar recetas y el menú semanal familiar, con IA (Claude).

---

## Opción A — Docker (PC, Mac, servidor)

Requiere Docker y Docker Compose instalados.

```bash
git clone <url-del-repo>
cd Mana
cp .env.example .env
# Editar .env y añadir tu ANTHROPIC_API_KEY
docker compose up --build
```

Abrir → http://localhost:3000

---

## Opción B — Instalación nativa (Raspberry Pi, Ubuntu, Debian)

Sin Docker. Instala Python, Node.js y nginx directamente en el sistema.

```bash
git clone <url-del-repo>
cd Mana
cp .env.example .env
# Editar .env y añadir tu ANTHROPIC_API_KEY
sudo bash install.sh
```

Abrir → http://<ip-del-dispositivo>

Los datos se guardan en `/opt/recetas/data/recipes.db`.

### Gestión del servicio

```bash
sudo systemctl status recetas-backend    # ver estado
sudo systemctl restart recetas-backend   # reiniciar
sudo journalctl -u recetas-backend -f    # ver logs en tiempo real
```

### Desinstalar

```bash
sudo bash uninstall.sh
```

---

## Funcionalidades

- Gestión completa de recetas (ingredientes, pasos, fotos, categorías)
- Escalado automático de porciones
- Tablero semanal drag & drop (comida y cena por día)
- Generación automática de menú respetando reglas propias
- Historial de comidas para evitar repeticiones
- **IA:** generar receta con ingredientes disponibles
- **IA:** variaciones de receta (sin gluten, más ligera, vegano...)
- **IA:** sugerir menú semanal completo
- Lista de la compra automática con checkboxes
- Modo cocina: pasos a pantalla completa, letra grande

---

## Stack técnico

| Componente | Tecnología |
|---|---|
| Backend | FastAPI + SQLAlchemy + SQLite |
| Frontend | React + TypeScript + Vite |
| IA | Anthropic Claude API |
| Despliegue A | Docker Compose |
| Despliegue B | systemd + nginx |
