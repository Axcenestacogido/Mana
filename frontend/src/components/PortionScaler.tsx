import { useState } from 'react'
import { RecipeIngredient } from '../types'

interface Props {
  ingredients: RecipeIngredient[]
  originalServings: number
}

export default function PortionScaler({ ingredients, originalServings }: Props) {
  const [desiredServings, setDesiredServings] = useState(originalServings)
  const scale = desiredServings / (originalServings || 1)

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Escalar porciones</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.875rem' }}>Porciones deseadas:</label>
        <input
          type="number"
          min={1}
          max={100}
          value={desiredServings}
          onChange={e => setDesiredServings(Math.max(1, parseInt(e.target.value) || 1))}
          className="form-input"
          style={{ width: '80px' }}
        />
        {desiredServings !== originalServings && (
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            (original: {originalServings})
          </span>
        )}
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {ingredients.map(ing => {
          const scaled = ing.quantity * scale
          const display = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1)
          return (
            <li key={ing.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.25rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ textTransform: 'capitalize' }}>{ing.ingredient_name}</span>
              <span style={{ fontWeight: 500, color: scale !== 1 ? '#16a34a' : 'inherit' }}>
                {display} {ing.unit}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
