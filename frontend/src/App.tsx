import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Calendar, ShoppingBag, Sparkles } from 'lucide-react'
import Sidebar from './components/Navbar'
import DashboardPage from './pages/DashboardPage'
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import RecipeFormPage from './pages/RecipeFormPage'
import WeeklyMenuPage from './pages/WeeklyMenuPage'
import ShoppingListPage from './pages/ShoppingListPage'
import AIPage from './pages/AIPage'
import CookingModePage from './pages/CookingModePage'
import SharedMenuPage from './pages/SharedMenuPage'

const bottomNavLinks = [
  { to: '/', label: 'Inicio', Icon: Home, exact: true },
  { to: '/recetas', label: 'Recetas', Icon: BookOpen },
  { to: '/menu', label: 'Menú', Icon: Calendar },
  { to: '/ia', label: 'IA', Icon: Sparkles },
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

function ShellLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/recetas" element={<RecipesPage />} />
            <Route path="/recetas/nueva" element={<RecipeFormPage />} />
            <Route path="/recetas/:id" element={<RecipeDetailPage />} />
            <Route path="/recetas/:id/editar" element={<RecipeFormPage />} />
            <Route path="/menu" element={<WeeklyMenuPage />} />
            <Route path="/ia" element={<AIPage />} />
            <Route path="/compra" element={<ShoppingListPage />} />
            <Route path="/compra/:menuId" element={<ShoppingListPage />} />
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
