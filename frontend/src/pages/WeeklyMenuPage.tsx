import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, RefreshCw, ShoppingCart, Share2, Copy, Check, X, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getMenus, getMenu, createMenu, updateMenu, deleteMenu, setMenuEntry, generateMenu, shareMenu, revokeShare } from '../api/menu'
import { getRecipes } from '../api/recipes'
import type { Recipe } from '../types'

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MEAL_SLOTS = ['comida', 'cena']

const MEAL_LABEL: Record<string, string> = { comida: 'Comida', cena: 'Cena' }
const MEAL_BADGE: Record<string, string> = { comida: 'badge-primary', cena: 'badge-info' }

function getMonday() {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

export default function WeeklyMenuPage() {
  const qc = useQueryClient()
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const [dragging, setDragging] = useState<Recipe | null>(null)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { data: menus = [] } = useQuery({ queryKey: ['menus'], queryFn: getMenus })
  const { data: recipes = [] } = useQuery({ queryKey: ['recipes'], queryFn: () => getRecipes() })

  const resolvedId = activeMenuId ?? menus[0]?.id ?? null

  const { data: activeMenu } = useQuery({
    queryKey: ['menu', resolvedId],
    queryFn: () => getMenu(resolvedId!),
    enabled: resolvedId !== null,
  })

  useEffect(() => {
    if (activeMenu) setEditName(activeMenu.name ?? activeMenu.week_start_date)
  }, [activeMenu])

  const createMutation = useMutation({
    mutationFn: () => {
      const monday = getMonday()
      const dateStr = monday.toISOString().split('T')[0]
      return createMenu({ week_start_date: dateStr, name: `Semana del ${dateStr}` })
    },
    onSuccess: (m) => {
      setCreateError(null)
      qc.invalidateQueries({ queryKey: ['menus'] })
      qc.invalidateQueries({ queryKey: ['menu', m.id] })
      setActiveMenuId(m.id)
    },
    onError: (e: any) => setCreateError(e?.response?.data?.detail || 'Error al crear el menú'),
  })

  const generateMutation = useMutation({
    mutationFn: () => generateMenu(activeMenu!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menus'] })
      qc.invalidateQueries({ queryKey: ['menu', activeMenu!.id] })
    },
  })

  const setEntryMutation = useMutation({
    mutationFn: ({ day, meal, recipeId }: { day: number; meal: string; recipeId?: number }) =>
      setMenuEntry(activeMenu!.id, day, meal, recipeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu', activeMenu!.id] }),
  })

  const shareMutation = useMutation({
    mutationFn: () => shareMenu(activeMenu!.id),
    onSuccess: (data) => setShareToken(data.token),
  })

  const revokeMutation = useMutation({
    mutationFn: () => revokeShare(activeMenu!.id),
    onSuccess: () => setShareToken(null),
  })

  const renameMutation = useMutation({
    mutationFn: (name: string) => updateMenu(resolvedId!, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menus'] })
      qc.invalidateQueries({ queryKey: ['menu', resolvedId] })
      setShowEditModal(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteMenu(resolvedId!),
    onSuccess: () => {
      setActiveMenuId(null)
      qc.invalidateQueries({ queryKey: ['menus'] })
      setShowDeleteConfirm(false)
    },
  })

  const getEntry = (day: number, meal: string) =>
    activeMenu?.entries?.find(e => e.day_of_week === day && e.meal_type === meal)

  const handleDrop = (day: number, meal: string) => {
    if (dragging && activeMenu) setEntryMutation.mutate({ day, meal, recipeId: dragging.id })
    setDragging(null)
  }

  const handleSlotClick = (day: number, meal: string) => {
    if (!activeMenu) return
    const entry = getEntry(day, meal)
    if (entry?.recipe) setEntryMutation.mutate({ day, meal, recipeId: undefined })
  }

  const shareUrl = shareToken ? `${window.location.origin}/compartido/${shareToken}` : null

  const copyShareUrl = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Menú semanal</h1>
          {activeMenu && (
            <p className="page-sub">{activeMenu.name ?? activeMenu.week_start_date}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {activeMenu && (
            <>
              <Link to={`/compra/${activeMenu.id}`} className="btn btn-secondary btn-md">
                <ShoppingCart size={15} /> Lista de compra
              </Link>
              <button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="btn btn-secondary btn-md"
              >
                <RefreshCw size={15} /> {generateMutation.isPending ? 'Generando…' : 'Auto-generar'}
              </button>
              <button
                onClick={() => shareMutation.mutate()}
                disabled={shareMutation.isPending}
                className="btn btn-secondary btn-md"
              >
                <Share2 size={15} /> Compartir
              </button>
              <button onClick={() => setShowEditModal(true)} className="btn btn-secondary btn-md">
                <Pencil size={14} /> Renombrar
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-ghost btn-md" style={{ color: 'var(--danger)' }}>
                <Trash2 size={14} />
              </button>
            </>
          )}
          <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending} className="btn btn-primary btn-md">
            <Plus size={15} /> {createMutation.isPending ? 'Creando…' : 'Nuevo menú'}
          </button>
        </div>
      </div>

      {createError && (
        <div className="error-msg" style={{ marginBottom: 'var(--space-4)' }}>{createError}</div>
      )}

      {/* Share banner */}
      {shareUrl && (
        <div style={{
          background: 'var(--success-soft)', border: '1px solid var(--sage-200)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)',
          marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap',
        }}>
          <Share2 size={15} color="var(--success)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--success-fg)', flex: 1, wordBreak: 'break-all' }}>{shareUrl}</span>
          <button onClick={copyShareUrl} className="btn btn-sage btn-sm">
            {copied ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> Copiar</>}
          </button>
          <button onClick={() => revokeMutation.mutate()} className="btn btn-danger btn-sm">
            <X size={13} /> Revocar
          </button>
        </div>
      )}

      {/* Menu selector */}
      {menus.length > 1 && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
          {menus.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMenuId(m.id)}
              className={`filter-chip${activeMenu?.id === m.id ? ' active' : ''}`}
            >
              {m.name ?? m.week_start_date}
            </button>
          ))}
        </div>
      )}

      {/* Weekly grid */}
      <div style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-5)',
        boxShadow: 'var(--shadow-sm)',
        overflowX: 'auto',
        marginBottom: 'var(--space-8)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))', gap: 'var(--space-3)', minWidth: 700 }}>
          {DAYS.map((day, di) => (
            <div key={di}>
              <div style={{
                textAlign: 'center', padding: 'var(--space-2) 0 var(--space-3)',
                fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)',
                letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}>
                {day}
              </div>
              {MEAL_SLOTS.map(meal => {
                const entry = getEntry(di, meal)
                return (
                  <div
                    key={meal}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(di, meal)}
                    onClick={() => handleSlotClick(di, meal)}
                    style={{
                      minHeight: 72, borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-3)', marginBottom: 'var(--space-2)',
                      border: `1px ${entry?.recipe ? 'solid' : 'dashed'} var(--border-subtle)`,
                      background: entry?.recipe ? 'var(--surface-warm)' : 'var(--surface-sunken)',
                      cursor: entry?.recipe ? 'pointer' : 'default',
                      transition: 'background var(--dur-fast)',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { if (entry?.recipe) e.currentTarget.style.background = 'var(--terracotta-100)' }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { if (entry?.recipe) e.currentTarget.style.background = 'var(--surface-warm)' }}
                  >
                    <div style={{
                      fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-semibold)',
                      letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase',
                      color: 'var(--text-subtle)', marginBottom: 4,
                    }}>
                      {MEAL_LABEL[meal]}
                    </div>
                    {entry?.recipe ? (
                      <>
                        <div style={{
                          fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)',
                          lineHeight: 'var(--leading-snug)', marginBottom: 4,
                        }}>
                          {entry.recipe.name}
                        </div>
                        <span className={`badge badge-sm ${MEAL_BADGE[meal]}`}>{MEAL_LABEL[meal]}</span>
                      </>
                    ) : (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)', marginTop: 4 }}>
                        Arrastra aquí
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Recipe bank */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 'var(--space-2)' }}>
          Tus recetas
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
          Arrastra una receta al tablero para asignarla
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {recipes.map(r => (
            <div
              key={r.id}
              draggable
              onDragStart={() => setDragging(r)}
              style={{
                background: 'var(--surface-card)',
                border: `1px solid var(--border-subtle)`,
                borderLeft: `3px solid ${r.meal_type === 'comida' ? 'var(--primary)' : 'var(--accent)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '8px 14px',
                fontSize: 'var(--text-sm)',
                cursor: 'grab',
                userSelect: 'none',
                boxShadow: 'var(--shadow-xs)',
                transition: 'box-shadow var(--dur-fast)',
                fontWeight: 'var(--fw-medium)',
                color: 'var(--text-body)',
              }}
            >
              {r.name}
            </div>
          ))}
        </div>
      </div>

      {/* Edit name modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,24,19,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 'var(--space-4)' }}>
          <div className="card" style={{ width: '100%', maxWidth: 420, borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>Renombrar menú</h2>
              <button onClick={() => setShowEditModal(false)} className="btn btn-ghost btn-sm"><X size={16} /></button>
            </div>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && editName.trim()) renameMutation.mutate(editName.trim()) }}
              className="form-input"
              style={{ width: '100%', marginBottom: 'var(--space-4)' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowEditModal(false)} className="btn btn-secondary btn-md">Cancelar</button>
              <button onClick={() => editName.trim() && renameMutation.mutate(editName.trim())} disabled={renameMutation.isPending || !editName.trim()} className="btn btn-primary btn-md">
                <Check size={15} /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,24,19,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 'var(--space-4)' }}>
          <div className="card" style={{ width: '100%', maxWidth: 400, borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 'var(--space-2)' }}>¿Eliminar menú?</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-5)', lineHeight: 'var(--leading-relaxed)' }}>
              Se borrará «{activeMenu?.name ?? activeMenu?.week_start_date}» y todos sus platos asignados. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-md">Cancelar</button>
              <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} className="btn btn-danger btn-md">
                <Trash2 size={14} /> {deleteMutation.isPending ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
