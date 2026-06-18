import client from './client';
import { ShoppingItem } from '../types';

export const getShoppingList = (menuId: number) =>
  client.get<ShoppingItem[]>(`/shopping/${menuId}`).then(r => r.data);

export const generateShoppingList = (menuId: number) =>
  client.post<ShoppingItem[]>(`/shopping/generate/${menuId}`).then(r => r.data);

export const toggleShoppingItem = (menuId: number, itemId: number) =>
  client.put(`/shopping/${menuId}/items/${itemId}/check`).then(r => r.data);

export const deleteShoppingList = (menuId: number) =>
  client.delete(`/shopping/${menuId}`).then(r => r.data);
