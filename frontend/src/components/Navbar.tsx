import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Recetas' },
  { to: '/menu', label: 'Menú Semanal' },
  { to: '/compra', label: 'Lista de Compras' },
  { to: '/ia', label: 'IA' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav style={{
      background: '#16a34a',
      color: 'white',
      padding: '0 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      height: '56px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    }}>
      <Link to="/" style={{ fontWeight: 700, fontSize: '1.25rem', color: 'white', letterSpacing: '-0.5px' }}>
        🌿 Mana
      </Link>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {navLinks.map(link => {
          const isActive = link.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(link.to)
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
