import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

app.include_router(recipes.router, prefix="/api/recipes", tags=["recipes"])
app.include_router(menu.router, prefix="/api/menu", tags=["menu"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(shopping.router, prefix="/api/shopping", tags=["shopping"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Mana API is running"}
