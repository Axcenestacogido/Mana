export interface Ingredient {
  id: number;
  name: string;
}

export interface RecipeIngredient {
  id: number;
  ingredient_id: number;
  ingredient_name: string;
  quantity: number;
  unit: string;
}

export interface RecipeIngredientInput {
  ingredient_name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: number;
  name: string;
  meal_type: string;
  category: string[];
  season: string;
  prep_time_minutes: number;
  servings: number;
  steps: string[];
  photo_url: string | null;
  notes?: string | null;
  is_favorite: boolean;
  created_at: string;
  ingredients: RecipeIngredient[];
}

export interface RecipeCreate {
  name: string;
  meal_type: string;
  category: string[];
  season: string;
  prep_time_minutes: number;
  servings: number;
  steps: string[];
  photo_url?: string;
  ingredients: RecipeIngredientInput[];
}

export interface MenuEntry {
  id: number;
  day_of_week: number;
  meal_type: string;
  recipe_id: number;
  recipe?: Recipe;
}

export interface WeeklyMenu {
  id: number;
  week_start_date: string;
  name: string;
  color?: string | null;
  created_at: string;
  entries: MenuEntry[];
}

export interface ShoppingItem {
  id: number;
  menu_id: number;
  ingredient_name: string;
  total_quantity: number;
  unit: string;
  is_checked: boolean;
  category?: string;
}

export interface RecipeWithNotes extends Recipe {
  notes?: string | null;
}

export interface AIGenerateRequest {
  ingredients: string[];
  meal_type: string;
  preferences: string;
}

export interface AIVariationRequest {
  recipe_id: number;
  variation_request: string;
}

export interface AISuggestMenuRequest {
  preferences: string;
  season: string;
  budget: string;
  excluded_recipe_ids: number[];
}
