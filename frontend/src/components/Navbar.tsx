import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Recetas' },
  { to: '/menu', label: 'Menú semanal' },
  { to: '/ia', label: 'IA' },
  { to: '/compra', label: 'Lista compra' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  return (
    <nav style={{ background: '#b5451b', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: 'white', fontWeight: 700, fontSize: 18, marginRight: 16, padding: '14px 0' }}>
        🍽 Recetas
      </span>
      {links.map(l => (
        <Link key={l.to} to={l.to} style={{
          color: pathname === l.to ? 'white' : 'rgba(255,255,255,0.75)',
          fontWeight: pathname === l.to ? 600 : 400,
          padding: '14px 12px',
          borderBottom: pathname === l.to ? '2px solid white' : '2px solid transparent',
          fontSize: 15,
        }}>
          {l.label}
        </Link>
      ))}
    </nav>
  )
}
