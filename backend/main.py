import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from routers import recipes, menu, ai, shopping

os.makedirs("/app/data", exist_ok=True)

app = FastAPI(title="Mana - Recetas y Menú Semanal", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Auto-migrate: add missing columns to existing DB without breaking data
def _run_migrations():
    from sqlalchemy import text
    with engine.connect() as conn:
        existing = {row[1] for row in conn.execute(text("PRAGMA table_info(recipes)"))}
        for col, ddl in [
            ("is_favorite", "ALTER TABLE recipes ADD COLUMN is_favorite BOOLEAN DEFAULT 0"),
            ("notes",       "ALTER TABLE recipes ADD COLUMN notes TEXT"),
            ("photo_url",   "ALTER TABLE recipes ADD COLUMN photo_url VARCHAR"),
            ("season",      "ALTER TABLE recipes ADD COLUMN season VARCHAR DEFAULT 'todo_el_año'"),
        ]:
            if col not in existing:
                conn.execute(text(ddl))
        existing_sl = {row[1] for row in conn.execute(text("PRAGMA table_info(shopping_lists)"))}
        if "category" not in existing_sl:
            conn.execute(text("ALTER TABLE shopping_lists ADD COLUMN category VARCHAR"))
        existing_wm = {row[1] for row in conn.execute(text("PRAGMA table_info(weekly_menus)"))}
        if "share_token" not in existing_wm:
            conn.execute(text("ALTER TABLE weekly_menus ADD COLUMN share_token VARCHAR"))
        if "color" not in existing_wm:
            conn.execute(text("ALTER TABLE weekly_menus ADD COLUMN color VARCHAR"))
        if "season" not in existing_wm:
            conn.execute(text("ALTER TABLE weekly_menus ADD COLUMN season VARCHAR"))
        conn.commit()

_run_migrations()

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(recipes.router, prefix="/api/recipes", tags=["recipes"])
app.include_router(menu.router, prefix="/api/menu", tags=["menu"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(shopping.router, prefix="/api/shopping", tags=["shopping"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Mana API is running"}
