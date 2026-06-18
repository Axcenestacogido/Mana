import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
from models import Recipe, Ingredient, RecipeIngredient
from schemas import RecipeCreate, RecipeOut, RecipeUpdate

router = APIRouter(prefix="/recipes", tags=["recipes"])

def _upsert_ingredient(db: Session, name: str) -> Ingredient:
    ing = db.query(Ingredient).filter(Ingredient.name == name.lower().strip()).first()
    if not ing:
        ing = Ingredient(name=name.lower().strip())
        db.add(ing)
        db.flush()
    return ing

def _recipe_to_out(recipe: Recipe) -> dict:
    return {
        "id": recipe.id,
        "name": recipe.name,
        "meal_type": recipe.meal_type,
        "categories": recipe.get_categories(),
        "prep_time_minutes": recipe.prep_time_minutes,
        "servings": recipe.servings,
        "steps": recipe.get_steps(),
        "photo_url": recipe.photo_url,
        "notes": recipe.notes,
        "created_at": recipe.created_at,
        "ingredients": [
            {"name": ri.ingredient.name, "quantity": ri.quantity, "unit": ri.unit}
            for ri in recipe.ingredients
        ],
    }

@router.get("/", response_model=List[RecipeOut])
def list_recipes(
    q: Optional[str] = Query(None),
    meal_type: Optional[str] = Query(None),
    max_time: Optional[int] = Query(None),
    ingredient: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Recipe)
    if q:
        query = query.filter(Recipe.name.ilike(f"%{q}%"))
    if meal_type:
        query = query.filter(Recipe.meal_type == meal_type)
    if max_time:
        query = query.filter(Recipe.prep_time_minutes <= max_time)
    if ingredient:
        query = query.join(Recipe.ingredients).join(RecipeIngredient.ingredient).filter(
            Ingredient.name.ilike(f"%{ingredient}%")
        )
    recipes = query.all()
    return [_recipe_to_out(r) for r in recipes]

@router.get("/{recipe_id}", response_model=RecipeOut)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return _recipe_to_out(recipe)

@router.post("/", response_model=RecipeOut, status_code=201)
def create_recipe(data: RecipeCreate, db: Session = Depends(get_db)):
    recipe = Recipe(
        name=data.name,
        meal_type=data.meal_type,
        categories=json.dumps(data.categories),
        prep_time_minutes=data.prep_time_minutes,
        servings=data.servings,
        steps=json.dumps(data.steps),
        photo_url=data.photo_url,
        notes=data.notes,
    )
    db.add(recipe)
    db.flush()
    for item in data.ingredients:
        ing = _upsert_ingredient(db, item.name)
        ri = RecipeIngredient(recipe_id=recipe.id, ingredient_id=ing.id, quantity=item.quantity, unit=item.unit)
        db.add(ri)
    db.commit()
    db.refresh(recipe)
    return _recipe_to_out(recipe)

@router.put("/{recipe_id}", response_model=RecipeOut)
def update_recipe(recipe_id: int, data: RecipeUpdate, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    recipe.name = data.name
    recipe.meal_type = data.meal_type
    recipe.categories = json.dumps(data.categories)
    recipe.prep_time_minutes = data.prep_time_minutes
    recipe.servings = data.servings
    recipe.steps = json.dumps(data.steps)
    recipe.photo_url = data.photo_url
    recipe.notes = data.notes
    db.query(RecipeIngredient).filter(RecipeIngredient.recipe_id == recipe_id).delete()
    for item in data.ingredients:
        ing = _upsert_ingredient(db, item.name)
        ri = RecipeIngredient(recipe_id=recipe.id, ingredient_id=ing.id, quantity=item.quantity, unit=item.unit)
        db.add(ri)
    db.commit()
    db.refresh(recipe)
    return _recipe_to_out(recipe)

@router.delete("/{recipe_id}", status_code=204)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    db.delete(recipe)
    db.commit()
