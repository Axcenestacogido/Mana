import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    recipe_ingredients = relationship("RecipeIngredient", back_populates="ingredient")

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    meal_type = Column(String, nullable=False, default="comida")
    category = Column(Text, default="[]")
    prep_time_minutes = Column(Integer, default=30)
    servings = Column(Integer, default=4)
    steps = Column(Text, default="[]")
    photo_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    is_favorite = Column(Boolean, default=False)
    season = Column(String, nullable=True, default="todo_el_año")
    created_at = Column(DateTime, default=datetime.utcnow)
    recipe_ingredients = relationship("RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan")
    menu_entries = relationship("MenuEntry", back_populates="recipe")

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity = Column(Float, default=1.0)
    unit = Column(String, default="unidades")
    recipe = relationship("Recipe", back_populates="recipe_ingredients")
    ingredient = relationship("Ingredient", back_populates="recipe_ingredients")

class WeeklyMenu(Base):
    __tablename__ = "weekly_menus"
    id = Column(Integer, primary_key=True, index=True)
    week_start_date = Column(String, nullable=False)
    name = Column(String, default="")
    color = Column(String, nullable=True)
    share_token = Column(String, nullable=True, unique=True, index=True)
    season = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    entries = relationship("MenuEntry", back_populates="menu", cascade="all, delete-orphan")
    shopping_items = relationship("ShoppingList", back_populates="menu", cascade="all, delete-orphan")

class MenuEntry(Base):
    __tablename__ = "menu_entries"
    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("weekly_menus.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)
    meal_type = Column(String, nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    menu = relationship("WeeklyMenu", back_populates="entries")
    recipe = relationship("Recipe", back_populates="menu_entries")

class ShoppingList(Base):
    __tablename__ = "shopping_lists"
    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("weekly_menus.id"), nullable=False)
    ingredient_name = Column(String, nullable=False)
    total_quantity = Column(Float, default=0.0)
    unit = Column(String, default="")
    is_checked = Column(Boolean, default=False)
    category = Column(String, nullable=True)
    menu = relationship("WeeklyMenu", back_populates="shopping_items")
