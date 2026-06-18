import client from './client'
import type { Recipe, RecipeCreate } from '../types'

export const getRecipes = (params?: Record<string, string>) =>
  client.get<Recipe[]>('/recipes/', { params }).then(r => r.data)

export const getRecipe = (id: number) =>
  client.get<Recipe>(`/recipes/${id}`).then(r => r.data)

export const createRecipe = (data: RecipeCreate) =>
  client.post<Recipe>('/recipes/', data).then(r => r.data)

export const updateRecipe = (id: number, data: RecipeCreate) =>
  client.put<Recipe>(`/recipes/${id}`, data).then(r => r.data)

export const deleteRecipe = (id: number) =>
  client.delete(`/recipes/${id}`)
