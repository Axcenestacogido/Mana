import { useNavigate } from 'react-router-dom'
import { Recipe } from '../types'

interface Props {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate()

  const mealBadge = recipe.meal_type === 'comida'
    ? { label: 'Comida', style: { background: '#dcfce7', color: '#15803d' } }
    : recipe.meal_type === 'cena'
    ? { label: 'Cena', style: { background: '#dbeafe', color: '#1d4ed8' } }
    : { label: recipe.meal_type, style: { background: '#f3f4f6', color: '#374151' } }

  return (
    <div
      className="card"
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      style={{ cursor: 'pointer', transition: 'box-shadow 0.15s', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h3 style={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.3, flex: 1 }}>{recipe.name}</h3>
        <span className="badge" style={mealBadge.style}>{mealBadge.label}</span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
        <span>⏱ {recipe.prep_time_minutes} min</span>
        <span>👥 {recipe.servings} porciones</span>
      </div>

      {recipe.category.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
          {recipe.category.map(cat => (
            <span key={cat} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{cat}</span>
          ))}
        </div>
      )}

      {recipe.ingredients.length > 0 && (
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
          {recipe.ingredients.slice(0, 3).map(i => i.ingredient_name).join(', ')}
          {recipe.ingredients.length > 3 ? ` +${recipe.ingredients.length - 3} más` : ''}
        </p>
      )}
    </div>
  )
}
