import json
import random
from datetime import date, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import WeeklyMenu, MenuEntry, Recipe
from schemas import WeeklyMenuCreate, MenuEntryCreate

router = APIRouter()

def menu_to_response(menu: WeeklyMenu) -> dict:
    entries = []
    for entry in menu.entries:
        recipe_data = None
        if entry.recipe:
            try:
                category = json.loads(entry.recipe.category) if isinstance(entry.recipe.category, str) else entry.recipe.category
            except Exception:
                category = []
            try:
                steps = json.loads(entry.recipe.steps) if isinstance(entry.recipe.steps, str) else entry.recipe.steps
            except Exception:
                steps = []
            recipe_data = {
                "id": entry.recipe.id,
                "name": entry.recipe.name,
                "meal_type": entry.recipe.meal_type,
                "category": category,
                "prep_time_minutes": entry.recipe.prep_time_minutes,
                "servings": entry.recipe.servings,
                "steps": steps,
                "photo_url": entry.recipe.photo_url,
                "created_at": entry.recipe.created_at,
                "ingredients": [],
            }
        entries.append({
            "id": entry.id,
            "day_of_week": entry.day_of_week,
            "meal_type": entry.meal_type,
            "recipe_id": entry.recipe_id,
            "recipe": recipe_data,
        })
    return {
        "id": menu.id,
        "week_start_date": menu.week_start_date,
        "name": menu.name,
        "created_at": menu.created_at,
        "entries": entries,
    }

@router.get("")
def list_menus(db: Session = Depends(get_db)):
    menus = db.query(WeeklyMenu).order_by(WeeklyMenu.created_at.desc()).all()
    return [{"id": m.id, "week_start_date": m.week_start_date, "name": m.name, "created_at": m.created_at} for m in menus]

@router.get("/current")
def get_current_menu(db: Session = Depends(get_db)):
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    week_start = monday.isoformat()
    menu = db.query(WeeklyMenu).filter(WeeklyMenu.week_start_date == week_start).first()
    if not menu:
        return None
    return menu_to_response(menu)

@router.post("/generate-auto")
def generate_auto_menu(
    week_start_date: str,
    custom_rules: Optional[str] = None,
    db: Session = Depends(get_db)
):
    recipes = db.query(Recipe).all()
    if not recipes:
        raise HTTPException(status_code=400, detail="No hay recetas en la base de datos")

    comida_recipes = [r for r in recipes if r.meal_type in ("comida", "ambos")]
    cena_recipes = [r for r in recipes if r.meal_type in ("cena", "ambos")]
    if not comida_recipes:
        comida_recipes = recipes
    if not cena_recipes:
        cena_recipes = recipes

    existing = db.query(WeeklyMenu).filter(WeeklyMenu.week_start_date == week_start_date).first()
    if existing:
        db.delete(existing)
        db.commit()

    menu = WeeklyMenu(week_start_date=week_start_date, name=f"Menú semana {week_start_date}")
    db.add(menu)
    db.flush()

    used_comida = []
    used_cena = []
    for day in range(7):
        available_comida = [r for r in comida_recipes if r.id not in used_comida]
        if not available_comida:
            available_comida = comida_recipes
            used_comida = []
        c = random.choice(available_comida)
        used_comida.append(c.id)
        db.add(MenuEntry(menu_id=menu.id, day_of_week=day, meal_type="comida", recipe_id=c.id))

        available_cena = [r for r in cena_recipes if r.id not in used_cena]
        if not available_cena:
            available_cena = cena_recipes
            used_cena = []
        ce = random.choice(available_cena)
        used_cena.append(ce.id)
        db.add(MenuEntry(menu_id=menu.id, day_of_week=day, meal_type="cena", recipe_id=ce.id))

    db.commit()
    db.refresh(menu)
    return menu_to_response(menu)

@router.get("/{menu_id}")
def get_menu(menu_id: int, db: Session = Depends(get_db)):
    menu = db.query(WeeklyMenu).filter(WeeklyMenu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")
    return menu_to_response(menu)

@router.post("")
def create_menu(menu_in: WeeklyMenuCreate, db: Session = Depends(get_db)):
    menu = WeeklyMenu(week_start_date=menu_in.week_start_date, name=menu_in.name)
    db.add(menu)
    db.commit()
    db.refresh(menu)
    return menu_to_response(menu)

@router.delete("/{menu_id}")
def delete_menu(menu_id: int, db: Session = Depends(get_db)):
    menu = db.query(WeeklyMenu).filter(WeeklyMenu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")
    db.delete(menu)
    db.commit()
    return {"message": "Menú eliminado"}

@router.post("/{menu_id}/entries")
def add_entry(menu_id: int, entry_in: MenuEntryCreate, db: Session = Depends(get_db)):
    menu = db.query(WeeklyMenu).filter(WeeklyMenu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")
    db.query(MenuEntry).filter(
        MenuEntry.menu_id == menu_id,
        MenuEntry.day_of_week == entry_in.day_of_week,
        MenuEntry.meal_type == entry_in.meal_type
    ).delete()
    entry = MenuEntry(menu_id=menu_id, day_of_week=entry_in.day_of_week, meal_type=entry_in.meal_type, recipe_id=entry_in.recipe_id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"id": entry.id, "day_of_week": entry.day_of_week, "meal_type": entry.meal_type, "recipe_id": entry.recipe_id}

@router.delete("/{menu_id}/entries/{entry_id}")
def remove_entry(menu_id: int, entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(MenuEntry).filter(MenuEntry.id == entry_id, MenuEntry.menu_id == menu_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    db.delete(entry)
    db.commit()
    return {"message": "Entrada eliminada"}
