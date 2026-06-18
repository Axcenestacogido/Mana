import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getRecipes } from '../api/recipes'
import RecipeCard from '../components/RecipeCard'

export default function RecipesPage() {
  const [search, setSearch] = useState('')
  const [mealType, setMealType] = useState('')
  const [maxPrepTime, setMaxPrepTime] = useState('')

  const params: Record<string, string | number> = {}
  if (search) params.search = search
  if (mealType) params.meal_type = mealType
  if (maxPrepTime) params.max_prep_time = parseInt(maxPrepTime)

  const { data: recipes = [], isLoading, error } = useQuery({
    queryKey: ['recipes', params],
    queryFn: () => getRecipes(params),
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mis Recetas</h1>
        <Link to="/recipes/new" className="btn btn-primary">+ Nueva receta</Link>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar recetas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input"
          style={{ flex: '1', minWidth: '200px' }}
        />
        <select
          value={mealType}
          onChange={e => setMealType(e.target.value)}
          className="form-input"
          style={{ minWidth: '140px' }}
        >
          <option value="">Todos los tipos</option>
          <option value="comida">Comida</option>
          <option value="cena">Cena</option>
        </select>
        <input
          type="number"
          placeholder="Máx. minutos"
          value={maxPrepTime}
          onChange={e => setMaxPrepTime(e.target.value)}
          className="form-input"
          style={{ width: '140px' }}
          min={0}
        />
      </div>

      {isLoading && <div className="loading">Cargando recetas...</div>}
      {error && <div className="error-msg">Error al cargar recetas</div>}

      {!isLoading && !error && (
        <>
          {recipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>No se encontraron recetas</p>
              <Link to="/recipes/new" className="btn btn-primary">Crear primera receta</Link>
            </div>
          ) : (
            <div className="grid-recipes">
              {recipes.map((recipe: any) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
