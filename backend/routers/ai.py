import json
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Recipe
from schemas import GenerateFromIngredientsRequest, RecipeVariationRequest, SuggestMenuRequest

router = APIRouter(prefix="/ai", tags=["ai"])

def get_claude_client():
    import anthropic
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY no configurada")
    return anthropic.Anthropic(api_key=api_key)

@router.post("/generate-from-ingredients")
def generate_from_ingredients(data: GenerateFromIngredientsRequest, db: Session = Depends(get_db)):
    client = get_claude_client()
    ingredients_str = ", ".join(data.ingredients)
    prompt = f"""Eres un chef experto. Crea una receta de {data.meal_type} usando principalmente estos ingredientes: {ingredients_str}.
{"Preferencias adicionales: " + data.preferences if data.preferences else ""}

Responde SOLO con un JSON válido con esta estructura exacta:
{{
  "name": "Nombre del plato",
  "meal_type": "{data.meal_type}",
  "categories": ["categoría1"],
  "prep_time_minutes": 30,
  "servings": 4,
  "steps": ["Paso 1...", "Paso 2...", "Paso 3..."],
  "notes": "Notas opcionales",
  "ingredients": [
    {{"name": "ingrediente", "quantity": 200, "unit": "g"}}
  ]
}}"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )
    text = message.content[0].text.strip()
    # Extract JSON if wrapped in markdown
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    try:
        recipe_data = json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error parseando respuesta de IA")
    return recipe_data

@router.post("/recipe-variation")
def recipe_variation(data: RecipeVariationRequest, db: Session = Depends(get_db)):
    client = get_claude_client()
    recipe = db.query(Recipe).filter(Recipe.id == data.recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    ingredients = [
        {"name": ri.ingredient.name, "quantity": ri.quantity, "unit": ri.unit}
        for ri in recipe.ingredients
    ]
    original = {
        "name": recipe.name,
        "meal_type": recipe.meal_type,
        "categories": recipe.get_categories(),
        "prep_time_minutes": recipe.prep_time_minutes,
        "servings": recipe.servings,
        "steps": recipe.get_steps(),
        "ingredients": ingredients,
    }

    prompt = f"""Eres un chef experto. Toma esta receta y crea una variación: "{data.variation_request}".

Receta original:
{json.dumps(original, ensure_ascii=False, indent=2)}

Responde SOLO con un JSON válido con la misma estructura que la receta original, modificada según la petición."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )
    text = message.content[0].text.strip()
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    try:
        recipe_data = json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error parseando respuesta de IA")
    return recipe_data

@router.post("/suggest-weekly-menu")
def suggest_weekly_menu(data: SuggestMenuRequest, db: Session = Depends(get_db)):
    client = get_claude_client()
    all_recipes = db.query(Recipe).all()
    available = [
        {"id": r.id, "name": r.name, "meal_type": r.meal_type, "categories": r.get_categories()}
        for r in all_recipes
        if r.id not in data.excluded_recipe_ids
    ]

    prompt = f"""Eres un nutricionista y chef experto. Crea un menú semanal variado para 7 días (Lunes a Domingo) con comida y cena.

{"Preferencias: " + data.preferences if data.preferences else ""}
{"Temporada: " + data.season if data.season else ""}
{"Presupuesto: " + data.budget if data.budget else ""}

Recetas disponibles:
{json.dumps(available, ensure_ascii=False, indent=2)}

Instrucciones:
- No repitas el mismo plato en la semana
- Varía las proteínas y tipos de plato
- Responde SOLO con JSON válido:
{{
  "menu": [
    {{"day_of_week": 0, "meal_type": "comida", "recipe_id": 1}},
    {{"day_of_week": 0, "meal_type": "cena", "recipe_id": 2}},
    ...
  ],
  "notes": "Comentarios del menú"
}}

Si no hay suficientes recetas disponibles, usa las que haya repitiendo lo mínimo posible."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    text = message.content[0].text.strip()
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error parseando respuesta de IA")
    return result
