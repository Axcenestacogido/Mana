import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ChefHat, Pencil, Sparkles, Trash2, Clock, Users, X } from 'lucide-react'
import { getRecipe, deleteRecipe } from '../api/recipes'
import { recipeVariation as createRecipeVariation } from '../api/ai'
import { createRecipe } from '../api/recipes'
import PortionScaler from '../components/PortionScaler'

const MEAL_CONFIG: Record<string, { label: string; badge: string }> = {
  comida:   { label: 'Comida',   badge: 'badge-primary' },
  cena:     { label: 'Cena',     badge: 'badge-info' },
  desayuno: { label: 'Desayuno', badge: 'badge-warning' },
}

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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['recipes'] }); navigate('/') },
  })

  const handleDelete = () => {
    if (confirm('¿Eliminar esta receta? Esta acción no se puede deshacer.')) deleteMutation.mutate()
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
      navigate(`/recetas/${saved.id}`)
    } catch (e: any) {
      setVariationError(e?.response?.data?.detail || 'Error al crear variación')
    } finally {
      setVariationLoading(false)
    }
  }

  if (isLoading) return <div className="loading">Cargando…</div>
  if (error || !recipe) return <div className="error-msg">Receta no encontrada</div>

  const config = MEAL_CONFIG[recipe.meal_type] ?? MEAL_CONFIG.comida

  return (
    <div style={{ maxWidth: 820 }}>
      <button onClick={() => navigate('/')} className="btn btn-ghost btn-md" style={{ marginBottom: 'var(--space-5)', gap: 6 }}>
        <ArrowLeft size={15} /> Volver a recetas
      </button>

      {/* Hero card */}
      <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ flex: 1 }}>
            <span className={`badge ${config.badge}`} style={{ marginBottom: 'var(--space-3)', display: 'inline-flex' }}>{config.label}</span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-semibold)',
              color: 'var(--text-strong)', lineHeight: 'var(--leading-snug)',
              letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-3)',
            }}>
              {recipe.name}
            </h1>
            <div style={{ display: 'flex', gap: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={14} strokeWidth={2} /> {recipe.prep_time_minutes} minutos
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Users size={14} strokeWidth={2} /> {recipe.servings} porciones
              </span>
            </div>
            {recipe.category.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
                {recipe.category.map(cat => (
                  <span key={cat} className="badge badge-sage">{cat}</span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', flexShrink: 0 }}>
            <Link to={`/recetas/${recipe.id}/cocinar`} className="btn btn-primary btn-md">
              <ChefHat size={15} /> Modo cocina
            </Link>
            <Link to={`/recetas/${recipe.id}/editar`} className="btn btn-secondary btn-md">
              <Pencil size={14} /> Editar
            </Link>
            <button onClick={() => setShowVariationModal(true)} className="btn btn-secondary btn-md">
              <Sparkles size={14} /> Variación IA
            </button>
            <button onClick={handleDelete} disabled={deleteMutation.isPending} className="btn btn-ghost btn-md" style={{ color: 'var(--danger)' }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients + scaler */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 'var(--space-4)' }}>
            Ingredientes
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
            {recipe.ingredients.map((ing, i) => (
              <li key={ing.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)',
                borderBottom: i < recipe.ingredients.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                <span style={{ textTransform: 'capitalize', color: 'var(--text-body)' }}>{ing.ingredient_name}</span>
                <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                  {ing.quantity} {ing.unit}
                </span>
              </li>
            ))}
            {recipe.ingredients.length === 0 && (
              <li style={{ color: 'var(--text-subtle)', fontSize: 'var(--text-sm)' }}>Sin ingredientes registrados</li>
            )}
          </ul>
        </div>

        <PortionScaler ingredients={recipe.ingredients} originalServings={recipe.servings} />
      </div>

      {/* Steps */}
      {recipe.steps.length > 0 && (
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 'var(--space-5)' }}>
            Preparación
          </h2>
          <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {recipe.steps.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: 'var(--radius-full)',
                  background: 'var(--primary-soft)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)',
                  marginTop: 2,
                }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1, fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-body)' }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Variation modal */}
      {showVariationModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(28,24,19,0.45)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 'var(--space-4)',
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 500, borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
                Crear variación con IA
              </h2>
              <button onClick={() => setShowVariationModal(false)} className="btn btn-ghost btn-sm">
                <X size={16} />
              </button>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-relaxed)' }}>
              Describe cómo quieres modificar «{recipe.name}»
            </p>
            <textarea
              value={variationRequest}
              onChange={e => setVariationRequest(e.target.value)}
              placeholder="Ej: Versión vegetariana, sin gluten, más picante…"
              className="form-input"
              rows={3}
              style={{ width: '100%', resize: 'vertical', marginBottom: 'var(--space-4)' }}
            />
            {variationError && <div className="error-msg" style={{ marginBottom: 'var(--space-4)' }}>{variationError}</div>}
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowVariationModal(false)} className="btn btn-secondary btn-md" disabled={variationLoading}>
                Cancelar
              </button>
              <button onClick={handleCreateVariation} className="btn btn-primary btn-md" disabled={variationLoading || !variationRequest.trim()}>
                <Sparkles size={15} /> {variationLoading ? 'Generando…' : 'Crear variación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
