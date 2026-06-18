from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class IngredientItem(BaseModel):
    name: str
    quantity: Optional[float] = None
    unit: Optional[str] = None

class RecipeBase(BaseModel):
    name: str
    meal_type: str = "comida"
    categories: List[str] = []
    prep_time_minutes: int = 30
    servings: int = 4
    steps: List[str] = []
    photo_url: Optional[str] = None
    notes: Optional[str] = None

class RecipeCreate(RecipeBase):
    ingredients: List[IngredientItem] = []

class RecipeUpdate(RecipeCreate):
    pass

class RecipeIngredientOut(BaseModel):
    name: str
    quantity: Optional[float]
    unit: Optional[str]
    model_config = {"from_attributes": True}

class RecipeOut(RecipeBase):
    id: int
    ingredients: List[RecipeIngredientOut] = []
    created_at: datetime
    model_config = {"from_attributes": True}

class MenuEntryBase(BaseModel):
    day_of_week: int
    meal_type: str
    recipe_id: Optional[int] = None

class MenuEntryOut(MenuEntryBase):
    id: int
    recipe: Optional[RecipeOut] = None
    model_config = {"from_attributes": True}

class WeeklyMenuBase(BaseModel):
    week_start_date: date
    name: Optional[str] = None

class WeeklyMenuCreate(WeeklyMenuBase):
    pass

class WeeklyMenuOut(WeeklyMenuBase):
    id: int
    entries: List[MenuEntryOut] = []
    created_at: datetime
    model_config = {"from_attributes": True}

class ShoppingItem(BaseModel):
    ingredient_name: str
    total_quantity: Optional[float]
    unit: Optional[str]

class GenerateFromIngredientsRequest(BaseModel):
    ingredients: List[str]
    meal_type: str = "comida"
    preferences: str = ""

class RecipeVariationRequest(BaseModel):
    recipe_id: int
    variation_request: str

class SuggestMenuRequest(BaseModel):
    preferences: str = ""
    season: str = ""
    budget: str = ""
    excluded_recipe_ids: List[int] = []
