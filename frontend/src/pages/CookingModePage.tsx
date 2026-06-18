import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getRecipe } from '../api/recipes'

export default function CookingModePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const { data: recipe } = useQuery({ queryKey: ['recipe', id], queryFn: () => getRecipe(Number(id)) })

  if (!recipe) return null
  const steps = recipe.steps
  const current = steps[step]
  const progress = ((step + 1) / steps.length) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>{recipe.name}</h2>
        <button onClick={() => navigate(`/recetas/${id}`)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <X size={18} /> Salir
        </button>
      </div>

      <div style={{ height: 4, background: '#333' }}>
        <div style={{ height: '100%', background: '#b5451b', transition: 'width 0.3s', width: `${progress}%` }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>Paso {step + 1} de {steps.length}</p>
        <p style={{ fontSize: 36, lineHeight: 1.5, textAlign: 'center', maxWidth: 700 }}>{current}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '32px 48px' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: 12, padding: '16px 32px', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, opacity: step === 0 ? 0.3 : 1 }}>
          <ChevronLeft size={24} /> Anterior
        </button>
        <button onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : navigate(`/recetas/${id}`)}
          style={{ background: '#b5451b', border: 'none', color: 'white', borderRadius: 12, padding: '16px 32px', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          {step < steps.length - 1 ? <><ChevronRight size={24} /> Siguiente</> : '¡Listo!'}
        </button>
      </div>
    </div>
  )
}
