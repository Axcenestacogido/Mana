import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { getRecipes } from '../api/recipes'
import RecipeCard from '../components/RecipeCard'

const MEAL_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'desayuno', label: 'Desayuno' },
  { value: 'comida', label: 'Comida' },
  { value: 'cena', label: 'Cena' },
]

export default function RecipesPage() {
  const [search, setSearch] = useState('')
  const [mealType, setMealType] = useState('')
  const [maxPrepTime, setMaxPrepTime] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  const params: Record<string, string | number | boolean> = {}
  if (search) params.search = search
  if (mealType) params.meal_type = mealType
  if (maxPrepTime) params.max_prep_time = parseInt(maxPrepTime)
  if (favoritesOnly) params.favorites_only = true

  const { data: recipes = [], isLoading, error } = useQuery({
    queryKey: ['recipes', params],
    queryFn: () => getRecipes(params),
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Recetas</h1>
          <p className="page-sub">{recipes.length} receta{recipes.length !== 1 ? 's' : ''} en tu colección</p>
        </div>
        <Link to="/recetas/nueva" className="btn btn-primary btn-md">
          <Plus size={16} strokeWidth={2.5} />
          Nueva receta
        </Link>
      </div>

      {/* Search + filters */}
      <div className="filters-row" style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-box" style={{ width: 'auto', flex: '1', minWidth: 200 }}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Buscar recetas…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {MEAL_FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-chip${mealType === f.value ? ' active' : ''}`}
              onClick={() => setMealType(f.value)}
            >
              {f.label}
            </button>
          ))}
          <button
            className={`filter-chip${favoritesOnly ? ' active' : ''}`}
            onClick={() => setFavoritesOnly(v => !v)}
          >
            ♥ Favoritos
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <SlidersHorizontal size={14} color="var(--text-muted)" />
          <input
            type="number"
            placeholder="Máx. min."
            value={maxPrepTime}
            onChange={e => setMaxPrepTime(e.target.value)}
            className="form-input"
            style={{ width: 110, height: 36, fontSize: 'var(--text-sm)' }}
            min={0}
          />
        </div>
      </div>

      {isLoading && <div className="loading">Cargando recetas…</div>}
      {error && <div className="error-msg">Error al cargar recetas</div>}

      {!isLoading && !error && (
        recipes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div className="empty-title">Sin recetas aún</div>
            <div className="empty-desc">Añade tu primera receta y empieza a organizar tu cocina.</div>
            <Link to="/recetas/nueva" className="btn btn-primary btn-md" style={{ marginTop: 'var(--space-2)' }}>
              <Plus size={16} strokeWidth={2.5} /> Crear primera receta
            </Link>
          </div>
        ) : (
          <div className="grid-recipes">
            {recipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
