import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Dentro del contenedor los datos viven en /app/data (ver docker-compose).
# Fuera de él esa ruta no es escribible —en Windows apuntaría a C:\app\data—,
# así que se usa la carpeta data/ del repositorio. DATA_DIR manda sobre ambas.
BACKEND_DIR = Path(__file__).resolve().parent
DEFAULT_DATA_DIR = Path("/app/data") if os.name != "nt" else BACKEND_DIR.parent / "data"
DATA_DIR = Path(os.getenv("DATA_DIR", DEFAULT_DATA_DIR))
DATA_DIR.mkdir(parents=True, exist_ok=True)

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", f"sqlite:///{(DATA_DIR / 'recipes.db').as_posix()}"
)
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
