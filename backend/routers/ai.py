import os
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Recipe
from schemas import AIGenerateRequest, AIVariationRequest, AISuggestMenuRequest
import anthropic

router = APIRouter()

def get_client():
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY no configurada")
    return anthropic.Anthropic(api_key=api_key)

@router.post("/generate-from-ingredients")
async def generate_from_ingredients(req: AIGenerateRequest, db: Session = Depends(get_db)):
    client = get_client()
    prompt = f"""Eres un chef experto. Crea una receta deliciosa usando principalmente estos ingredientes: {', '.join(req.ingredients)}.
Tipo de comida: {req.meal_type}.
Preferencias adicionales: {req.preferences or 'Ninguna'}.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{{
  "name": "Nombre de la receta",
  "meal_type": "{req.meal_type}",
  "category": ["categoria1", "categoria2"],
  "prep_time_minutes": 30,
  "servings": 4,
  "steps": ["Paso 1: ...", "Paso 2: ...", "Paso 3: ..."],
  "ingredients": [
    {{"ingredient_name": "nombre", "quantity": 200, "unit": "gramos"}},
    {{"ingredient_name": "nombre2", "quantity": 2, "unit": "unidades"}}
  ]
}}

No incluyas texto adicional, solo el JSON."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()

    try:
        recipe_data = json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Error al parsear respuesta de IA: {str(e)}")

    return recipe_data

@router.post("/recipe-variation")
async def recipe_variation(req: AIVariationRequest, db: Session = Depends(get_db)):
    client = get_client()
    recipe = db.query(Recipe).filter(Recipe.id == req.recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    try:
        steps = json.loads(recipe.steps) if isinstance(recipe.steps, str) else recipe.steps
        category = json.loads(recipe.category) if isinstance(recipe.category, str) else recipe.category
    except Exception:
        steps = []
        category = []

    ingredients_info = []
    for ri in recipe.recipe_ingredients:
        ingredients_info.append(f"{ri.quantity} {ri.unit} de {ri.ingredient.name if ri.ingredient else 'ingrediente'}")

    recipe_text = f"""Nombre: {recipe.name}
Tipo: {recipe.meal_type}
Categorías: {', '.join(category)}
Tiempo de preparación: {recipe.prep_time_minutes} minutos
Porciones: {recipe.servings}
Ingredientes: {'; '.join(ingredients_info)}
Pasos: {'; '.join(steps)}"""

    prompt = f"""Eres un chef experto. Aquí está una receta original:
{recipe_text}

El usuario quiere esta variación: {req.variation_request}

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{{
  "name": "Nombre de la variación",
  "meal_type": "{recipe.meal_type}",
  "category": ["categoria1"],
  "prep_time_minutes": 30,
  "servings": {recipe.servings},
  "steps": ["Paso 1: ...", "Paso 2: ..."],
  "ingredients": [
    {{"ingredient_name": "nombre", "quantity": 200, "unit": "gramos"}}
  ]
}}

No incluyas texto adicional, solo el JSON."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()

    try:
        recipe_data = json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Error al parsear respuesta de IA: {str(e)}")

    return recipe_data

@router.post("/suggest-weekly-menu")
async def suggest_weekly_menu(req: AISuggestMenuRequest, db: Session = Depends(get_db)):
    client = get_client()
    all_recipes = db.query(Recipe).all()
    available = [r for r in all_recipes if r.id not in req.excluded_recipe_ids]

    if not available:
        raise HTTPException(status_code=400, detail="No hay recetas disponibles")

    recipe_list = []
    for r in available[:50]:
        recipe_list.append(f"ID:{r.id} - {r.name} ({r.meal_type}, {r.prep_time_minutes}min)")

    prompt = f"""Eres un nutricionista y chef experto. Crea un menú semanal equilibrado (Lunes a Domingo).
Recetas disponibles:
{chr(10).join(recipe_list)}

Preferencias: {req.preferences or 'Equilibrado y variado'}
Temporada: {req.season or 'Actual'}
Presupuesto: {req.budget or 'Moderado'}

Responde ÚNICAMENTE con un JSON válido:
{{
  "days": [
    {{
      "day_of_week": 0,
      "day_name": "Lunes",
      "comida_recipe_id": <id>,
      "cena_recipe_id": <id>
    }}
  ]
}}

Incluye los 7 días (0=Lunes a 6=Domingo). Usa solo IDs de las recetas listadas. Evita repetir recetas. No incluyas texto adicional, solo el JSON."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()

    try:
        menu_data = json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Error al parsear respuesta de IA: {str(e)}")

    recipe_map = {r.id: {"id": r.id, "name": r.name, "meal_type": r.meal_type, "prep_time_minutes": r.prep_time_minutes} for r in available}
    for day in menu_data.get("days", []):
        comida_id = day.get("comida_recipe_id")
        cena_id = day.get("cena_recipe_id")
        day["comida_recipe"] = recipe_map.get(comida_id)
        day["cena_recipe"] = recipe_map.get(cena_id)

    return menu_data
