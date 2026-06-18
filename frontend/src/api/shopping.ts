import client from './client'
import type { ShoppingItem } from '../types'

export const getShoppingList = (menuId: number) =>
  client.get<ShoppingItem[]>(`/shopping/${menuId}`).then(r => r.data)
