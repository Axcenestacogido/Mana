import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEAL_GROUPS = [
  { key: 'comida', label: 'Comida', slots: ['comida_primero', 'comida_segundo'] as const },
  { key: 'cena',   label: 'Cena',   slots: ['cena_primero',   'cena_segundo']   as const },
] as const

const TEMPLATE_KEY = 'mana_menu_template'

export function loadTemplate(): Record<string, string> {
  try {
    const stored = localStorage.getItem(TEMPLATE_KEY)
    if (!stored) return {}
    const parsed = JSON.parse(stored)
    // Support both old format {rules, season} and new format (plain dict)
    return parsed.rules ?? parsed
  } catch {
    return {}
  }
}

function saveTemplate(rules: Record<string, string>) {
  localStorage.setItem(TEMPLATE_KEY, JSON.stringify(rules))
}

export default function MenuTemplatePage() {
  const { categories } = useCategories()
  const [rules, setRules] = useState<Record<string, string>>(loadTemplate)

  const setRule = (slotKey: string, value: string) => {
    setRules(prev => {
      const next = { ...prev }
      if (value) next[slotKey] = value
      else delete next[slotKey]
      saveTemplate(next)
      return next
    })
  }

  const handleReset = () => {
    setRules({})
    saveTemplate({})
  }

  const filledCount = Object.keys(rules).length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Plantilla de menú</h1>
          <p className="page-sub">
            Asigna una categoría a cada hueco. Se guarda automáticamente y se usará al auto-generar el menú.
            {filledCount > 0 && <span style={{ marginLeft: 8, color: 'var(--primary)', fontWeight: 'var(--fw-semibold)' }}>({filledCount} huecos configurados)</span>}
          </p>
        </div>
        <button onClick={handleReset} className="btn btn-ghost btn-md">
          <RotateCcw size={14} /> Limpiar todo
        </button>
      </div>

      {/* Template grid */}
      <div style={{
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)',
        boxShadow: 'var(--shadow-sm)', overflowX: 'auto', marginBottom: 'var(--space-8)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(130px, 1fr))', gap: 'var(--space-3)', minWidth: 760 }}>
          {DAYS.map((day, di) => (
            <div key={di}>
              <div style={{
                textAlign: 'center', padding: 'var(--space-2) 0 var(--space-3)',
                fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)',
                letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase',
                color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 8,
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
                              width: '100%', fontSize: 11, padding: '5px 2px',
                              border: value ? '1.5px solid var(--primary)' : '1px dashed var(--border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              background: value ? 'var(--primary-soft)' : 'var(--surface-sunken)',
                              color: value ? 'var(--primary)' : 'var(--text-subtle)',
                              cursor: 'pointer', appearance: 'none', textAlign: 'center',
                            }}
                          >
                            <option value="">—</option>
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

      <div style={{
        background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)',
        lineHeight: 'var(--leading-relaxed)',
      }}>
        <strong style={{ color: 'var(--text-body)' }}>Cómo funciona:</strong> Elige una categoría para cada hueco (1° y 2° plato de comida y cena).
        Los cambios se guardan automáticamente. Cuando pulses "Auto-generar" en el menú semanal, el sistema usará esta plantilla
        para colocar recetas de la categoría correcta en cada hueco. Los huecos sin categoría se rellenan con recetas variadas.
      </div>
    </div>
  )
}
