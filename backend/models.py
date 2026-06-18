import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from database import Base

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    meal_type = Column(String, default="comida")  # comida / cena / ambas
    categories = Column(Text, default="[]")  # JSON list: vegetariano, rápido, etc.
    prep_time_minutes = Column(Integer, default=30)
    servings = Column(Integer, default=4)
    steps = Column(Text, default="[]")  # JSON list of step strings
    photo_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    ingredients = relationship("RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan")
    menu_entries = relationship("MenuEntry", back_populates="recipe")

    def get_categories(self):
        return json.loads(self.categories or "[]")

    def get_steps(self):
        return json.loads(self.steps or "[]")

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    recipes = relationship("RecipeIngredient", back_populates="ingredient")

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity = Column(Float, nullable=True)
    unit = Column(String, nullable=True)
    recipe = relationship("Recipe", back_populates="ingredients")
    ingredient = relationship("Ingredient", back_populates="recipes")

class WeeklyMenu(Base):
    __tablename__ = "weekly_menus"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    week_start_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    entries = relationship("MenuEntry", back_populates="menu", cascade="all, delete-orphan")

class MenuEntry(Base):
    __tablename__ = "menu_entries"
    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("weekly_menus.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Lunes, 6=Domingo
    meal_type = Column(String, nullable=False)  # comida / cena
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=True)
    menu = relationship("WeeklyMenu", back_populates="entries")
    recipe = relationship("Recipe", back_populates="menu_entries")
