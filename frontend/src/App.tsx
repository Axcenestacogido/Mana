import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowLeft } from 'lucide-react'
import Sidebar from './components/Navbar'
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import RecipeFormPage from './pages/RecipeFormPage'
import WeeklyMenuPage from './pages/WeeklyMenuPage'
import ShoppingListPage from './pages/ShoppingListPage'
import AIPage from './pages/AIPage'
import CookingModePage from './pages/CookingModePage'
import SharedMenuPage from './pages/SharedMenuPage'

function MobileHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const navigate = useNavigate()
  return (
    <header className="mobile-header">
      <button className="btn btn-ghost btn-md mobile-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </button>
      <span className="logo-wordmark" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>Maná</span>
      <button className="btn btn-ghost btn-md" onClick={onOpenSidebar}>
        <Menu size={20} />
      </button>
    </header>
  )
}

function ShellLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<RecipesPage />} />
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
