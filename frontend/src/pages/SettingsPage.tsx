import { useState } from 'react'
import { Plus, X, RotateCcw } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'

export default function SettingsPage() {
  const { categories, addCategory, removeCategory, resetCategories } = useCategories()
  const [newCategory, setNewCategory] = useState('')

  const handleAdd = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim())
      setNewCategory('')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ajustes</h1>
          <p className="page-sub">Personaliza tu experiencia en Maná</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 4 }}>
              Categorías de recetas
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              Estas categorías aparecen al crear o editar recetas.
            </p>
          </div>
          <button onClick={resetCategories} className="btn btn-ghost btn-sm" title="Restaurar por defecto">
            <RotateCcw size={14} /> Restaurar
          </button>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
            className="form-input"
            placeholder="Nueva categoría…"
            style={{ flex: 1 }}
          />
          <button onClick={handleAdd} disabled={!newCategory.trim()} className="btn btn-primary btn-md">
            <Plus size={15} /> Añadir
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {categories.map(cat => (
            <span key={cat} className="badge badge-sage" style={{ gap: 6, fontSize: 'var(--text-sm)', padding: '6px 10px' }}>
              {cat}
              <button
                onClick={() => removeCategory(cat)}
                style={{ display: 'inline-flex', color: 'inherit', opacity: 0.7, padding: 0 }}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {categories.length === 0 && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              No hay categorías. Añade una o restaura las predeterminadas.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
