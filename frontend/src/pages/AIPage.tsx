import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Sparkles, ChefHat, Calendar } from 'lucide-react'
import { generateFromIngredients, recipeVariation, suggestWeeklyMenu } from '../api/ai'
import { createRecipe, getRecipes } from '../api/recipes'
import { getMenus, setMenuEntry } from '../api/menu'

export default function AIPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'ingredients' | 'variation' | 'menu'>('ingredients')

  // Tab 1 — generate from ingredients
  const [ingsText, setIngsText] = useState('')
  const [mealType, setMealType] = useState('comida')
  const [prefs, setPrefs] = useState('')
  const [generatedRecipe, setGeneratedRecipe] = useState<Record<string, unknown> | null>(null)

  // Tab 2 — variation
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null)
  const [variationReq, setVariationReq] = useState('')
  const [variationResult, setVariationResult] = useState<Record<string, unknown> | null>(null)

  // Tab 3 — weekly menu
  const [menuPrefs, setMenuPrefs] = useState('')
  const [menuSeason, setMenuSeason] = useState('')
  const [menuBudget, setMenuBudget] = useState('')
  const [menuSuggestion, setMenuSuggestion] = useState<{ menu: {day_of_week: number; meal_type: string; recipe_id: number}[]; notes: string } | null>(null)

  const { data: recipes = [] } = useQuery({ queryKey: ['recipes'], queryFn: () => getRecipes() })
  const { data: menus = [] } = useQuery({ queryKey: ['menus'], queryFn: getMenus })
  const activeMenu = menus[0]

  const genFromIngsMutation = useMutation({
    mutationFn: () => generateFromIngredients({
      ingredients: ingsText.split('\n').map(s => s.trim()).filter(Boolean),
      meal_type: mealType, preferences: prefs,
    }),
    onSuccess: (data) => setGeneratedRecipe(data),
  })

  const saveRecipeMutation = useMutation({
    mutationFn: (data: unknown) => createRecipe(data as Parameters<typeof createRecipe>[0]),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['recipes'] }); setGeneratedRecipe(null) },
  })

  const variationMutation = useMutation({
    mutationFn: () => recipeVariation({ recipe_id: selectedRecipeId!, variation_request: variationReq }),
    onSuccess: (data) => setVariationResult(data),
  })

  const menuMutation = useMutation({
    mutationFn: () => suggestWeeklyMenu({ preferences: menuPrefs, season: menuSeason, budget: menuBudget, excluded_recipe_ids: [] }),
    onSuccess: (data) => setMenuSuggestion(data),
  })

  const applyMenuMutation = useMutation({
    mutationFn: async () => {
      if (!activeMenu || !menuSuggestion) return
      for (const entry of menuSuggestion.menu) {
        await setMenuEntry(activeMenu.id, entry.day_of_week, entry.meal_type, entry.recipe_id)
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['menus'] }); setMenuSuggestion(null) },
  })

  const tabStyle = (t: string) => ({
    padding: '10px 20px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14,
    background: tab === t ? '#b5451b' : '#f0f0f0', color: tab === t ? 'white' : '#666',
  })

  const btnStyle = { padding: '10px 20px', background: '#b5451b', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }
  const inpStyle = { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }
  const labelStyle = { fontWeight: 600, display: 'block', marginBottom: 6, fontSize: 14 } as const

  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Asistente de IA</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Genera recetas, variaciones y menús semanales con inteligencia artificial.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        <button style={tabStyle('ingredients')} onClick={() => setTab('ingredients')}><Sparkles size={15} style={{ display: 'inline', marginRight: 6 }} />Receta nueva</button>
        <button style={tabStyle('variation')} onClick={() => setTab('variation')}><ChefHat size={15} style={{ display: 'inline', marginRight: 6 }} />Variación</button>
        <button style={tabStyle('menu')} onClick={() => setTab('menu')}><Calendar size={15} style={{ display: 'inline', marginRight: 6 }} />Menú semanal</button>
      </div>

      {tab === 'ingredients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Ingredientes disponibles (uno por línea)</label>
            <textarea value={ingsText} onChange={e => setIngsText(e.target.value)} rows={5} style={inpStyle} placeholder={"pollo\ntomate\najo\ncebolla"} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Tipo de plato</label>
              <select value={mealType} onChange={e => setMealType(e.target.value)} style={inpStyle}>
                <option value="comida">Comida</option>
                <option value="cena">Cena</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Preferencias adicionales</label>
              <input value={prefs} onChange={e => setPrefs(e.target.value)} style={inpStyle} placeholder="sin gluten, bajo en calorías..." />
            </div>
          </div>
          <button onClick={() => genFromIngsMutation.mutate()} disabled={!ingsText || genFromIngsMutation.isPending} style={btnStyle}>
            {genFromIngsMutation.isPending ? 'Generando...' : '✨ Generar receta'}
          </button>
          {generatedRecipe && (
            <div style={{ background: '#fef3ee', borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{generatedRecipe.name as string}</h3>
              <p style={{ color: '#666', marginBottom: 12 }}>{generatedRecipe.prep_time_minutes as number} min · {generatedRecipe.servings as number} porciones</p>
              <div style={{ marginBottom: 12 }}>
                <strong>Ingredientes:</strong>
                <ul style={{ marginTop: 6, paddingLeft: 20 }}>
                  {(generatedRecipe.ingredients as {name: string; quantity?: number; unit?: string}[]).map((i, idx) => (
                    <li key={idx}>{i.name} {i.quantity ? `— ${i.quantity} ${i.unit ?? ''}` : ''}</li>
                  ))}
                </ul>
              </div>
              <div style={{ marginBottom: 16 }}>
                <strong>Pasos:</strong>
                <ol style={{ marginTop: 6, paddingLeft: 20 }}>
                  {(generatedRecipe.steps as string[]).map((s, idx) => <li key={idx} style={{ marginBottom: 4 }}>{s}</li>)}
                </ol>
              </div>
              <button onClick={() => saveRecipeMutation.mutate(generatedRecipe)} disabled={saveRecipeMutation.isPending} style={btnStyle}>
                {saveRecipeMutation.isPending ? 'Guardando...' : '💾 Guardar receta'}
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'variation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Receta a modificar</label>
            <select value={selectedRecipeId ?? ''} onChange={e => setSelectedRecipeId(Number(e.target.value))} style={inpStyle}>
              <option value="">Selecciona una receta...</option>
              {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>¿Qué variación quieres?</label>
            <input value={variationReq} onChange={e => setVariationReq(e.target.value)} style={inpStyle} placeholder="sin gluten, más ligera, sin lácteos, versión vegana..." />
          </div>
          <button onClick={() => variationMutation.mutate()} disabled={!selectedRecipeId || !variationReq || variationMutation.isPending} style={btnStyle}>
            {variationMutation.isPending ? 'Generando...' : '✨ Crear variación'}
          </button>
          {variationResult && (
            <div style={{ background: '#fef3ee', borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{variationResult.name as string}</h3>
              <ol style={{ paddingLeft: 20 }}>
                {(variationResult.steps as string[]).map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
              </ol>
              <button onClick={() => saveRecipeMutation.mutate(variationResult)} style={{ ...btnStyle, marginTop: 16 }}>
                💾 Guardar variación
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Preferencias</label>
              <input value={menuPrefs} onChange={e => setMenuPrefs(e.target.value)} style={inpStyle} placeholder="ligero, variado..." />
            </div>
            <div>
              <label style={labelStyle}>Temporada</label>
              <select value={menuSeason} onChange={e => setMenuSeason(e.target.value)} style={inpStyle}>
                <option value="">Cualquiera</option>
                <option value="verano">Verano</option>
                <option value="invierno">Invierno</option>
                <option value="primavera">Primavera</option>
                <option value="otoño">Otoño</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Presupuesto</label>
              <select value={menuBudget} onChange={e => setMenuBudget(e.target.value)} style={inpStyle}>
                <option value="">Sin límite</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>
          {recipes.length < 7 && (
            <p style={{ background: '#fff3cd', padding: 12, borderRadius: 8, fontSize: 13, color: '#856404' }}>
              Necesitas al menos 7 recetas guardadas para generar un menú completo. Tienes {recipes.length}.
            </p>
          )}
          <button onClick={() => menuMutation.mutate()} disabled={menuMutation.isPending} style={btnStyle}>
            {menuMutation.isPending ? 'Generando...' : '✨ Sugerir menú semanal'}
          </button>
          {menuSuggestion && (
            <div style={{ background: '#fef3ee', borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Menú sugerido</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 16 }}>
                {DAYS.map((day, di) => (
                  <div key={di}>
                    <div style={{ fontWeight: 600, fontSize: 11, color: '#666', marginBottom: 4 }}>{day}</div>
                    {['comida', 'cena'].map(meal => {
                      const entry = menuSuggestion.menu.find(e => e.day_of_week === di && e.meal_type === meal)
                      const recipe = recipes.find(r => r.id === entry?.recipe_id)
                      return (
                        <div key={meal} style={{ fontSize: 11, background: 'white', borderRadius: 4, padding: 4, marginBottom: 4 }}>
                          <span style={{ color: '#999', fontSize: 10 }}>{meal}: </span>
                          {recipe?.name ?? '—'}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              {menuSuggestion.notes && <p style={{ color: '#666', fontSize: 13, marginBottom: 12 }}>{menuSuggestion.notes}</p>}
              {activeMenu ? (
                <button onClick={() => applyMenuMutation.mutate()} disabled={applyMenuMutation.isPending} style={btnStyle}>
                  {applyMenuMutation.isPending ? 'Aplicando...' : '📅 Aplicar al menú actual'}
                </button>
              ) : (
                <p style={{ fontSize: 13, color: '#888' }}>Crea un menú semanal primero para poder aplicar esta sugerencia.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
