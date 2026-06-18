import { useNavigate } from 'react-router-dom'
import { Clock, Users, Heart } from 'lucide-react'
import { Recipe } from '../types'

interface Props {
  recipe: Recipe
}

const MEAL_CONFIG: Record<string, { label: string; badge: string; gradient: string }> = {
  comida:   { label: 'Comida',   badge: 'badge-primary', gradient: 'linear-gradient(135deg, var(--terracotta-100), var(--terracotta-50))' },
  cena:     { label: 'Cena',     badge: 'badge-info',    gradient: 'linear-gradient(135deg, var(--blue-100), #eef3f9)' },
  desayuno: { label: 'Desayuno', badge: 'badge-warning', gradient: 'linear-gradient(135deg, var(--amber-100), #fdf6e8)' },
}

export default function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate()
  const config = MEAL_CONFIG[recipe.meal_type] ?? MEAL_CONFIG.comida

  return (
    <div
      className="recipe-card"
      onClick={() => navigate(`/recetas/${recipe.id}`)}
    >
      {/* Photo / gradient placeholder */}
      <div className="recipe-card-photo" style={{ background: config.gradient }}>
        <span className="recipe-card-initial">{recipe.name[0].toUpperCase()}</span>
        <span className="recipe-card-badge">
          <span className={`badge badge-sm ${config.badge}`}>{config.label}</span>
        </span>
        <button
          className="recipe-card-fav"
          onClick={e => e.stopPropagation()}
          aria-label="Guardar en favoritos"
        >
          <Heart size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Body */}
      <div className="recipe-card-body">
        <h3 className="recipe-card-name">{recipe.name}</h3>

        <div className="recipe-card-meta">
          <span><Clock size={12} strokeWidth={2} /> {recipe.prep_time_minutes} min</span>
          <span><Users size={12} strokeWidth={2} /> {recipe.servings} porciones</span>
        </div>

        {recipe.category.length > 0 && (
          <div className="recipe-card-tags">
            {recipe.category.slice(0, 3).map(cat => (
              <span key={cat} className="badge badge-sage badge-sm">{cat}</span>
            ))}
          </div>
        )}

        {recipe.ingredients.length > 0 && (
          <p className="recipe-card-ingredients">
            {recipe.ingredients.slice(0, 3).map(i => i.ingredient_name).join(', ')}
            {recipe.ingredients.length > 3 ? ` +${recipe.ingredients.length - 3} más` : ''}
          </p>
        )}
      </div>
    </div>
  )
}
