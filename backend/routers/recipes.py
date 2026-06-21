import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import Recipe, Ingredient, RecipeIngredient
from schemas import RecipeCreate, RecipeUpdate

router = APIRouter()

def get_or_create_ingredient(db: Session, name: str) -> Ingredient:
    ing = db.query(Ingredient).filter(Ingredient.name == name.lower().strip()).first()
    if not ing:
        ing = Ingredient(name=name.lower().strip())
        db.add(ing)
        db.flush()
    return ing

def recipe_to_response(recipe: Recipe) -> dict:
    ingredients = []
    for ri in recipe.recipe_ingredients:
        ingredients.append({
            "id": ri.id,
            "ingredient_id": ri.ingredient_id,
            "ingredient_name": ri.ingredient.name if ri.ingredient else "",
            "quantity": ri.quantity,
            "unit": ri.unit,
        })
    try:
        category = json.loads(recipe.category) if isinstance(recipe.category, str) else recipe.category
    except Exception:
        category = []
    try:
        steps = json.loads(recipe.steps) if isinstance(recipe.steps, str) else recipe.steps
    except Exception:
        steps = []
    return {
        "id": recipe.id,
        "name": recipe.name,
        "meal_type": recipe.meal_type,
        "category": category,
        "season": recipe.season or "todo_el_año",
        "prep_time_minutes": recipe.prep_time_minutes,
        "servings": recipe.servings,
        "steps": steps,
        "photo_url": recipe.photo_url,
        "notes": recipe.notes,
        "is_favorite": recipe.is_favorite,
        "created_at": recipe.created_at,
        "ingredients": ingredients,
    }

@router.get("")
def list_recipes(
    search: Optional[str] = Query(None),
    meal_type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    max_prep_time: Optional[int] = Query(None),
    favorites_only: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(Recipe)
    if search:
        q = q.filter(Recipe.name.ilike(f"%{search}%"))
    if meal_type:
        q = q.filter(Recipe.meal_type == meal_type)
    if max_prep_time:
        q = q.filter(Recipe.prep_time_minutes <= max_prep_time)
    if favorites_only:
        q = q.filter(Recipe.is_favorite == True)
    recipes = q.order_by(Recipe.created_at.desc()).all()
    result = [recipe_to_response(r) for r in recipes]
    if category:
        result = [r for r in result if category in r["category"]]
    return result

@router.get("/search/by-ingredients")
def search_by_ingredients(
    ingredients: str = Query(..., description="Comma-separated ingredient names"),
    db: Session = Depends(get_db)
):
    ing_list = [i.strip().lower() for i in ingredients.split(",") if i.strip()]
    ing_objs = db.query(Ingredient).filter(Ingredient.name.in_(ing_list)).all()
    ing_ids = [i.id for i in ing_objs]
    if not ing_ids:
        return []
    recipe_ids = db.query(RecipeIngredient.recipe_id).filter(
        RecipeIngredient.ingredient_id.in_(ing_ids)
    ).group_by(RecipeIngredient.recipe_id).all()
    recipe_ids = [r[0] for r in recipe_ids]
    recipes = db.query(Recipe).filter(Recipe.id.in_(recipe_ids)).all()
    return [recipe_to_response(r) for r in recipes]

@router.get("/{recipe_id}")
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return recipe_to_response(recipe)

@router.post("")
def create_recipe(recipe_in: RecipeCreate, db: Session = Depends(get_db)):
    recipe = Recipe(
        name=recipe_in.name,
        meal_type=recipe_in.meal_type,
        category=json.dumps(recipe_in.category, ensure_ascii=False),
        season=recipe_in.season or "todo_el_año",
        prep_time_minutes=recipe_in.prep_time_minutes,
        servings=recipe_in.servings,
        steps=json.dumps(recipe_in.steps, ensure_ascii=False),
        photo_url=recipe_in.photo_url,
    )
    recipe.notes = recipe_in.notes
    db.add(recipe)
    db.flush()
    for ri_data in recipe_in.ingredients:
        if ri_data.ingredient_name:
            ing = get_or_create_ingredient(db, ri_data.ingredient_name)
            ri = RecipeIngredient(recipe_id=recipe.id, ingredient_id=ing.id, quantity=ri_data.quantity, unit=ri_data.unit)
            db.add(ri)
        elif ri_data.ingredient_id:
            ri = RecipeIngredient(recipe_id=recipe.id, ingredient_id=ri_data.ingredient_id, quantity=ri_data.quantity, unit=ri_data.unit)
            db.add(ri)
    db.commit()
    db.refresh(recipe)
    return recipe_to_response(recipe)

@router.put("/{recipe_id}")
def update_recipe(recipe_id: int, recipe_in: RecipeUpdate, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    if recipe_in.name is not None:
        recipe.name = recipe_in.name
    if recipe_in.meal_type is not None:
        recipe.meal_type = recipe_in.meal_type
    if recipe_in.category is not None:
        recipe.category = json.dumps(recipe_in.category, ensure_ascii=False)
    if recipe_in.prep_time_minutes is not None:
        recipe.prep_time_minutes = recipe_in.prep_time_minutes
    if recipe_in.servings is not None:
        recipe.servings = recipe_in.servings
    if recipe_in.steps is not None:
        recipe.steps = json.dumps(recipe_in.steps, ensure_ascii=False)
    if recipe_in.photo_url is not None:
        recipe.photo_url = recipe_in.photo_url
    if recipe_in.season is not None:
        recipe.season = recipe_in.season
    if recipe_in.notes is not None:
        recipe.notes = recipe_in.notes
    if recipe_in.ingredients is not None:
        db.query(RecipeIngredient).filter(RecipeIngredient.recipe_id == recipe_id).delete()
        for ri_data in recipe_in.ingredients:
            if ri_data.ingredient_name:
                ing = get_or_create_ingredient(db, ri_data.ingredient_name)
                ri = RecipeIngredient(recipe_id=recipe.id, ingredient_id=ing.id, quantity=ri_data.quantity, unit=ri_data.unit)
                db.add(ri)
    db.commit()
    db.refresh(recipe)
    return recipe_to_response(recipe)

@router.delete("/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    db.delete(recipe)
    db.commit()
    return {"message": "Receta eliminada"}

@router.post("/{recipe_id}/photo")
async def upload_recipe_photo(recipe_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    import os, uuid, shutil
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    path = os.path.join(upload_dir, filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    recipe.photo_url = f"/uploads/{filename}"
    db.commit()
    return {"photo_url": recipe.photo_url}

@router.post("/{recipe_id}/favorite")
def toggle_favorite(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    recipe.is_favorite = not recipe.is_favorite
    db.commit()
    return {"id": recipe.id, "is_favorite": recipe.is_favorite}
