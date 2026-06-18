import client from './client'
import type { WeeklyMenu } from '../types'

export const getMenus = () =>
  client.get<WeeklyMenu[]>('/menu/').then(r => r.data)

export const getMenu = (id: number) =>
  client.get<WeeklyMenu>(`/menu/${id}`).then(r => r.data)

export const createMenu = (data: { week_start_date: string; name?: string }) =>
  client.post<WeeklyMenu>('/menu/', data).then(r => r.data)

export const setMenuEntry = (menuId: number, dayOfWeek: number, mealType: string, recipeId?: number) =>
  client.put(`/menu/${menuId}/entry`, null, {
    params: { day_of_week: dayOfWeek, meal_type: mealType, recipe_id: recipeId }
  }).then(r => r.data)

export const generateMenu = (menuId: number, rules?: Record<string, string>) =>
  client.post<WeeklyMenu>(`/menu/${menuId}/generate`, null, {
    params: { rules: rules ? JSON.stringify(rules) : undefined }
  }).then(r => r.data)

export const updateMenu = (id: number, data: { name?: string }) =>
  client.patch<{ id: number; name: string; week_start_date: string }>(`/menu/${id}`, data).then(r => r.data)

export const deleteMenu = (id: number) =>
  client.delete(`/menu/${id}`)

export const shareMenu = (id: number) =>
  client.post<{ token: string }>(`/menu/${id}/share`).then(r => r.data)

export const revokeShare = (id: number) =>
  client.delete(`/menu/${id}/share`).then(r => r.data)

export const getSharedMenu = (token: string) =>
  client.get<WeeklyMenu>(`/menu/shared/${token}`).then(r => r.data)
