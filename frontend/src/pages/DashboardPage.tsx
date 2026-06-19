import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Calendar, ChefHat, Heart } from 'lucide-react'
import { getRecipes } from '../api/recipes'
import { getMenus } from '../api/menu'
import RecipeCard from '../components/RecipeCard'

export default function DashboardPage() {
  const { data: recipes = [] } = useQuery({ queryKey: ['recipes'], queryFn: () => getRecipes() })
  const { data: menus = [] } = useQuery({ queryKey: ['menus'], queryFn: getMenus })

  const favCount = (recipes as any[]).filter((r: any) => r.is_favorite).length
  const recent = [...(recipes as any[])].slice(0, 4)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inicio</h1>
          <p className="page-sub">Tu cocina de un vistazo</p>
        </div>
        <Link to="/recetas/nueva" className="btn btn-primary btn-md">
          <Plus size={16} /> Nueva receta
        </Link>
      </div>

      <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>{(recipes as any[]).length}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>Recetas</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>{favCount}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>Favoritas</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>{(menus as any[]).length}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>Menús</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
        <Link to="/menu" className="btn btn-secondary btn-md"><Calendar size={15} /> Ver menú semanal</Link>
        <Link to="/ia" className="btn btn-secondary btn-md"><ChefHat size={15} /> Generar receta con IA</Link>
        <Link to="/recetas" className="btn btn-secondary btn-md"><Heart size={15} /> Mis favoritas</Link>
      </div>

      {recent.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
              Últimas recetas
            </h2>
            <Link to="/recetas" style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)' }}>Ver todas →</Link>
          </div>
          <div className="grid-recipes">
            {recent.map((recipe: any) => <RecipeCard key={recipe.id} recipe={recipe} />)}
          </div>
        </div>
      )}

      {(recipes as any[]).length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><ChefHat size={48} /></div>
          <div className="empty-title">Empieza tu colección</div>
          <div className="empty-desc">Añade tu primera receta para empezar a organizar tu cocina.</div>
          <Link to="/recetas/nueva" className="btn btn-primary btn-md" style={{ marginTop: 'var(--space-2)' }}>
            <Plus size={16} /> Crear primera receta
          </Link>
        </div>
      )}
    </div>
  )
}
