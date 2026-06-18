import { useState, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Sparkles, ChefHat, Calendar, Camera } from 'lucide-react'
import { generateFromIngredients, recipeVariation, suggestWeeklyMenu, importFromImage } from '../api/ai'
import { createRecipe, getRecipes } from '../api/recipes'
import { getMenus, setMenuEntry } from '../api/menu'

export default function AIPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'ingredients' | 'variation' | 'menu' | 'photo'>('ingredients')

  const [ingsText, setIngsText] = useState('')
  const [mealType, setMealType] = useState('comida')
  const [prefs, setPrefs] = useState('')
  const [generatedRecipe, setGeneratedRecipe] = useState<Record<string, unknown> | null>(null)

  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null)
  const [variationReq, setVariationReq] = useState('')
  const [variationResult, setVariationResult] = useState<Record<string, unknown> | null>(null)

  const [menuPrefs, setMenuPrefs] = useState('')
  const [menuSeason, setMenuSeason] = useState('')
  const [menuBudget, setMenuBudget] = useState('')
  const [menuSuggestion, setMenuSuggestion] = useState<{ menu: {day_of_week: number; meal_type: string; recipe_id: number}[]; notes: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importedRecipe, setImportedRecipe] = useState<Record<string, unknown> | null>(null)

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] })
      setGeneratedRecipe(null)
      setImportedRecipe(null)
    },
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

  const importMutation = useMutation({
    mutationFn: () => importFromImage(selectedFile!),
    onSuccess: (data) => setImportedRecipe(data),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setImportedRecipe(null)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const tabStyle = (t: string): React.CSSProperties => ({
    padding: '10px 18px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14,
    background: tab === t ? '#b5451b' : '#f0f0f0', color: tab === t ? 'white' : '#666',
  })
  const btnStyle: React.CSSProperties = { padding: '10px 20px', background: '#b5451b', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }
  const inpStyle = { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }
  const labelStyle: React.CSSProperties = { fontWeight: 600, display: 'block', marginBottom: 6, fontSize: 14 }
  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  const RecipePreview = ({ recipe, onSave }: { recipe: Record<string, unknown>; onSave: () => void }) => (
    <div style={{ background: '#fef3ee', borderRadius: 12, padding: 20 }}>
      <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{recipe.name as string}</h3>
      <p style={{ color: '#666', marginBottom: 12 }}>{recipe.prep_time_minutes as number} min · {recipe.servings as number} porciones</p>
      <div style={{ marginBottom: 12 }}>
        <strong>Ingredientes:</strong>
        <ul style={{ marginTop: 6, paddingLeft: 20 }}>
          {(recipe.ingredients as {name: string; quantity?: number; unit?: string}[] ?? []).map((i, idx) => (
            <li key={idx}>{i.name}{i.quantity ? ` — ${i.quantity} ${i.unit ?? ''}` : ''}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Pasos:</strong>
        <ol style={{ marginTop: 6, paddingLeft: 20 }}>
          {(recipe.steps as string[] ?? []).map((s, idx) => <li key={idx} style={{ marginBottom: 4 }}>{s}</li>)}
        </ol>
      </div>
      <button onClick={onSave} disabled={saveRecipeMutation.isPending} style={btnStyle}>
        {saveRecipeMutation.isPending ? 'Guardando...' : '💾 Guardar receta'}
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Asistente de IA</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Genera recetas, variaciones y menús con inteligencia artificial.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        <button style={tabStyle('ingredients')} onClick={() => setTab('ingredients')}>
          <Sparkles size={14} style={{ display: 'inline', marginRight: 6 }} />Receta nueva
        </button>
        <button style={tabStyle('variation')} onClick={() => setTab('variation')}>
          <ChefHat size={14} style={{ display: 'inline', marginRight: 6 }} />Variación
        </button>
        <button style={tabStyle('menu')} onClick={() => setTab('menu')}>
          <Calendar size={14} style={{ display: 'inline', marginRight: 6 }} />Menú semanal
        </button>
        <button style={tabStyle('photo')} onClick={() => setTab('photo')}>
          <Camera size={14} style={{ display: 'inline', marginRight: 6 }} />Importar foto
        </button>
      </div>

      {tab === 'ingredients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Ingredientes disponibles (uno por línea)</label>
            <textarea value={ingsText} onChange={e => setIngsText(e.target.value)} rows={5} style={inpStyle}
              placeholder={'pollo\ntomate\najo\ncebolla'} />
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
              <label style={labelStyle}>Preferencias</label>
              <input value={prefs} onChange={e => setPrefs(e.target.value)} style={inpStyle} placeholder="sin gluten, bajo en calorías..." />
            </div>
          </div>
          <button onClick={() => genFromIngsMutation.mutate()} disabled={!ingsText || genFromIngsMutation.isPending} style={btnStyle}>
            {genFromIngsMutation.isPending ? 'Generando...' : '✨ Generar receta'}
          </button>
          {generatedRecipe && <RecipePreview recipe={generatedRecipe} onSave={() => saveRecipeMutation.mutate(generatedRecipe)} />}
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
            <input value={variationReq} onChange={e => setVariationReq(e.target.value)} style={inpStyle}
              placeholder="sin gluten, más ligera, sin lácteos, versión vegana..." />
          </div>
          <button onClick={() => variationMutation.mutate()} disabled={!selectedRecipeId || !variationReq || variationMutation.isPending} style={btnStyle}>
            {variationMutation.isPending ? 'Generando...' : '✨ Crear variación'}
          </button>
          {variationResult && <RecipePreview recipe={variationResult} onSave={() => saveRecipeMutation.mutate(variationResult)} />}
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
              Necesitas al menos 7 recetas para generar un menú completo. Tienes {recipes.length}.
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

      {tab === 'photo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ color: '#666', fontSize: 14 }}>
            Sube una foto de una receta escrita a mano, un libro de cocina, un menú en papel o una captura de pantalla.
            La IA extraerá automáticamente todos los datos.
          </p>
          <div onClick={() => fileInputRef.current?.click()}
            style={{ border: '2px dashed #ddd', borderRadius: 12, padding: 32, textAlign: 'center', cursor: 'pointer', background: '#faf9f7' }}>
            {previewUrl ? (
              <img src={previewUrl} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, objectFit: 'contain' }} />
            ) : (
              <>
                <Camera size={40} style={{ color: '#ccc', display: 'block', margin: '0 auto 12px' }} />
                <p style={{ color: '#999', margin: 0 }}>Haz clic para seleccionar una imagen</p>
                <p style={{ color: '#bbb', fontSize: 12, marginTop: 4 }}>JPG, PNG, WEBP — máx. 10 MB</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          {selectedFile && !importedRecipe && (
            <button onClick={() => importMutation.mutate()} disabled={importMutation.isPending} style={btnStyle}>
              {importMutation.isPending ? 'Analizando imagen...' : '📷 Extraer receta de la imagen'}
            </button>
          )}
          {importMutation.isError && (
            <p style={{ color: '#c00', background: '#fee', padding: 12, borderRadius: 8, fontSize: 14 }}>
              No se pudo extraer ninguna receta. Prueba con una foto más clara.
            </p>
          )}
          {importedRecipe && (
            <>
              <p style={{ color: '#2a7a3b', background: '#e8f5e9', padding: 10, borderRadius: 8, fontSize: 14 }}>
                ✅ Receta detectada correctamente
              </p>
              <RecipePreview recipe={importedRecipe} onSave={() => saveRecipeMutation.mutate(importedRecipe)} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
