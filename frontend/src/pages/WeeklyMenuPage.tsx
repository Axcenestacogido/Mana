import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, RefreshCw, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getMenus, createMenu, setMenuEntry, generateMenu } from '../api/menu'
import { getRecipes } from '../api/recipes'
import type { WeeklyMenu, Recipe } from '../types'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function getMonday(d = new Date()) {
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

export default function WeeklyMenuPage() {
  const qc = useQueryClient()
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const [dragging, setDragging] = useState<Recipe | null>(null)

  const { data: menus = [] } = useQuery({ queryKey: ['menus'], queryFn: getMenus })
  const { data: recipes = [] } = useQuery({ queryKey: ['recipes'], queryFn: () => getRecipes() })

  const activeMenu = menus.find(m => m.id === activeMenuId) ?? menus[0] ?? null

  const createMutation = useMutation({
    mutationFn: () => {
      const monday = getMonday()
      const dateStr = monday.toISOString().split('T')[0]
      return createMenu({ week_start_date: dateStr, name: `Semana del ${dateStr}` })
    },
    onSuccess: (m) => { qc.invalidateQueries({ queryKey: ['menus'] }); setActiveMenuId(m.id) },
  })

  const generateMutation = useMutation({
    mutationFn: () => generateMenu(activeMenu!.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }),
  })

  const setEntryMutation = useMutation({
    mutationFn: ({ day, meal, recipeId }: { day: number; meal: string; recipeId?: number }) =>
      setMenuEntry(activeMenu!.id, day, meal, recipeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }),
  })

  const getEntry = (menu: WeeklyMenu, day: number, meal: string) =>
    menu.entries.find(e => e.day_of_week === day && e.meal_type === meal)

  const handleDrop = (day: number, meal: string) => {
    if (dragging && activeMenu) {
      setEntryMutation.mutate({ day, meal, recipeId: dragging.id })
    }
    setDragging(null)
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Menú semanal</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeMenu && (
            <>
              <Link to={`/compra/${activeMenu.id}`}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: '1px solid #ddd', borderRadius: 8, background: 'white' }}>
                  <ShoppingCart size={16} /> Lista compra
                </button>
              </Link>
              <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: '1px solid #ddd', borderRadius: 8, background: 'white' }}>
                <RefreshCw size={16} /> {generateMutation.isPending ? 'Generando...' : 'Auto-generar'}
              </button>
            </>
          )}
          <button onClick={() => createMutation.mutate()}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#b5451b', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600 }}>
            <Plus size={16} /> Nuevo menú
          </button>
        </div>
      </div>

      {menus.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {menus.map(m => (
            <button key={m.id} onClick={() => setActiveMenuId(m.id)}
              style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid', fontSize: 13,
                background: (activeMenu?.id === m.id) ? '#b5451b' : 'white',
                color: (activeMenu?.id === m.id) ? 'white' : '#666',
                borderColor: (activeMenu?.id === m.id) ? '#b5451b' : '#ddd' }}>
              {m.name ?? m.week_start_date}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {DAYS.map((day, di) => (
          <div key={di}>
            <div style={{ textAlign: 'center', fontWeight: 600, padding: '8px 0', fontSize: 13, color: '#666' }}>{day}</div>
            {['comida', 'cena'].map(meal => {
              const entry = activeMenu ? getEntry(activeMenu, di, meal) : null
              return (
                <div key={meal}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(di, meal)}
                  onClick={() => entry?.recipe && setEntryMutation.mutate({ day: di, meal, recipeId: undefined })}
                  style={{
                    minHeight: 70, border: '2px dashed #e0d8d0', borderRadius: 8, padding: 6,
                    marginBottom: 6, background: entry?.recipe ? '#fef3ee' : 'white', cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}>
                  <div style={{ fontSize: 10, color: '#999', marginBottom: 4, textTransform: 'uppercase' }}>{meal}</div>
                  {entry?.recipe ? (
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#b5451b', lineHeight: 1.3 }}>{entry.recipe.name}</div>
                  ) : (
                    <div style={{ fontSize: 11, color: '#ccc' }}>Arrastra aquí</div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Recetas disponibles</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Arrastra una receta al tablero para asignarla</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {recipes.map(r => (
            <div key={r.id} draggable onDragStart={() => setDragging(r)}
              style={{ background: 'white', border: '1px solid #e5e0da', borderRadius: 8, padding: '8px 12px',
                fontSize: 13, cursor: 'grab', userSelect: 'none',
                borderLeft: `3px solid ${r.meal_type === 'comida' ? '#b5451b' : '#4a7c59'}` }}>
              {r.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
