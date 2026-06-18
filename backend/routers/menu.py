import json
import random
from datetime import date, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import WeeklyMenu, MenuEntry, Recipe
from schemas import WeeklyMenuCreate, WeeklyMenuOut

router = APIRouter(prefix="/menu", tags=["menu"])

DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

def _menu_to_out(menu: WeeklyMenu) -> dict:
    entries = []
    for e in menu.entries:
        entry = {
            "id": e.id,
            "day_of_week": e.day_of_week,
            "meal_type": e.meal_type,
            "recipe_id": e.recipe_id,
            "recipe": None,
        }
        if e.recipe:
            entry["recipe"] = {
                "id": e.recipe.id,
                "name": e.recipe.name,
                "meal_type": e.recipe.meal_type,
                "categories": e.recipe.get_categories(),
                "prep_time_minutes": e.recipe.prep_time_minutes,
                "servings": e.recipe.servings,
                "steps": e.recipe.get_steps(),
                "photo_url": e.recipe.photo_url,
                "notes": e.recipe.notes,
                "created_at": e.recipe.created_at,
                "ingredients": [
                    {"name": ri.ingredient.name, "quantity": ri.quantity, "unit": ri.unit}
                    for ri in e.recipe.ingredients
                ],
            }
        entries.append(entry)
    return {
        "id": menu.id,
        "name": menu.name,
        "week_start_date": menu.week_start_date,
        "created_at": menu.created_at,
        "entries": entries,
    }

@router.get("/", response_model=List[WeeklyMenuOut])
def list_menus(db: Session = Depends(get_db)):
    menus = db.query(WeeklyMenu).order_by(WeeklyMenu.week_start_date.desc()).all()
    return [_menu_to_out(m) for m in menus]

@router.get("/{menu_id}", response_model=WeeklyMenuOut)
def get_menu(menu_id: int, db: Session = Depends(get_db)):
    menu = db.query(WeeklyMenu).filter(WeeklyMenu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")
    return _menu_to_out(menu)

@router.post("/", response_model=WeeklyMenuOut, status_code=201)
def create_menu(data: WeeklyMenuCreate, db: Session = Depends(get_db)):
    menu = WeeklyMenu(week_start_date=data.week_start_date, name=data.name)
    db.add(menu)
    db.commit()
    db.refresh(menu)
    return _menu_to_out(menu)

@router.put("/{menu_id}/entry")
def set_menu_entry(menu_id: int, day_of_week: int, meal_type: str, recipe_id: Optional[int] = None, db: Session = Depends(get_db)):
    menu = db.query(WeeklyMenu).filter(WeeklyMenu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")
    entry = db.query(MenuEntry).filter(
        MenuEntry.menu_id == menu_id,
        MenuEntry.day_of_week == day_of_week,
        MenuEntry.meal_type == meal_type
    ).first()
    if entry:
        entry.recipe_id = recipe_id
    else:
        entry = MenuEntry(menu_id=menu_id, day_of_week=day_of_week, meal_type=meal_type, recipe_id=recipe_id)
        db.add(entry)
    db.commit()
    return {"ok": True}

@router.post("/{menu_id}/generate")
def generate_menu(menu_id: int, rules: Optional[str] = None, db: Session = Depends(get_db)):
    """Auto-generate menu entries avoiding repeats. rules is JSON like {"5": "pescado"} meaning Friday=pescado category."""
    menu = db.query(WeeklyMenu).filter(WeeklyMenu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")

    custom_rules = {}
    if rules:
        try:
            custom_rules = json.loads(rules)
        except Exception:
            pass

    # Get recently used recipe ids from last 2 menus
    recent_menus = db.query(WeeklyMenu).order_by(WeeklyMenu.created_at.desc()).limit(3).all()
    recent_ids = set()
    for m in recent_menus:
        if m.id != menu_id:
            for e in m.entries:
                if e.recipe_id:
                    recent_ids.add(e.recipe_id)

    all_recipes = db.query(Recipe).all()
    comida_recipes = [r for r in all_recipes if r.meal_type in ("comida", "ambas")]
    cena_recipes = [r for r in all_recipes if r.meal_type in ("cena", "ambas")]

    def pick(pool, used_ids, category_filter=None):
        filtered = [r for r in pool if r.id not in used_ids]
        if category_filter:
            cat_filtered = [r for r in filtered if category_filter.lower() in " ".join(r.get_categories()).lower() or category_filter.lower() in r.name.lower()]
            if cat_filtered:
                filtered = cat_filtered
        if not filtered:
            filtered = pool
        if not filtered:
            return None
        return random.choice(filtered)

    used_this_week = set()
    # Delete existing entries
    db.query(MenuEntry).filter(MenuEntry.menu_id == menu_id).delete()

    for day in range(7):
        rule_cat = custom_rules.get(str(day))
        for meal_type, pool in [("comida", comida_recipes), ("cena", cena_recipes)]:
            recipe = pick(pool, used_this_week | recent_ids, rule_cat)
            if recipe:
                used_this_week.add(recipe.id)
                entry = MenuEntry(menu_id=menu_id, day_of_week=day, meal_type=meal_type, recipe_id=recipe.id)
                db.add(entry)

    db.commit()
    db.refresh(menu)
    return _menu_to_out(menu)

@router.delete("/{menu_id}", status_code=204)
def delete_menu(menu_id: int, db: Session = Depends(get_db)):
    menu = db.query(WeeklyMenu).filter(WeeklyMenu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")
    db.delete(menu)
    db.commit()
