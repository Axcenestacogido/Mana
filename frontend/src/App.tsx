import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Calendar, ShoppingBag, Sparkles, Menu, X, Settings } from 'lucide-react'
import Sidebar from './components/Navbar'
import DashboardPage from './pages/DashboardPage'
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import RecipeFormPage from './pages/RecipeFormPage'
import WeeklyMenuPage from './pages/WeeklyMenuPage'
import MenuTemplatePage from './pages/MenuTemplatePage'
import ShoppingListPage from './pages/ShoppingListPage'
import AIPage from './pages/AIPage'
import CookingModePage from './pages/CookingModePage'
import SharedMenuPage from './pages/SharedMenuPage'
import SettingsPage from './pages/SettingsPage'

const bottomNavLinks = [
  { to: '/', label: 'Inicio', Icon: Home, exact: true },
  { to: '/recetas', label: 'Recetas', Icon: BookOpen },
  { to: '/menu', label: 'Menú', Icon: Calendar },
  { to: '/ia', label: 'IA', Icon: Sparkles },
]

const mobileMenuLinks = [
  { to: '/', label: 'Inicio', Icon: Home, exact: true },
  { to: '/recetas', label: 'Recetas', Icon: BookOpen },
  { to: '/menu', label: 'Menú semanal', Icon: Calendar },
  { to: '/compra', label: 'Lista de compra', Icon: ShoppingBag },
  { to: '/ia', label: 'Asistente IA', Icon: Sparkles },
  { to: '/ajustes', label: 'Ajustes', Icon: Settings },
]

function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav className="bottom-nav">
      {bottomNavLinks.map(({ to, label, Icon, exact }) => {
        const isActive = exact ? pathname === to : pathname.startsWith(to)
        return (
          <Link key={to} to={to} className={`bottom-nav-item${isActive ? ' active' : ''}`}>
            <Icon size={20} strokeWidth={2} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function MobileHeader({ onHamburger }: { onHamburger: () => void }) {
  return (
    <header className="mobile-header">
      <div className="mobile-header-logo">
        <div className="logo-mark" style={{ width: 28, height: 28 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <span className="logo-wordmark" style={{ fontSize: 'var(--text-lg)' }}>Maná</span>
      </div>
      <button
        className="mobile-hamburger"
        onClick={onHamburger}
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>
    </header>
  )
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  return (
    <>
      {open && (
        <div
          className="mobile-drawer-backdrop"
          onClick={onClose}
        />
      )}
      <div className={`mobile-drawer${open ? ' open' : ''}`}>
        <div className="mobile-drawer-header">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
            Maná
          </span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <nav style={{ flex: 1, padding: 'var(--space-3) 0' }}>
          {mobileMenuLinks.map(({ to, label, Icon, exact }) => {
            const isActive = exact ? pathname === to : pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`nav-item${isActive ? ' active' : ''}`}
                style={{ padding: '12px var(--space-5)' }}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}

function ShellLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar />
      <MobileHeader onHamburger={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="app-main">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/recetas" element={<RecipesPage />} />
            <Route path="/recetas/nueva" element={<RecipeFormPage />} />
            <Route path="/recetas/:id" element={<RecipeDetailPage />} />
            <Route path="/recetas/:id/editar" element={<RecipeFormPage />} />
            <Route path="/menu" element={<WeeklyMenuPage />} />
            <Route path="/plantilla" element={<MenuTemplatePage />} />
            <Route path="/ia" element={<AIPage />} />
            <Route path="/compra" element={<ShoppingListPage />} />
            <Route path="/compra/:menuId" element={<ShoppingListPage />} />
            <Route path="/ajustes" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pantalla completa — sin sidebar */}
        <Route path="/recetas/:id/cocinar" element={<CookingModePage />} />
        <Route path="/compartido/:token" element={<SharedMenuPage />} />
        {/* Rutas con sidebar */}
        <Route path="*" element={<ShellLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
