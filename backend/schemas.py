import json
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, field_validator

class IngredientBase(BaseModel):
    name: str

class IngredientCreate(IngredientBase):
    pass

class IngredientResponse(IngredientBase):
    id: int
    model_config = {"from_attributes": True}

class RecipeIngredientBase(BaseModel):
    ingredient_id: Optional[int] = None
    ingredient_name: Optional[str] = None
    quantity: float = 1.0
    unit: str = "unidades"

class RecipeIngredientCreate(RecipeIngredientBase):
    pass

class RecipeIngredientResponse(BaseModel):
    id: int
    ingredient_id: int
    ingredient_name: str
    quantity: float
    unit: str
    model_config = {"from_attributes": True}

class RecipeBase(BaseModel):
    name: str
    meal_type: str = "comida"
    category: List[str] = []
    season: Optional[str] = "todo_el_año"
    prep_time_minutes: int = 30
    servings: int = 4
    steps: List[str] = []
    photo_url: Optional[str] = None

class RecipeCreate(RecipeBase):
    ingredients: List[RecipeIngredientCreate] = []
    notes: Optional[str] = None

class RecipeUpdate(BaseModel):
    name: Optional[str] = None
    meal_type: Optional[str] = None
    category: Optional[List[str]] = None
    season: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    servings: Optional[int] = None
    steps: Optional[List[str]] = None
    photo_url: Optional[str] = None
    notes: Optional[str] = None
    ingredients: Optional[List[RecipeIngredientCreate]] = None

class RecipeResponse(RecipeBase):
    id: int
    created_at: datetime
    ingredients: List[RecipeIngredientResponse] = []

    @field_validator("category", "steps", mode="before")
    @classmethod
    def parse_json(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v

    model_config = {"from_attributes": True}

class WeeklyMenuBase(BaseModel):
    week_start_date: str
    name: str = ""
    season: Optional[str] = None

class WeeklyMenuCreate(WeeklyMenuBase):
    pass

class MenuEntryBase(BaseModel):
    day_of_week: int
    meal_type: str
    recipe_id: int

class MenuEntryCreate(MenuEntryBase):
    pass

class MenuEntryResponse(MenuEntryBase):
    id: int
    recipe: Optional[RecipeResponse] = None
    model_config = {"from_attributes": True}

class WeeklyMenuResponse(WeeklyMenuBase):
    id: int
    created_at: datetime
    entries: List[MenuEntryResponse] = []
    model_config = {"from_attributes": True}

class ShoppingItemBase(BaseModel):
    ingredient_name: str
    total_quantity: float
    unit: str

class ShoppingItemResponse(ShoppingItemBase):
    id: int
    menu_id: int
    is_checked: bool
    model_config = {"from_attributes": True}

class AIGenerateRequest(BaseModel):
    ingredients: List[str]
    meal_type: str = "comida"
    preferences: str = ""

class AIVariationRequest(BaseModel):
    recipe_id: int
    variation_request: str

class AISuggestMenuRequest(BaseModel):
    preferences: str = ""
    season: str = ""
    budget: str = ""
    excluded_recipe_ids: List[int] = []

class AIImportFromURLRequest(BaseModel):
    url: str
