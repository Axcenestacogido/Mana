import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getRecipes } from '../api/recipes'
import RecipeCard from '../components/RecipeCard'

export default function RecipesPage() {
  const [search, setSearch] = useState('')
  const [mealType, setMealType] = useState('')
  const [maxTime, setMaxTime] = useState('')

  const params: Record<string, string> = {}
  if (search) params.q = search
  if (mealType) params.meal_type = mealType
  if (maxTime) params.max_time = maxTime

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes', params],
    queryFn: () => getRecipes(params),
  })

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Mis recetas</h1>
        <Link to="/recetas/nueva">
          <button style={{ background: '#b5451b', color: 'white', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={18} /> Nueva receta
          </button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar receta..."
            style={{ width: '100%', padding: '9px 9px 9px 32px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}
          />
        </div>
        <select value={mealType} onChange={e => setMealType(e.target.value)}
          style={{ padding: '9px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
          <option value="">Todos los tipos</option>
          <option value="comida">Comida</option>
          <option value="cena">Cena</option>
          <option value="ambas">Ambas</option>
        </select>
        <select value={maxTime} onChange={e => setMaxTime(e.target.value)}
          style={{ padding: '9px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
          <option value="">Cualquier tiempo</option>
          <option value="15">Hasta 15 min</option>
          <option value="30">Hasta 30 min</option>
          <option value="60">Hasta 1 hora</option>
        </select>
      </div>

      {isLoading ? (
        <p>Cargando...</p>
      ) : recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          <p style={{ fontSize: 18, marginBottom: 8 }}>No hay recetas todavía</p>
          <p>Crea tu primera receta o usa la IA para generar una</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  )
}
