import client from './client'

export const generateFromIngredients = (data: { ingredients: string[]; meal_type: string; preferences: string }) =>
  client.post('/ai/generate-from-ingredients', data).then(r => r.data)

export const recipeVariation = (data: { recipe_id: number; variation_request: string }) =>
  client.post('/ai/recipe-variation', data).then(r => r.data)

export const suggestWeeklyMenu = (data: { preferences: string; season: string; budget: string; excluded_recipe_ids: number[] }) =>
  client.post('/ai/suggest-weekly-menu', data).then(r => r.data)

export const importFromImage = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return client.post('/ai/import-from-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}

export const importFromUrl = (url: string) =>
  client.post('/ai/import-from-url', { url }).then(r => r.data)
