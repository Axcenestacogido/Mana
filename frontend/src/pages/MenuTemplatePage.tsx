import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RefreshCw, RotateCcw, Wand2 } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import { createMenu, generateMenu } from '../api/menu'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEAL_GROUPS = [
  { key: 'comida', label: 'Comida', slots: ['comida_primero', 'comida_segundo'] as const },
  { key: 'cena',   label: 'Cena',   slots: ['cena_primero',   'cena_segundo']   as const },
] as const

const SEASONS = [
  { value: '',             label: 'Cualquier estación' },
  { value: 'primavera',    label: '🌸 Primavera' },
  { value: 'verano',       label: '☀️ Verano' },
  { value: 'otoño',        label: '🍂 Otoño' },
  { value: 'invierno',     label: '❄️ Invierno' },
]

const TEMPLATE_KEY = 'mana_menu_template'

function loadTemplate(): { rules: Record<string, string>; season: string } {
  try {
    const stored = localStorage.getItem(TEMPLATE_KEY)
    return stored ? JSON.parse(stored) : { rules: {}, season: '' }
  } catch {
    return { rules: {}, season: '' }
  }
}

function saveTemplate(rules: Record<string, string>, season: string) {
  localStorage.setItem(TEMPLATE_KEY, JSON.stringify({ rules, season }))
}

export default function MenuTemplatePage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { categories } = useCategories()

  const saved = loadTemplate()
  const [rules, setRules] = useState<Record<string, string>>(saved.rules)
  const [season, setSeason] = useState(saved.season)
  const [saved2, setSaved2] = useState(false)

  const setRule = (slotKey: string, value: string) => {
    setRules(prev => {
      const next = { ...prev }
      if (value) next[slotKey] = value
      else delete next[slotKey]
      return next
    })
  }

  const handleSave = () => {
    saveTemplate(rules, season)
    setSaved2(true)
    setTimeout(() => setSaved2(false), 1800)
  }

  const handleReset = () => {
    setRules({})
    setSeason('')
    saveTemplate({}, '')
  }

  const generateMutation = useMutation({
    mutationFn: async () => {
      saveTemplate(rules, season)
      const monday = getMonday()
      const dateStr = monday.toISOString().split('T')[0]
      const menu = await createMenu({ week_start_date: dateStr, name: `Semana del ${dateStr}` })
      return generateMenu(menu.id, rules, season)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menus'] })
      navigate('/menu')
    },
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Plantilla de menú</h1>
          <p className="page-sub">Asigna una categoría a cada hueco y genera un menú variado automáticamente</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <button onClick={handleReset} className="btn btn-ghost btn-md">
            <RotateCcw size={14} /> Limpiar
          </button>
          <button onClick={handleSave} className="btn btn-secondary btn-md">
            {saved2 ? '✓ Guardado' : 'Guardar plantilla'}
          </button>
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="btn btn-primary btn-md"
          >
            <Wand2 size={15} />
            {generateMutation.isPending ? 'Generando…' : 'Generar nuevo menú'}
          </button>
        </div>
      </div>

      {/* Season selector */}
      <div style={{
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)',
        marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', whiteSpace: 'nowrap' }}>
          Estación del año
        </span>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {SEASONS.map(s => (
            <button
              key={s.value}
              onClick={() => setSeason(s.value)}
              className={`filter-chip${season === s.value ? ' active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div style={{
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)',
        boxShadow: 'var(--shadow-sm)', overflowX: 'auto', marginBottom: 'var(--space-8)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(160px, 1fr))', gap: 'var(--space-3)', minWidth: 900 }}>
          {DAYS.map((day, di) => (
            <div key={di}>
              <div style={{
                textAlign: 'center', padding: 'var(--space-2) 0 var(--space-3)',
                fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)',
                letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}>
                {day}
              </div>
              {MEAL_GROUPS.map(group => (
                <div key={group.key} style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{
                    fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)',
                    letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase',
                    color: 'var(--text-subtle)', marginBottom: 4,
                  }}>
                    {group.label}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {group.slots.map((slotKey, idx) => {
                      const fullKey = `${di}_${slotKey}`
                      const value = rules[fullKey] ?? ''
                      return (
                        <div key={slotKey} style={{ flex: 1 }}>
                          <div style={{
                            fontSize: 9, fontWeight: 'var(--fw-bold)', textTransform: 'uppercase',
                            color: 'var(--text-subtle)', marginBottom: 3, textAlign: 'center',
                          }}>
                            {idx === 0 ? '1°' : '2°'}
                          </div>
                          <select
                            value={value}
                            onChange={e => setRule(fullKey, e.target.value)}
                            style={{
                              width: '100%', fontSize: 'var(--text-xs)', padding: '6px 4px',
                              border: value ? '1.5px solid var(--primary)' : '1px dashed var(--border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              background: value ? 'var(--primary-soft)' : 'var(--surface-sunken)',
                              color: value ? 'var(--primary)' : 'var(--text-subtle)',
                              cursor: 'pointer', appearance: 'none', textAlign: 'center',
                            }}
                          >
                            <option value="">Cualquiera</option>
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)',
        lineHeight: 'var(--leading-relaxed)',
      }}>
        <strong style={{ color: 'var(--text-body)' }}>Cómo funciona:</strong> Elige una categoría para cada hueco (1° y 2° plato por comida y cena).
        Al generar, el sistema buscará recetas de esa categoría que encajen con la estación seleccionada.
        Los huecos en blanco se rellenarán con recetas variadas de forma aleatoria.
      </div>
    </div>
  )
}

function getMonday() {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}
