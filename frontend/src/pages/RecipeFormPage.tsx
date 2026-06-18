import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { getRecipe, createRecipe, updateRecipe } from '../api/recipes'
import type { RecipeCreate, Ingredient } from '../types'

const CATEGORIES = ['vegetariano', 'vegano', 'rápido', 'de fiesta', 'dieta especial', 'pescado', 'carne', 'sin gluten']

export default function RecipeFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: existing } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(Number(id)),
    enabled: isEdit,
  })

  const [form, setForm] = useState<RecipeCreate>({
    name: '', meal_type: 'comida', categories: [], prep_time_minutes: 30,
    servings: 4, steps: [''], ingredients: [], photo_url: '', notes: '',
  })

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name, meal_type: existing.meal_type, categories: existing.categories,
        prep_time_minutes: existing.prep_time_minutes, servings: existing.servings,
        steps: existing.steps.length ? existing.steps : [''],
        ingredients: existing.ingredients, photo_url: existing.photo_url ?? '', notes: existing.notes ?? '',
      })
    }
  }, [existing])

  const mutation = useMutation({
    mutationFn: (data: RecipeCreate) => isEdit ? updateRecipe(Number(id), data) : createRecipe(data),
    onSuccess: (r) => { qc.invalidateQueries({ queryKey: ['recipes'] }); navigate(`/recetas/${r.id}`) },
  })

  const setField = (k: keyof RecipeCreate, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const toggleCat = (cat: string) => setField('categories', form.categories.includes(cat) ? form.categories.filter(c => c !== cat) : [...form.categories, cat])
  const setStep = (i: number, v: string) => { const s = [...form.steps]; s[i] = v; setField('steps', s) }
  const addStep = () => setField('steps', [...form.steps, ''])
  const removeStep = (i: number) => setField('steps', form.steps.filter((_, j) => j !== i))
  const setIng = (i: number, field: keyof Ingredient, v: string) => {
    const ings = [...form.ingredients] as Ingredient[]
    ings[i] = { ...ings[i], [field]: field === 'quantity' ? Number(v) : v }
    setField('ingredients', ings)
  }
  const addIng = () => setField('ingredients', [...form.ingredients, { name: '' }])
  const removeIng = (i: number) => setField('ingredients', form.ingredients.filter((_, j) => j !== i))

  const inp = (style?: React.CSSProperties) => ({ style: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, width: '100%', ...style } })

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24 }}>{isEdit ? 'Editar receta' : 'Nueva receta'}</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Nombre *</label>
          <input {...inp()} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Nombre del plato" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Tipo</label>
            <select {...inp()} value={form.meal_type} onChange={e => setField('meal_type', e.target.value)}>
              <option value="comida">Comida</option>
              <option value="cena">Cena</option>
              <option value="ambas">Ambas</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Tiempo (min)</label>
            <input {...inp()} type="number" value={form.prep_time_minutes} onChange={e => setField('prep_time_minutes', Number(e.target.value))} />
          </div>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Porciones</label>
            <input {...inp()} type="number" value={form.servings} onChange={e => setField('servings', Number(e.target.value))} />
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Categorías</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} type="button" onClick={() => toggleCat(c)}
                style={{ padding: '5px 12px', borderRadius: 99, border: '1px solid', fontSize: 13,
                  background: form.categories.includes(c) ? '#b5451b' : 'white',
                  color: form.categories.includes(c) ? 'white' : '#666',
                  borderColor: form.categories.includes(c) ? '#b5451b' : '#ddd' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Foto URL</label>
          <input {...inp()} value={form.photo_url} onChange={e => setField('photo_url', e.target.value)} placeholder="https://..." />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontWeight: 600 }}>Ingredientes</label>
            <button type="button" onClick={addIng} style={{ background: 'none', border: 'none', color: '#b5451b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Plus size={16} /> Añadir
            </button>
          </div>
          {form.ingredients.map((ing, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
              <input {...inp()} value={ing.name} onChange={e => setIng(i, 'name', e.target.value)} placeholder="Ingrediente" />
              <input {...inp()} type="number" value={ing.quantity ?? ''} onChange={e => setIng(i, 'quantity', e.target.value)} placeholder="Cant." />
              <input {...inp()} value={ing.unit ?? ''} onChange={e => setIng(i, 'unit', e.target.value)} placeholder="Unidad" />
              <button type="button" onClick={() => removeIng(i)} style={{ background: 'none', border: 'none', color: '#c00' }}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontWeight: 600 }}>Pasos de preparación</label>
            <button type="button" onClick={addStep} style={{ background: 'none', border: 'none', color: '#b5451b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Plus size={16} /> Añadir paso
            </button>
          </div>
          {form.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <span style={{ width: 24, height: 24, background: '#b5451b', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, marginTop: 8 }}>{i + 1}</span>
              <textarea value={step} onChange={e => setStep(i, e.target.value)} rows={2}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical' }} />
              <button type="button" onClick={() => removeStep(i)} style={{ background: 'none', border: 'none', color: '#c00', marginTop: 8 }}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Notas</label>
          <textarea {...inp()} value={form.notes} onChange={e => setField('notes', e.target.value)} rows={3} placeholder="Consejos, variaciones..." />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: 8, background: 'white' }}>Cancelar</button>
          <button type="button" onClick={() => mutation.mutate(form)} disabled={!form.name || mutation.isPending}
            style={{ padding: '10px 20px', background: '#b5451b', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600 }}>
            {mutation.isPending ? 'Guardando...' : 'Guardar receta'}
          </button>
        </div>
      </div>
    </div>
  )
}
