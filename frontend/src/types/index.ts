export interface Ingredient {
  name: string
  quantity?: number
  unit?: string
}

export interface Recipe {
  id: number
  name: string
  meal_type: string
  categories: string[]
  prep_time_minutes: number
  servings: number
  steps: string[]
  photo_url?: string
  notes?: string
  created_at: string
  ingredients: Ingredient[]
}

export interface RecipeCreate {
  name: string
  meal_type: string
  categories: string[]
  prep_time_minutes: number
  servings: number
  steps: string[]
  photo_url?: string
  notes?: string
  ingredients: Ingredient[]
}

export interface MenuEntry {
  id: number
  day_of_week: number
  meal_type: string
  recipe_id?: number
  recipe?: Recipe
}

export interface WeeklyMenu {
  id: number
  name?: string
  week_start_date: string
  created_at: string
  entries: MenuEntry[]
}

export interface ShoppingItem {
  ingredient_name: string
  total_quantity?: number
  unit?: string
}
