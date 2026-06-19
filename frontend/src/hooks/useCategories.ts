import { useState, useEffect } from 'react'

const STORAGE_KEY = 'mana_categories'
const DEFAULT_CATEGORIES = ['Legumbres', 'Arroz', 'Pasta', 'Cremas y Sopas', 'Verdura', 'Carne', 'Pescado']

export function useCategories() {
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES
    } catch {
      return DEFAULT_CATEGORIES
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  }, [categories])

  const addCategory = (name: string) => {
    const trimmed = name.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed])
    }
  }

  const removeCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c !== name))
  }

  const resetCategories = () => {
    setCategories(DEFAULT_CATEGORIES)
  }

  return { categories, addCategory, removeCategory, resetCategories }
}
