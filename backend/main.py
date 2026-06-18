from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import recipes, menu, shopping, ai

Base.metadata.create_all(bind=engine)

app = FastAPI(title="App de Recetas y Menú Semanal", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recipes.router)
app.include_router(menu.router)
app.include_router(shopping.router)
app.include_router(ai.router)

@app.get("/health")
def health():
    return {"status": "ok"}
