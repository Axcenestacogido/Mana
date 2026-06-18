import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Users } from 'lucide-react'
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
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen')
        }
      } catch (_) {}
    }
    requestWakeLock()
    return () => {
      if (wakeLockRef.current) { wakeLockRef.current.release().catch(() => {}); wakeLockRef.current = null }
    }
  }, [])

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-canvas)' }}>
      <div className="loading">Cargando receta…</div>
    </div>
  )
  if (error || !recipe) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-canvas)' }}>
      <div className="error-msg">Receta no encontrada</div>
    </div>
  )

  const steps = recipe.steps
  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  if (totalSteps === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 'var(--space-4)', background: 'var(--bg-canvas)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Esta receta no tiene pasos de preparación</p>
        <button onClick={() => navigate(`/recetas/${id}`)} className="btn btn-secondary btn-md">Volver</button>
      </div>
    )
  }

  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)',
        padding: '0 var(--space-8)', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: 'var(--shadow-xs)',
      }}>
        <button onClick={() => navigate(`/recetas/${id}`)} className="btn btn-secondary btn-md">
          <ArrowLeft size={15} /> Volver
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
            {recipe.name}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Modo cocina</div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {recipe.prep_time_minutes} min</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} /> {recipe.servings} porciones</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--neutral-200)' }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: 'var(--primary)',
          transition: 'width var(--dur-slow) var(--ease-standard)',
        }} />
      </div>

      <div style={{ flex: 1, maxWidth: 800, margin: '0 auto', width: '100%', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {steps.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{
                flex: 1, height: 4, borderRadius: 'var(--radius-full)',
                background: i <= currentStep ? 'var(--primary)' : 'var(--neutral-200)',
                cursor: 'pointer',
                transition: 'background var(--dur-normal)',
              }}
            />
          ))}
        </div>

        {/* Current step */}
        <div className="card" style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: 'var(--space-10) var(--space-8)',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', minHeight: 300,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 'var(--radius-full)',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-semibold)',
            marginBottom: 'var(--space-6)',
          }}>
            {currentStep + 1}
          </div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.125rem, 2.5vw, 1.75rem)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--text-strong)', maxWidth: 600,
          }}>
            {steps[currentStep]}
          </p>
          <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-subtle)' }}>
            Paso {currentStep + 1} de {totalSteps}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={isFirst}
            className="btn btn-secondary btn-lg"
          >
            <ArrowLeft size={17} /> Anterior
          </button>
          {isLast ? (
            <button onClick={() => navigate(`/recetas/${id}`)} className="btn btn-sage btn-lg">
              <CheckCircle2 size={17} /> ¡Listo!
            </button>
          ) : (
            <button onClick={() => setCurrentStep(s => Math.min(totalSteps - 1, s + 1))} className="btn btn-primary btn-lg">
              Siguiente <ArrowRight size={17} />
            </button>
          )}
        </div>

        {/* All steps list */}
        {totalSteps > 1 && (
          <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 'var(--space-3)' }}>
              Todos los pasos
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  style={{
                    display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
                    padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    opacity: i === currentStep ? 1 : i < currentStep ? 0.45 : 0.65,
                    background: i === currentStep ? 'var(--primary-soft)' : 'transparent',
                    transition: 'all var(--dur-fast)',
                  }}
                >
                  <span style={{
                    flexShrink: 0, width: 24, height: 24, borderRadius: 'var(--radius-full)',
                    background: i < currentStep ? 'var(--primary)' : i === currentStep ? 'var(--primary)' : 'var(--neutral-200)',
                    color: i <= currentStep ? 'white' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)',
                  }}>
                    {i < currentStep ? <CheckCircle2 size={14} /> : i + 1}
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-body)' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
