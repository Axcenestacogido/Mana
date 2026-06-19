from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import WeeklyMenu, ShoppingList

router = APIRouter()

CATEGORIES = {
    "verduras": ["tomate","cebolla","ajo","pimiento","zanahoria","calabacín","espinaca","lechuga","pepino","patata","berenjena","brócoli","coliflor","puerro","champiñon","seta"],
    "frutas": ["limón","naranja","manzana","plátano","fresa","uva","pera","melocotón","mango","piña","aguacate","lima"],
    "carnes": ["pollo","ternera","cerdo","cordero","pavo","conejo","jamón","bacon","chorizo","salchicha","carne"],
    "pescados": ["salmón","atún","merluza","bacalao","gambas","mejillones","calamares","dorada","lubina","langostino"],
    "lácteos": ["leche","queso","yogur","mantequilla","nata","crema","mozzarella","parmesano"],
    "huevos": ["huevo","huevos"],
    "cereales": ["arroz","pasta","pan","harina","avena","quinoa","cuscús","maíz"],
    "legumbres": ["lenteja","garbanzo","judía","alubia","soja","guisante"],
    "aceites y salsas": ["aceite","vinagre","salsa","mayonesa","ketchup","mostaza","soja"],
    "especias": ["sal","pimienta","pimentón","comino","orégano","tomillo","romero","curry","canela","azafrán"],
    "otros": [],
}

def categorize_ingredient(name: str) -> str:
    name_lower = name.lower()
    for cat, keywords in CATEGORIES.items():
        if any(kw in name_lower for kw in keywords):
            return cat
    return "otros"

@router.get("/{menu_id}")
def get_shopping_list(menu_id: int, db: Session = Depends(get_db)):
    items = db.query(ShoppingList).filter(ShoppingList.menu_id == menu_id).all()
    return [{"id": i.id, "menu_id": i.menu_id, "ingredient_name": i.ingredient_name, "total_quantity": i.total_quantity, "unit": i.unit, "is_checked": i.is_checked, "category": i.category} for i in items]

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
        item = ShoppingList(menu_id=menu_id, ingredient_name=name, total_quantity=round(qty, 2), unit=unit, category=categorize_ingredient(name))
        db.add(item)
        items.append(item)

    db.commit()
    for item in items:
        db.refresh(item)

    return [{"id": i.id, "menu_id": i.menu_id, "ingredient_name": i.ingredient_name, "total_quantity": i.total_quantity, "unit": i.unit, "is_checked": i.is_checked, "category": i.category} for i in items]

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
