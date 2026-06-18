import { Clock, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Recipe } from '../types'

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link to={`/recetas/${recipe.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white', borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)', transition: 'box-shadow 0.2s',
        cursor: 'pointer',
      }}>
        {recipe.photo_url ? (
          <img src={recipe.photo_url} alt={recipe.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: 160, background: '#f0ebe5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
            🍲
          </div>
        )}
        <div style={{ padding: '12px 16px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{recipe.name}</h3>
          <div style={{ display: 'flex', gap: 12, color: '#666', fontSize: 13 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} /> {recipe.prep_time_minutes} min
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users size={13} /> {recipe.servings} pers.
            </span>
          </div>
          {recipe.categories.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
              {recipe.categories.map(c => (
                <span key={c} style={{ background: '#fef3ee', color: '#b5451b', borderRadius: 99, padding: '2px 8px', fontSize: 11 }}>
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
