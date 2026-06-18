import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Navbar'
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import RecipeFormPage from './pages/RecipeFormPage'
import WeeklyMenuPage from './pages/WeeklyMenuPage'
import ShoppingListPage from './pages/ShoppingListPage'
import AIPage from './pages/AIPage'
import CookingModePage from './pages/CookingModePage'
import SharedMenuPage from './pages/SharedMenuPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pantalla completa — sin sidebar */}
        <Route path="/recetas/:id/cocinar" element={<CookingModePage />} />
        <Route path="/compartido/:token" element={<SharedMenuPage />} />
        {/* Rutas con sidebar */}
        <Route path="*" element={
          <div className="app-shell">
            <Sidebar />
            <div className="app-main">
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
        } />
      </Routes>
    </BrowserRouter>
  )
}
