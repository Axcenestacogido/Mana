import os
import json
import base64
import httpx
from html.parser import HTMLParser
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import Recipe
from schemas import AIGenerateRequest, AIVariationRequest, AISuggestMenuRequest, AIImportFromURLRequest
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
  "menu": [
    {{"day_of_week": 0, "meal_type": "comida", "recipe_id": <id>}},
    {{"day_of_week": 0, "meal_type": "cena", "recipe_id": <id>}},
    {{"day_of_week": 1, "meal_type": "comida", "recipe_id": <id>}},
    {{"day_of_week": 1, "meal_type": "cena", "recipe_id": <id>}}
  ],
  "notes": "Nota breve sobre el menú"
}}

Incluye 14 entradas: comida y cena para los 7 días (day_of_week 0=Lunes a 6=Domingo). Usa solo IDs de las recetas listadas. Evita repetir recetas. No incluyas texto adicional, solo el JSON."""

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

    return menu_data


class _HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self._parts: list[str] = []
        self._skip_tags = {"script", "style", "nav", "footer", "header"}
        self._current_skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in self._skip_tags:
            self._current_skip += 1

    def handle_endtag(self, tag):
        if tag in self._skip_tags and self._current_skip > 0:
            self._current_skip -= 1

    def handle_data(self, data):
        if self._current_skip == 0:
            stripped = data.strip()
            if stripped:
                self._parts.append(stripped)

    def get_text(self) -> str:
        return " ".join(self._parts)


def _extract_recipe_from_text(client, text_content: str, source_hint: str = "") -> dict:
    prompt = f"""Eres un chef experto. Extrae la receta completa del siguiente texto{' (obtenido de ' + source_hint + ')' if source_hint else ''}.

TEXTO:
{text_content[:6000]}

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{{
  "name": "Nombre de la receta",
  "meal_type": "comida",
  "category": ["categoria1"],
  "prep_time_minutes": 30,
  "servings": 4,
  "steps": ["Paso 1: ...", "Paso 2: ..."],
  "ingredients": [
    {{"ingredient_name": "nombre", "quantity": 200, "unit": "gramos"}}
  ]
}}

Si no encuentras una receta clara en el texto, devuelve {{"error": "No se encontró ninguna receta"}}.
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
        data = json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Error al parsear respuesta de IA: {str(e)}")

    if "error" in data:
        raise HTTPException(status_code=422, detail=data["error"])

    return data


@router.post("/import-from-url")
async def import_from_url(req: AIImportFromURLRequest, db: Session = Depends(get_db)):
    client = get_client()
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as http:
            response = await http.get(req.url, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"No se pudo acceder a la URL: {str(e)}")

    extractor = _HTMLTextExtractor()
    extractor.feed(response.text)
    text_content = extractor.get_text()

    if len(text_content) < 50:
        raise HTTPException(status_code=422, detail="No se pudo extraer contenido útil de la página")

    return _extract_recipe_from_text(client, text_content, source_hint=req.url)


@router.post("/import-from-image")
async def import_from_image(file: UploadFile = File(...)):
    client = get_client()
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="La imagen no puede superar 10 MB")

    media_type = file.content_type or "image/jpeg"
    b64 = base64.standard_b64encode(contents).decode("utf-8")

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": media_type, "data": b64},
                },
                {
                    "type": "text",
                    "text": """Eres un chef experto. Analiza esta imagen que puede ser:
- Una foto de un plato de comida ya preparado
- Una receta escrita en papel, libro o pantalla
- Una fotografía de ingredientes

Si es una foto de un plato de comida, identifica el plato y crea una receta detallada para prepararlo.
Si es una receta escrita, extrae los datos tal como aparecen.
Si son ingredientes, sugiere una receta con ellos.

Responde ÚNICAMENTE con un JSON válido:
{
  "name": "Nombre de la receta o plato",
  "meal_type": "comida",
  "category": ["categoria1"],
  "prep_time_minutes": 30,
  "servings": 4,
  "steps": ["Paso 1: ...", "Paso 2: ..."],
  "ingredients": [
    {"ingredient_name": "nombre", "quantity": 200, "unit": "gramos"}
  ]
}

Solo devuelve {"error": "No se encontró ninguna receta"} si la imagen no tiene ninguna relación con comida o cocina.
Solo el JSON, sin texto adicional."""
                }
            ]
        }]
    )

    text = message.content[0].text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Error al parsear respuesta de IA: {str(e)}")

    if "error" in data:
        raise HTTPException(status_code=422, detail=data["error"])

    return data
