import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import RecipeFormPage from './pages/RecipeFormPage'
import WeeklyMenuPage from './pages/WeeklyMenuPage'
import ShoppingListPage from './pages/ShoppingListPage'
import AIPage from './pages/AIPage'
import CookingModePage from './pages/CookingModePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/recetas/:id/cocinar" element={<CookingModePage />} />
        <Route path="*" element={
          <>
            <Navbar />
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
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}
