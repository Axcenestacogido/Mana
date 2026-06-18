from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import WeeklyMenu, ShoppingList

router = APIRouter()

@router.get("/{menu_id}")
def get_shopping_list(menu_id: int, db: Session = Depends(get_db)):
    items = db.query(ShoppingList).filter(ShoppingList.menu_id == menu_id).all()
    return [{"id": i.id, "menu_id": i.menu_id, "ingredient_name": i.ingredient_name, "total_quantity": i.total_quantity, "unit": i.unit, "is_checked": i.is_checked} for i in items]

@router.post("/generate/{menu_id}")
def generate_shopping_list(menu_id: int, db: Session = Depends(get_db)):
    menu = db.query(WeeklyMenu).filter(WeeklyMenu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menú no encontrado")

    db.query(ShoppingList).filter(ShoppingList.menu_id == menu_id).delete()

    ingredient_totals: dict = {}
    for entry in menu.entries:
        if entry.recipe:
            for ri in entry.recipe.recipe_ingredients:
                if ri.ingredient:
                    key = (ri.ingredient.name, ri.unit)
                    if key not in ingredient_totals:
                        ingredient_totals[key] = 0.0
                    ingredient_totals[key] += ri.quantity

    items = []
    for (name, unit), qty in sorted(ingredient_totals.items()):
        item = ShoppingList(menu_id=menu_id, ingredient_name=name, total_quantity=round(qty, 2), unit=unit)
        db.add(item)
        items.append(item)

    db.commit()
    for item in items:
        db.refresh(item)

    return [{"id": i.id, "menu_id": i.menu_id, "ingredient_name": i.ingredient_name, "total_quantity": i.total_quantity, "unit": i.unit, "is_checked": i.is_checked} for i in items]

@router.put("/{menu_id}/items/{item_id}/check")
def toggle_item(menu_id: int, item_id: int, db: Session = Depends(get_db)):
    item = db.query(ShoppingList).filter(ShoppingList.id == item_id, ShoppingList.menu_id == menu_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Elemento no encontrado")
    item.is_checked = not item.is_checked
    db.commit()
    return {"id": item.id, "is_checked": item.is_checked}

@router.delete("/{menu_id}")
def delete_shopping_list(menu_id: int, db: Session = Depends(get_db)):
    db.query(ShoppingList).filter(ShoppingList.menu_id == menu_id).delete()
    db.commit()
    return {"message": "Lista de compras eliminada"}
