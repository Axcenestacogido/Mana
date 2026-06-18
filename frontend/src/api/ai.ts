import client from './client'

export const generateFromIngredients = (data: { ingredients: string[]; meal_type: string; preferences: string }) =>
  client.post('/ai/generate-from-ingredients', data).then(r => r.data)

export const recipeVariation = (data: { recipe_id: number; variation_request: string }) =>
  client.post('/ai/recipe-variation', data).then(r => r.data)

export const suggestWeeklyMenu = (data: { preferences: string; season: string; budget: string; excluded_recipe_ids: number[] }) =>
  client.post('/ai/suggest-weekly-menu', data).then(r => r.data)
