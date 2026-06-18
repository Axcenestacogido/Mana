import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRecipe, createRecipe, updateRecipe } from '../api/recipes'
import { RecipeIngredientInput } from '../types'

interface FormState {
  name: string
  meal_type: string
  category: string[]
  prep_time_minutes: number
  servings: number
  steps: string[]
  ingredients: RecipeIngredientInput[]
}

const defaultForm: FormState = {
  name: '',
  meal_type: 'comida',
  category: [],
  prep_time_minutes: 30,
  servings: 4,
  steps: [''],
  ingredients: [{ ingredient_name: '', quantity: 1, unit: 'unidades' }],
}

export default function RecipeFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = !!id && id !== 'new'

  const [form, setForm] = useState<FormState>(defaultForm)
  const [categoryInput, setCategoryInput] = useState('')
  const [error, setError] = useState('')

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
        prep_time_minutes: existingRecipe.prep_time_minutes,
        servings: existingRecipe.servings,
        steps: existingRecipe.steps.length > 0 ? existingRecipe.steps : [''],
        ingredients: existingRecipe.ingredients.length > 0
          ? existingRecipe.ingredients.map(i => ({ ingredient_name: i.ingredient_name, quantity: i.quantity, unit: i.unit }))
          : [{ ingredient_name: '', quantity: 1, unit: 'unidades' }],
      })
    }
  }, [existingRecipe])

  const createMutation = useMutation({
    mutationFn: (data: any) => createRecipe(data),
    onSuccess: (recipe) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      navigate(`/recipes/${recipe.id}`)
    },
    onError: (e: any) => setError(e?.response?.data?.detail || 'Error al guardar'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateRecipe(parseInt(id!), data),
    onSuccess: (recipe) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', id] })
      navigate(`/recipes/${recipe.id}`)
    },
    onError: (e: any) => setError(e?.response?.data?.detail || 'Error al actualizar'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      steps: form.steps.filter(s => s.trim()),
      ingredients: form.ingredients.filter(i => i.ingredient_name.trim()),
    }
    if (!payload.name.trim()) { setError('El nombre es obligatorio'); return }
    if (isEdit) updateMutation.mutate(payload)
    else createMutation.mutate(payload)
  }

  const addCategory = () => {
    const cat = categoryInput.trim()
    if (cat && !form.category.includes(cat)) {
      setForm(f => ({ ...f, category: [...f.category, cat] }))
      setCategoryInput('')
    }
  }

  const removeCategory = (cat: string) =>
    setForm(f => ({ ...f, category: f.category.filter(c => c !== cat) }))

  const updateStep = (i: number, val: string) =>
    setForm(f => { const steps = [...f.steps]; steps[i] = val; return { ...f, steps } })

  const addStep = () => setForm(f => ({ ...f, steps: [...f.steps, ''] }))
  const removeStep = (i: number) =>
    setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }))

  const updateIngredient = (i: number, field: keyof RecipeIngredientInput, val: string | number) => {
    setForm(f => {
      const ingredients = [...f.ingredients]
      ingredients[i] = { ...ingredients[i], [field]: val }
      return { ...f, ingredients }
    })
  }

  const addIngredient = () =>
    setForm(f => ({ ...f, ingredients: [...f.ingredients, { ingredient_name: '', quantity: 1, unit: 'unidades' }] }))

  const removeIngredient = (i: number) =>
    setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }))

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div style={{ maxWidth: '700px' }}>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Editar receta' : 'Nueva receta'}</h1>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">Cancelar</button>
      </div>

      <form onSubmit={handleSubmit} className="card">
        {error && <div className="error-msg" style={{ marginBottom: '1rem' }}>{error}</div>}

        <div className="form-group">
          <label className="form-label">Nombre *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="form-input"
            placeholder="Nombre de la receta"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Tipo de comida</label>
            <select
              value={form.meal_type}
              onChange={e => setForm(f => ({ ...f, meal_type: e.target.value }))}
              className="form-input"
            >
              <option value="comida">Comida</option>
              <option value="cena">Cena</option>
              <option value="ambos">Ambos</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tiempo (min)</label>
            <input
              type="number"
              value={form.prep_time_minutes}
              onChange={e => setForm(f => ({ ...f, prep_time_minutes: parseInt(e.target.value) || 0 }))}
              className="form-input"
              min={0}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Porciones</label>
            <input
              type="number"
              value={form.servings}
              onChange={e => setForm(f => ({ ...f, servings: parseInt(e.target.value) || 1 }))}
              className="form-input"
              min={1}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Categorías</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={categoryInput}
              onChange={e => setCategoryInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCategory() } }}
              className="form-input"
              placeholder="Añadir categoría..."
              style={{ flex: 1 }}
            />
            <button type="button" onClick={addCategory} className="btn btn-secondary">Añadir</button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {form.category.map(cat => (
              <span key={cat} className="badge badge-blue" style={{ gap: '0.25rem' }}>
                {cat}
                <button type="button" onClick={() => removeCategory(cat)} style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', marginLeft: '2px' }}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ingredientes</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {form.ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px auto', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={ing.ingredient_name}
                  onChange={e => updateIngredient(i, 'ingredient_name', e.target.value)}
                  className="form-input"
                  placeholder="Ingrediente"
                />
                <input
                  type="number"
                  value={ing.quantity}
                  onChange={e => updateIngredient(i, 'quantity', parseFloat(e.target.value) || 0)}
                  className="form-input"
                  step={0.1}
                  min={0}
                />
                <input
                  type="text"
                  value={ing.unit}
                  onChange={e => updateIngredient(i, 'unit', e.target.value)}
                  className="form-input"
                  placeholder="unidad"
                />
                <button type="button" onClick={() => removeIngredient(i)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              + Ingrediente
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Pasos de preparación</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {form.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ minWidth: '24px', fontWeight: 500, paddingTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>{i + 1}.</span>
                <textarea
                  value={step}
                  onChange={e => updateStep(i, e.target.value)}
                  className="form-input"
                  rows={2}
                  style={{ flex: 1, resize: 'vertical' }}
                  placeholder={`Paso ${i + 1}...`}
                />
                <button type="button" onClick={() => removeStep(i)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1.25rem', paddingTop: '0.375rem' }}>×</button>
              </div>
            ))}
            <button type="button" onClick={addStep} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              + Paso
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? 'Guardando...' : isEdit ? 'Actualizar receta' : 'Crear receta'}
          </button>
        </div>
      </form>
    </div>
  )
}
