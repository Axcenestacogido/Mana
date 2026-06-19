import { useState, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Sparkles, ChefHat, Calendar, Camera, Save, Link } from 'lucide-react'
import { generateFromIngredients, recipeVariation, suggestWeeklyMenu, importFromImage, importFromUrl } from '../api/ai'
import { createRecipe, getRecipes } from '../api/recipes'
import { getMenus, setMenuEntry } from '../api/menu'

const TABS = [
  { id: 'ingredients', label: 'Receta nueva', Icon: Sparkles },
  { id: 'variation',   label: 'Variación',    Icon: ChefHat },
  { id: 'menu',        label: 'Menú semanal', Icon: Calendar },
  { id: 'photo',       label: 'Importar foto', Icon: Camera },
  { id: 'url',         label: 'Importar URL',  Icon: Link },
] as const

type TabId = typeof TABS[number]['id']

const DAYS_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function AIPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<TabId>('ingredients')

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
  const [menuSuggestion, setMenuSuggestion] = useState<{ menu: { day_of_week: number; meal_type: string; recipe_id: number }[]; notes: string } | null>(null)

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

  const [urlInput, setUrlInput] = useState('')
  const [urlRecipe, setUrlRecipe] = useState<Record<string, unknown> | null>(null)
  const urlMutation = useMutation({
    mutationFn: () => importFromUrl(urlInput.trim()),
    onSuccess: (data) => setUrlRecipe(data),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setImportedRecipe(null)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const RecipePreview = ({ recipe, onSave }: { recipe: Record<string, unknown>; onSave: () => void }) => (
    <div style={{
      background: 'var(--surface-warm)', border: '1px solid var(--terracotta-200)',
      borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)',
    }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 'var(--space-1)' }}>
        {recipe.name as string}
      </h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
        {recipe.prep_time_minutes as number} min · {recipe.servings as number} porciones
      </p>
      <div className="detail-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Ingredientes</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(recipe.ingredients as { name: string; quantity?: number; unit?: string }[] ?? []).map((i, idx) => (
              <li key={idx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)', display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--terracotta-100)' }}>
                <span>{i.name}</span>
                {i.quantity && <span style={{ color: 'var(--text-muted)' }}>{i.quantity} {i.unit}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Preparación</div>
          <ol style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(recipe.steps as string[] ?? []).map((s, idx) => (
              <li key={idx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)', lineHeight: 'var(--leading-relaxed)' }}>{s}</li>
            ))}
          </ol>
        </div>
      </div>
      <button onClick={onSave} disabled={saveRecipeMutation.isPending} className="btn btn-primary btn-md">
        <Save size={15} /> {saveRecipeMutation.isPending ? 'Guardando…' : 'Guardar receta'}
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 780 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Asistente IA</h1>
          <p className="page-sub">Genera recetas, variaciones y menús con inteligencia artificial</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="ai-tabs" style={{ marginBottom: 'var(--space-8)' }}>
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`ai-tab-btn${tab === id ? ' active' : ''}`}
          >
            <Icon size={14} strokeWidth={2} /> {label}
          </button>
        ))}
      </div>

      {tab === 'ingredients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="form-group">
            <label className="form-label">Ingredientes disponibles (uno por línea)</label>
            <textarea
              value={ingsText}
              onChange={e => setIngsText(e.target.value)}
              rows={5}
              className="form-input"
              placeholder={'pollo\ntomate\najo\ncebolla'}
            />
          </div>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tipo de plato</label>
              <select value={mealType} onChange={e => setMealType(e.target.value)} className="form-input">
                <option value="comida">Comida</option>
                <option value="cena">Cena</option>
                <option value="desayuno">Desayuno</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Preferencias</label>
              <input value={prefs} onChange={e => setPrefs(e.target.value)} className="form-input" placeholder="sin gluten, bajo en calorías…" />
            </div>
          </div>
          <button onClick={() => genFromIngsMutation.mutate()} disabled={!ingsText || genFromIngsMutation.isPending} className="btn btn-primary btn-md" style={{ alignSelf: 'flex-start' }}>
            <Sparkles size={15} /> {genFromIngsMutation.isPending ? 'Generando…' : 'Generar receta'}
          </button>
          {generatedRecipe && <RecipePreview recipe={generatedRecipe} onSave={() => saveRecipeMutation.mutate(generatedRecipe)} />}
        </div>
      )}

      {tab === 'variation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="form-group">
            <label className="form-label">Receta a modificar</label>
            <select value={selectedRecipeId ?? ''} onChange={e => setSelectedRecipeId(Number(e.target.value))} className="form-input">
              <option value="">Selecciona una receta…</option>
              {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">¿Qué variación quieres?</label>
            <input value={variationReq} onChange={e => setVariationReq(e.target.value)} className="form-input"
              placeholder="sin gluten, más ligera, sin lácteos, versión vegana…" />
          </div>
          <button onClick={() => variationMutation.mutate()} disabled={!selectedRecipeId || !variationReq || variationMutation.isPending} className="btn btn-primary btn-md" style={{ alignSelf: 'flex-start' }}>
            <Sparkles size={15} /> {variationMutation.isPending ? 'Generando…' : 'Crear variación'}
          </button>
          {variationResult && <RecipePreview recipe={variationResult} onSave={() => saveRecipeMutation.mutate(variationResult)} />}
        </div>
      )}

      {tab === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Preferencias</label>
              <input value={menuPrefs} onChange={e => setMenuPrefs(e.target.value)} className="form-input" placeholder="ligero, variado…" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Temporada</label>
              <select value={menuSeason} onChange={e => setMenuSeason(e.target.value)} className="form-input">
                <option value="">Cualquiera</option>
                <option value="verano">Verano</option>
                <option value="invierno">Invierno</option>
                <option value="primavera">Primavera</option>
                <option value="otoño">Otoño</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Presupuesto</label>
              <select value={menuBudget} onChange={e => setMenuBudget(e.target.value)} className="form-input">
                <option value="">Sin límite</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>
          {recipes.length < 7 && (
            <div style={{ background: 'var(--warning-soft)', border: '1px solid var(--amber-100)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--warning-fg)' }}>
              Necesitas al menos 7 recetas para generar un menú completo. Tienes {recipes.length}.
            </div>
          )}
          <button onClick={() => menuMutation.mutate()} disabled={menuMutation.isPending} className="btn btn-primary btn-md" style={{ alignSelf: 'flex-start' }}>
            <Calendar size={15} /> {menuMutation.isPending ? 'Generando…' : 'Sugerir menú semanal'}
          </button>
          {menuSuggestion && (
            <div style={{ background: 'var(--surface-warm)', border: '1px solid var(--terracotta-200)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 'var(--space-4)' }}>Menú sugerido</h3>
              <div style={{ overflowX: 'auto', marginBottom: 'var(--space-5)' }}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(100px, 1fr))', gap: 'var(--space-2)', minWidth: 560 }}>
                {DAYS_FULL.map((day, di) => (
                  <div key={di}>
                    <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginBottom: 6, letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase' }}>{day.slice(0, 3)}</div>
                    {['comida', 'cena'].map(meal => {
                      const entry = menuSuggestion.menu.find(e => e.day_of_week === di && e.meal_type === meal)
                      const recipe = recipes.find(r => r.id === entry?.recipe_id)
                      return (
                        <div key={meal} style={{ fontSize: 'var(--text-xs)', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                          <span style={{ color: 'var(--text-subtle)', fontSize: 'var(--text-2xs)', display: 'block', marginBottom: 2 }}>{meal}</span>
                          <span style={{ color: 'var(--text-body)', fontWeight: 'var(--fw-medium)' }}>{recipe?.name ?? '—'}</span>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div></div>
              {menuSuggestion.notes && <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-relaxed)' }}>{menuSuggestion.notes}</p>}
              {activeMenu ? (
                <button onClick={() => applyMenuMutation.mutate()} disabled={applyMenuMutation.isPending} className="btn btn-sage btn-md">
                  <Calendar size={15} /> {applyMenuMutation.isPending ? 'Aplicando…' : 'Aplicar al menú actual'}
                </button>
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Crea un menú semanal primero para poder aplicar esta sugerencia.</p>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'photo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
            Sube una foto de una receta escrita a mano, un libro de cocina, un menú en papel o una captura de pantalla. La IA extraerá automáticamente todos los datos.
          </p>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--border-default)', borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-10)', textAlign: 'center', cursor: 'pointer',
              background: 'var(--surface-sunken)', transition: 'border-color var(--dur-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 'var(--radius-lg)', objectFit: 'contain' }} />
            ) : (
              <>
                <Camera size={40} color="var(--text-subtle)" style={{ display: 'block', margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-muted)', margin: 0, fontWeight: 'var(--fw-medium)' }}>Haz clic para seleccionar una imagen</p>
                <p style={{ color: 'var(--text-subtle)', fontSize: 'var(--text-sm)', marginTop: 4 }}>JPG, PNG, WEBP — máx. 10 MB</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          {selectedFile && !importedRecipe && (
            <button onClick={() => importMutation.mutate()} disabled={importMutation.isPending} className="btn btn-primary btn-md" style={{ alignSelf: 'flex-start' }}>
              <Camera size={15} /> {importMutation.isPending ? 'Analizando imagen…' : 'Extraer receta de la imagen'}
            </button>
          )}
          {importMutation.isError && (
            <div className="error-msg">No se pudo extraer ninguna receta. Prueba con una foto más clara.</div>
          )}
          {importedRecipe && (
            <>
              <div style={{ background: 'var(--success-soft)', border: '1px solid var(--sage-200)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--success-fg)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Receta detectada correctamente
              </div>
              <RecipePreview recipe={importedRecipe} onSave={() => saveRecipeMutation.mutate(importedRecipe)} />
            </>
          )}
        </div>
      )}
      {tab === 'url' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
            Pega la URL de cualquier página web con una receta. La IA extraerá automáticamente los ingredientes, pasos y tiempos.
          </p>
          <div className="form-group">
            <label className="form-label">URL de la receta</label>
            <input
              type="url"
              value={urlInput}
              onChange={e => { setUrlInput(e.target.value); setUrlRecipe(null) }}
              className="form-input"
              placeholder="https://ejemplo.com/receta-de-paella"
            />
          </div>
          <button
            onClick={() => urlMutation.mutate()}
            disabled={!urlInput.trim() || urlMutation.isPending}
            className="btn btn-primary btn-md"
            style={{ alignSelf: 'flex-start' }}
          >
            <Link size={15} /> {urlMutation.isPending ? 'Analizando página…' : 'Extraer receta'}
          </button>
          {urlMutation.isError && (
            <div className="error-msg">No se pudo extraer ninguna receta. Comprueba que la URL es correcta y la página es accesible.</div>
          )}
          {urlRecipe && (
            <>
              <div style={{ background: 'var(--success-soft)', border: '1px solid var(--sage-200)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--success-fg)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Receta extraída correctamente
              </div>
              <RecipePreview recipe={urlRecipe} onSave={() => saveRecipeMutation.mutate(urlRecipe)} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
