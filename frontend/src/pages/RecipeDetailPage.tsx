import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRecipe, deleteRecipe } from '../api/recipes'
import { createRecipeVariation } from '../api/ai'
import { createRecipe } from '../api/recipes'
import PortionScaler from '../components/PortionScaler'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showVariationModal, setShowVariationModal] = useState(false)
  const [variationRequest, setVariationRequest] = useState('')
  const [variationLoading, setVariationLoading] = useState(false)
  const [variationError, setVariationError] = useState('')

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(parseInt(id!)),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteRecipe(parseInt(id!)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      navigate('/')
    },
  })

  const handleDelete = () => {
    if (confirm('¿Eliminar esta receta? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate()
    }
  }

  const handleCreateVariation = async () => {
    if (!recipe || !variationRequest.trim()) return
    setVariationLoading(true)
    setVariationError('')
    try {
      const variation = await createRecipeVariation({ recipe_id: recipe.id, variation_request: variationRequest })
      const saved = await createRecipe({ ...variation, ingredients: variation.ingredients || [] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      setShowVariationModal(false)
      navigate(`/recipes/${saved.id}`)
    } catch (e: any) {
      setVariationError(e?.response?.data?.detail || 'Error al crear variación')
    } finally {
      setVariationLoading(false)
    }
  }

  if (isLoading) return <div className="loading">Cargando...</div>
  if (error || !recipe) return <div className="error-msg">Receta no encontrada</div>

  const mealBadge = recipe.meal_type === 'comida'
    ? { label: 'Comida', style: { background: '#dcfce7', color: '#15803d' } }
    : { label: 'Cena', style: { background: '#dbeafe', color: '#1d4ed8' } }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
          ← Volver
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>{recipe.name}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge" style={mealBadge.style}>{mealBadge.label}</span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>⏱ {recipe.prep_time_minutes} min</span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>👥 {recipe.servings} porciones</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link to={`/recipes/${recipe.id}/cook`} className="btn btn-primary">
              👨‍🍳 Modo Cocina
            </Link>
            <Link to={`/recipes/${recipe.id}/edit`} className="btn btn-secondary">
              ✏️ Editar
            </Link>
            <button onClick={() => setShowVariationModal(true)} className="btn btn-secondary">
              ✨ Variación IA
            </button>
            <button onClick={handleDelete} className="btn btn-danger" disabled={deleteMutation.isPending}>
              🗑 Eliminar
            </button>
          </div>
        </div>

        {recipe.category.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {recipe.category.map(cat => (
              <span key={cat} className="badge badge-blue">{cat}</span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div className="card">
          <h2 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Ingredientes</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {recipe.ingredients.map(ing => (
              <li key={ing.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.25rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ textTransform: 'capitalize' }}>{ing.ingredient_name}</span>
                <span style={{ fontWeight: 500 }}>{ing.quantity} {ing.unit}</span>
              </li>
            ))}
            {recipe.ingredients.length === 0 && (
              <li style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Sin ingredientes registrados</li>
            )}
          </ul>
        </div>

        <PortionScaler ingredients={recipe.ingredients} originalServings={recipe.servings} />
      </div>

      {recipe.steps.length > 0 && (
        <div className="card">
          <h2 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Preparación</h2>
          <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recipe.steps.map((step, i) => (
              <li key={i} style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {showVariationModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>Crear variación con IA</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Describe cómo quieres modificar la receta "{recipe.name}"
            </p>
            <textarea
              value={variationRequest}
              onChange={e => setVariationRequest(e.target.value)}
              placeholder="Ej: Versión vegetariana, sin gluten, más picante..."
              className="form-input"
              rows={3}
              style={{ width: '100%', resize: 'vertical', marginBottom: '0.75rem' }}
            />
            {variationError && <div className="error-msg" style={{ marginBottom: '0.75rem' }}>{variationError}</div>}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowVariationModal(false)} className="btn btn-secondary" disabled={variationLoading}>
                Cancelar
              </button>
              <button onClick={handleCreateVariation} className="btn btn-primary" disabled={variationLoading || !variationRequest.trim()}>
                {variationLoading ? 'Generando...' : '✨ Crear variación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
