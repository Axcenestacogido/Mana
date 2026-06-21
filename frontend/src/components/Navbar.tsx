import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Calendar, ShoppingBag, Sparkles, ChefHat, Settings, LayoutTemplate } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Inicio', Icon: Home, exact: true },
  { to: '/recetas', label: 'Recetas', Icon: BookOpen },
  { to: '/menu', label: 'Menú semanal', Icon: Calendar },
  { to: '/plantilla', label: 'Plantilla de menú', Icon: LayoutTemplate },
  { to: '/compra', label: 'Lista de compra', Icon: ShoppingBag },
  { to: '/ia', label: 'Asistente IA', Icon: Sparkles },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="app-sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <span className="logo-wordmark">Maná</span>
      </div>

      <span className="nav-section-label">Principal</span>
      {navLinks.map(({ to, label, Icon, exact }) => {
        const isActive = exact ? pathname === to : pathname.startsWith(to)
        return (
          <Link key={to} to={to} className={`nav-item${isActive ? ' active' : ''}`}>
            <Icon size={16} strokeWidth={2} />
            {label}
          </Link>
        )
      })}

      <span className="nav-section-label" style={{ marginTop: 'var(--space-2)' }}>Cocina</span>
      <Link
        to="/"
        className="nav-item"
        onClick={e => { e.preventDefault() }}
        style={{ opacity: 0.5, cursor: 'default', pointerEvents: 'none' }}
      >
        <ChefHat size={16} strokeWidth={2} />
        Modo cocina
      </Link>

      <Link to="/ajustes" className={`nav-item${pathname === '/ajustes' ? ' active' : ''}`}>
        <Settings size={16} strokeWidth={2} />
        Ajustes
      </Link>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-full)',
            background: 'var(--terracotta-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)',
            color: 'var(--terracotta-700)', flexShrink: 0,
          }}>
            M
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)' }}>Mi cocina</div>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>Personal</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
