import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, ArrowLeft, Save } from 'lucide-react'
import { getRecipe, createRecipe, updateRecipe } from '../api/recipes'
import { RecipeIngredientInput } from '../types'
import { useCategories } from '../hooks/useCategories'

interface FormState {
  name: string
  meal_type: string
  category: string[]
  season: string
  prep_time_minutes: number
  servings: number
  steps: string[]
  ingredients: RecipeIngredientInput[]
  notes: string
}

const defaultForm: FormState = {
  name: '',
  meal_type: 'comida',
  category: [],
  season: 'todo_el_año',
  prep_time_minutes: 30,
  servings: 4,
  steps: [''],
  ingredients: [{ ingredient_name: '', quantity: 1, unit: 'unidades' }],
  notes: '',
}

const SEASONS = [
  { value: 'todo_el_año', label: 'Todo el año' },
  { value: 'verano',      label: 'Verano' },
  { value: 'invierno',    label: 'Invierno' },
  { value: 'cuaresma',    label: 'Cuaresma' },
]

export default function RecipeFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = !!id && id !== 'new'

  const [form, setForm] = useState<FormState>(defaultForm)
  const [categoryInput, setCategoryInput] = useState('')
  const [formError, setFormError] = useState('')
  const { categories: availableCategories } = useCategories()

  const { data: existingRecipe } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(parseInt(id!)),
    enabled: isEdit,
  })

  useEffect(() => {
    if (existingRecipe) {
      setForm({
        name: existingRecipe.name,
        meal_type: existingRecipe.meal_type,
        category: existingRecipe.category,
        season: existingRecipe.season ?? 'todo_el_año',
        prep_time_minutes: existingRecipe.prep_time_minutes,
        servings: existingRecipe.servings,
        steps: existingRecipe.steps.length > 0 ? existingRecipe.steps : [''],
        ingredients: existingRecipe.ingredients.length > 0
          ? existingRecipe.ingredients.map(i => ({ ingredient_name: i.ingredient_name, quantity: i.quantity, unit: i.unit }))
          : [{ ingredient_name: '', quantity: 1, unit: 'unidades' }],
        notes: existingRecipe.notes ?? '',
      })
    }
  }, [existingRecipe])

  const createMutation = useMutation({
    mutationFn: (data: any) => createRecipe(data),
    onSuccess: (recipe) => { queryClient.invalidateQueries({ queryKey: ['recipes'] }); navigate(`/recetas/${recipe.id}`) },
    onError: (e: any) => setFormError(e?.response?.data?.detail || 'Error al guardar'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateRecipe(parseInt(id!), data),
    onSuccess: (recipe) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', id] })
      navigate(`/recetas/${recipe.id}`)
    },
    onError: (e: any) => setFormError(e?.response?.data?.detail || 'Error al actualizar'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    const payload = { ...form, steps: form.steps.filter(s => s.trim()), ingredients: form.ingredients.filter(i => i.ingredient_name.trim()) }
    if (!payload.name.trim()) { setFormError('El nombre es obligatorio'); return }
    if (isEdit) updateMutation.mutate(payload)
    else createMutation.mutate(payload)
  }

  const addCategory = () => {
    const cat = categoryInput.trim()
    if (cat && !form.category.includes(cat)) { setForm(f => ({ ...f, category: [...f.category, cat] })); setCategoryInput('') }
  }

  const updateStep = (i: number, val: string) => setForm(f => { const steps = [...f.steps]; steps[i] = val; return { ...f, steps } })
  const addStep = () => setForm(f => ({ ...f, steps: [...f.steps, ''] }))
  const removeStep = (i: number) => setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }))

  const updateIngredient = (i: number, field: keyof RecipeIngredientInput, val: string | number) => {
    setForm(f => { const ingredients = [...f.ingredients]; ingredients[i] = { ...ingredients[i], [field]: val }; return { ...f, ingredients } })
  }
  const addIngredient = () => setForm(f => ({ ...f, ingredients: [...f.ingredients, { ingredient_name: '', quantity: 1, unit: 'unidades' }] }))
  const removeIngredient = (i: number) => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }))

  const isPending = createMutation.isPending || updateMutation.isPending

  const inputStyle = { width: '100%' }

  return (
    <div style={{ maxWidth: 740 }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-md" style={{ marginBottom: 'var(--space-5)' }}>
        <ArrowLeft size={15} /> Volver
      </button>

      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Editar receta' : 'Nueva receta'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {formError && <div className="error-msg" style={{ marginBottom: 'var(--space-4)' }}>{formError}</div>}

        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 'var(--space-5)' }}>
            Información básica
          </h2>

          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="form-input" placeholder="Nombre de la receta" style={inputStyle} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tipo de comida</label>
              <select value={form.meal_type} onChange={e => setForm(f => ({ ...f, meal_type: e.target.value }))} className="form-input">
                <option value="comida">Comida</option>
                <option value="cena">Cena</option>
                <option value="ambas">Ambas</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Estación del año</label>
              <select value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value }))} className="form-input">
                {SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Tiempo (min)</label>
              <input type="number" value={form.prep_time_minutes} onChange={e => setForm(f => ({ ...f, prep_time_minutes: parseInt(e.target.value) || 0 }))}
                className="form-input" min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Porciones</label>
              <input type="number" value={form.servings} onChange={e => setForm(f => ({ ...f, servings: parseInt(e.target.value) || 1 }))}
                className="form-input" min={1} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notas personales</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="form-input" rows={3} style={{ resize: 'vertical' }}
              placeholder="Trucos, variaciones, tiempos reales…" />
          </div>

          <div className="form-group">
            <label className="form-label">Categorías</label>
            {availableCategories.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                {availableCategories.map(cat => {
                  const selected = form.category.includes(cat)
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(f => ({
                        ...f,
                        category: selected ? f.category.filter(c => c !== cat) : [...f.category, cat],
                      }))}
                      className={`filter-chip${selected ? ' active' : ''}`}
                      style={{ fontSize: 'var(--text-xs)' }}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <input type="text" value={categoryInput} onChange={e => setCategoryInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCategory() } }}
                className="form-input" placeholder="Categoría personalizada…" style={{ flex: 1 }} />
              <button type="button" onClick={addCategory} className="btn btn-secondary btn-md">Añadir</button>
            </div>
            {form.category.filter(c => !availableCategories.includes(c)).length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {form.category.filter(c => !availableCategories.includes(c)).map(cat => (
                  <span key={cat} className="badge badge-sage" style={{ gap: 6 }}>
                    {cat}
                    <button type="button" onClick={() => setForm(f => ({ ...f, category: f.category.filter(c => c !== cat) }))}
                      style={{ display: 'inline-flex', color: 'inherit', opacity: 0.7, padding: 0 }}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 'var(--space-5)' }}>
            Ingredientes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {form.ingredients.map((ing, i) => (
              <div key={i} className="ingredient-row" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 32px', gap: 'var(--space-2)', alignItems: 'center' }}>
                <input type="text" value={ing.ingredient_name} onChange={e => updateIngredient(i, 'ingredient_name', e.target.value)}
                  className="form-input" placeholder="Ingrediente" />
                <input type="number" value={ing.quantity} onChange={e => updateIngredient(i, 'quantity', parseFloat(e.target.value) || 0)}
                  className="form-input" step={0.1} min={0} />
                <input type="text" value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)}
                  className="form-input" placeholder="unidad" />
                <button type="button" onClick={() => removeIngredient(i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', width: 32, height: 32 }}>
                  <X size={15} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'var(--space-1)' }}>
              <Plus size={13} /> Ingrediente
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 'var(--space-5)' }}>
            Pasos de preparación
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {form.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: 'var(--radius-full)',
                  background: 'var(--primary-soft)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', marginTop: 8,
                }}>{i + 1}</span>
                <textarea value={step} onChange={e => updateStep(i, e.target.value)}
                  className="form-input" rows={2} style={{ flex: 1, resize: 'vertical' }}
                  placeholder={`Describe el paso ${i + 1}…`} />
                <button type="button" onClick={() => removeStep(i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)', marginTop: 8 }}>
                  <X size={15} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addStep} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'var(--space-1)' }}>
              <Plus size={13} /> Paso
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary btn-md">Cancelar</button>
          <button type="submit" className="btn btn-primary btn-md" disabled={isPending}>
            <Save size={15} /> {isPending ? 'Guardando…' : isEdit ? 'Actualizar receta' : 'Crear receta'}
          </button>
        </div>
      </form>
    </div>
  )
}
