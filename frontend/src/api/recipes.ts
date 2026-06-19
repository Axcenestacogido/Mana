import client from './client';
import { Recipe, RecipeCreate } from '../types';

export const getRecipes = (params?: Record<string, string | number | boolean>) =>
  client.get<Recipe[]>('/recipes', { params }).then(r => r.data);

export const getRecipe = (id: number) =>
  client.get<Recipe>(`/recipes/${id}`).then(r => r.data);

export const createRecipe = (data: RecipeCreate) =>
  client.post<Recipe>('/recipes', data).then(r => r.data);

export const updateRecipe = (id: number, data: Partial<RecipeCreate>) =>
  client.put<Recipe>(`/recipes/${id}`, data).then(r => r.data);

export const deleteRecipe = (id: number) =>
  client.delete(`/recipes/${id}`).then(r => r.data);

export const searchByIngredients = (ingredients: string) =>
  client.get<Recipe[]>('/recipes/search/by-ingredients', { params: { ingredients } }).then(r => r.data);

export const toggleFavorite = (id: number) =>
  client.post<Recipe>(`/recipes/${id}/favorite`).then(r => r.data);
