from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from collections import defaultdict
from database import get_db
from models import WeeklyMenu, MenuEntry, RecipeIngredient
from schemas import ShoppingItem

router = APIRouter(prefix="/shopping", tags=["shopping"])

@router.get("/{menu_id}", response_model=List[ShoppingItem])
def get_shopping_list(menu_id: int, db: Session = Depends(get_db)):
    menu = db.query(WeeklyMenu).filter(WeeklyMenu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")

    totals = defaultdict(lambda: {"quantity": 0.0, "unit": None})

    for entry in menu.entries:
        if not entry.recipe_id:
            continue
        for ri in entry.recipe.ingredients:
            key = ri.ingredient.name
            if ri.quantity:
                totals[key]["quantity"] += ri.quantity
            totals[key]["unit"] = ri.unit

    result = []
    for name, data in sorted(totals.items()):
        result.append(ShoppingItem(
            ingredient_name=name,
            total_quantity=data["quantity"] if data["quantity"] > 0 else None,
            unit=data["unit"],
        ))
    return result
