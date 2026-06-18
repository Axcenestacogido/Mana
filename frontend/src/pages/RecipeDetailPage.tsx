import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock, Users, Edit, Trash2, ChefHat } from 'lucide-react'
import { getRecipe, deleteRecipe } from '../api/recipes'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [servings, setServings] = useState<number | null>(null)

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(Number(id)),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteRecipe(Number(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['recipes'] }); navigate('/') },
  })

  if (isLoading) return <div style={{ padding: 24 }}>Cargando...</div>
  if (!recipe) return <div style={{ padding: 24 }}>Receta no encontrada</div>

  const scale = servings ? servings / recipe.servings : 1
  const displayServings = servings ?? recipe.servings

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>{recipe.name}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/recetas/${id}/editar`}>
            <button style={{ background: '#f5f5f5', border: 'none', borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Edit size={16} /> Editar
            </button>
          </Link>
          <Link to={`/recetas/${id}/cocinar`}>
            <button style={{ background: '#b5451b', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ChefHat size={16} /> Cocinar
            </button>
          </Link>
          <button onClick={() => { if (confirm('¿Eliminar receta?')) deleteMutation.mutate() }}
            style={{ background: '#fee', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#c00' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {recipe.photo_url && (
        <img src={recipe.photo_url} alt={recipe.name} style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 12, marginBottom: 24 }} />
      )}

      <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16} /> {recipe.prep_time_minutes} minutos</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={16} />
          <button onClick={() => setServings(Math.max(1, displayServings - 1))} style={{ border: 'none', background: '#eee', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>-</button>
          <span style={{ margin: '0 6px', fontWeight: 600 }}>{displayServings} porciones</span>
          <button onClick={() => setServings(displayServings + 1)} style={{ border: 'none', background: '#eee', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>+</button>
        </span>
        {recipe.categories.map(c => (
          <span key={c} style={{ background: '#fef3ee', color: '#b5451b', borderRadius: 99, padding: '2px 10px', fontSize: 13 }}>{c}</span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Ingredientes</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recipe.ingredients.map((ing, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span>{ing.name}</span>
                <span style={{ color: '#666' }}>
                  {ing.quantity ? `${Math.round(ing.quantity * scale * 10) / 10} ${ing.unit ?? ''}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Preparación</h2>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recipe.steps.map((step, i) => (
              <li key={i} style={{ lineHeight: 1.6 }}>{step}</li>
            ))}
          </ol>
          {recipe.notes && <p style={{ marginTop: 16, padding: 12, background: '#fef3ee', borderRadius: 8, color: '#666' }}>{recipe.notes}</p>}
        </div>
      </div>
    </div>
  )
}
