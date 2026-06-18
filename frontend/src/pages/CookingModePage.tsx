import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRecipe } from '../api/recipes'

export default function CookingModePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const wakeLockRef = useRef<any>(null)

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(parseInt(id!)),
    enabled: !!id,
  })

  useEffect(() => {
    // Request wake lock if supported
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen')
        }
      } catch (e) {
        // Wake lock not available or denied — ignore silently
      }
    }
    requestWakeLock()

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {})
        wakeLockRef.current = null
      }
    }
  }, [])

  if (isLoading) return <div className="loading">Cargando receta...</div>
  if (error || !recipe) return <div className="error-msg">Receta no encontrada</div>

  const steps = recipe.steps
  const totalSteps = steps.length

  if (totalSteps === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ marginBottom: '1rem', color: '#6b7280' }}>Esta receta no tiene pasos de preparación</p>
        <button onClick={() => navigate(`/recipes/${id}`)} className="btn btn-secondary">Volver</button>
      </div>
    )
  }

  const handlePrev = () => setCurrentStep(s => Math.max(0, s - 1))
  const handleNext = () => setCurrentStep(s => Math.min(totalSteps - 1, s + 1))

  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
        <button onClick={() => navigate(`/recipes/${id}`)} className="btn btn-secondary">
          ← Volver
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{recipe.name}</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Modo cocina</p>
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
          {currentStep + 1} / {totalSteps}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '999px', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${((currentStep + 1) / totalSteps) * 100}%`,
          background: '#16a34a',
          borderRadius: '999px',
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Current step — big */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center', marginBottom: '1.5rem', minHeight: '280px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#16a34a',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          {currentStep + 1}
        </div>
        <p style={{ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', lineHeight: 1.7, fontWeight: 400, maxWidth: '600px' }}>
          {steps[currentStep]}
        </p>
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0 1.5rem' }}>
        <button
          onClick={handlePrev}
          disabled={isFirst}
          className="btn btn-secondary"
          style={{ opacity: isFirst ? 0.4 : 1, padding: '0.75rem 1.5rem', fontSize: '1rem' }}
        >
          ← Anterior
        </button>

        {isLast ? (
          <button
            onClick={() => navigate(`/recipes/${id}`)}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
          >
            ✅ Finalizar
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
          >
            Siguiente →
          </button>
        )}
      </div>

      {/* Dimmed other steps */}
      {totalSteps > 1 && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: 500 }}>Todos los pasos:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {steps.map((step, i) => (
              <div
                key={i}
                onClick={() => setCurrentStep(i)}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: i === currentStep ? 1 : i < currentStep ? 0.4 : 0.6,
                  background: i === currentStep ? '#dcfce7' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{
                  flexShrink: 0,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: i < currentStep ? '#16a34a' : i === currentStep ? '#16a34a' : '#e5e7eb',
                  color: i <= currentStep ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {i < currentStep ? '✓' : i + 1}
                </span>
                <span style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
