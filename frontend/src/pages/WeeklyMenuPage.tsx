import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, RefreshCw, ShoppingCart, Share2, Copy, Check, X, Calendar, Pencil, Trash2 } from 'lucide-react'
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
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function fmtDate(d: Date) {
  return d.toISOString().split('T')[0]
}

function fmtRange(start: Date) {
  const end = addDays(start, 6)
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  if (start.getMonth() === end.getMonth())
    return `${start.getDate()}–${end.getDate()} ${months[start.getMonth()]}`
  return `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]}`
}

interface SlotProps {
  entry: any
  meal: string
  dragging: Recipe | null
  onDrop: () => void
  onClick: () => void
}

function MenuSlot({ entry, meal, dragging, onDrop, onClick }: SlotProps) {
  const [over, setOver] = useState(false)
  return (
    <div
      onDragOver={e => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={() => { setOver(false); onDrop() }}
      onClick={onClick}
      style={{
        minHeight: 76, borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)', marginBottom: 'var(--space-2)',
        border: `1px ${entry?.recipe ? 'solid' : 'dashed'} ${over ? 'var(--primary)' : 'var(--border-subtle)'}`,
        background: over ? 'var(--primary-soft)' : entry?.recipe ? 'var(--surface-warm)' : 'var(--surface-sunken)',
        cursor: entry?.recipe ? 'pointer' : dragging ? 'copy' : 'default',
        transition: 'all var(--dur-fast)',
        transform: over ? 'scale(1.02)' : 'none',
      }}
    >
      <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 4 }}>
        {MEAL_LABEL[meal]}
      </div>
      {entry?.recipe ? (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', lineHeight: 'var(--leading-snug)' }}>
          {entry.recipe.name}
        </div>
      ) : (
        <div style={{ fontSize: 'var(--text-xs)', color: over ? 'var(--primary)' : 'var(--text-subtle)', marginTop: 4 }}>
          {over ? 'Soltar aquí' : 'Arrastra aquí'}
        </div>
      )}
    </div>
  )
}

export default function WeeklyMenuPage() {
  const qc = useQueryClient()
  const [weekOffset, setWeekOffset] = useState(0)
  const [dragging, setDragging] = useState<Recipe | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [mobileDay, setMobileDay] = useState(0)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const monday = useMemo(() => getMonday(), [])
  const weeks = useMemo(() => [0, 1, 2].map(i => {
    const start = addDays(monday, i * 7)
    return {
      offset: i,
      start,
      dateStr: fmtDate(start),
      label: i === 0 ? 'Esta semana' : i === 1 ? 'Próxima semana' : 'En 2 semanas',
      range: fmtRange(start),
    }
  }), [monday])

  const activeWeek = weeks[weekOffset]

  const { data: menus = [] } = useQuery({ queryKey: ['menus'], queryFn: getMenus })
  const existingMenu = menus.find(m => m.week_start_date === activeWeek.dateStr) ?? null

  const { data: activeMenu, isLoading: menuLoading } = useQuery({
    queryKey: ['menu', existingMenu?.id],
    queryFn: () => getMenu(existingMenu!.id),
    enabled: !!existingMenu,
  })

  const { data: recipes = [] } = useQuery({ queryKey: ['recipes'], queryFn: () => getRecipes() })

  const createMutation = useMutation({
    mutationFn: () => createMenu({ week_start_date: activeWeek.dateStr, name: `Semana del ${activeWeek.dateStr}` }),
    onSuccess: (m) => {
      setCreateError(null)
      qc.invalidateQueries({ queryKey: ['menus'] })
      qc.invalidateQueries({ queryKey: ['menu', m.id] })
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
    mutationFn: (name: string) => updateMenu(existingMenu!.id, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menus'] })
      qc.invalidateQueries({ queryKey: ['menu', existingMenu!.id] })
      setShowEditModal(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteMenu(existingMenu!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menus'] })
      setShowDeleteConfirm(false)
    },
  })

  useEffect(() => {
    if (activeMenu) setEditName(activeMenu.name ?? activeWeek.dateStr)
  }, [activeMenu, activeWeek.dateStr])

  const getEntry = (day: number, meal: string) =>
    activeMenu?.entries?.find((e: any) => e.day_of_week === day && e.meal_type === meal)

  const handleAssign = (day: number, meal: string) => {
    if (!activeMenu) return
    const entry = getEntry(day, meal)
    if (selectedRecipe) {
      setEntryMutation.mutate({ day, meal, recipeId: selectedRecipe.id })
      setSelectedRecipe(null)
    } else if (entry?.recipe) {
      setEntryMutation.mutate({ day, meal, recipeId: undefined })
    }
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
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Menú semanal</h1>
          <p className="page-sub">{activeWeek.range}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {activeMenu && <>
            <Link to={`/compra/${activeMenu.id}`} className="btn btn-secondary btn-md">
              <ShoppingCart size={15} /> Lista de compra
            </Link>
            <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="btn btn-secondary btn-md">
              <RefreshCw size={15} /> {generateMutation.isPending ? 'Generando…' : 'Auto-generar'}
            </button>
            <button onClick={() => shareMutation.mutate()} disabled={shareMutation.isPending} className="btn btn-secondary btn-md">
              <Share2 size={15} /> Compartir
            </button>
            <button onClick={() => setShowEditModal(true)} className="btn btn-secondary btn-md">
              <Pencil size={14} /> Renombrar
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-ghost btn-md" style={{ color: 'var(--danger)' }}>
              <Trash2 size={14} />
            </button>
          </>}
        </div>
      </div>

      {/* Week tabs */}
      <div className="week-tabs">
        {weeks.map(w => (
          <button
            key={w.offset}
            onClick={() => { setWeekOffset(w.offset); setSelectedRecipe(null) }}
            className={`week-tab${weekOffset === w.offset ? ' active' : ''}`}
          >
            <span className="week-tab-label">{w.label}</span>
            <span className="week-tab-range">{w.range}</span>
            {menus.find(m => m.week_start_date === w.dateStr) && (
              <span className="week-tab-dot" />
            )}
          </button>
        ))}
      </div>

      {/* Error */}
      {createError && <div className="error-msg" style={{ marginBottom: 'var(--space-4)' }}>{createError}</div>}

      {/* Share banner */}
      {shareUrl && (
        <div style={{ background: 'var(--success-soft)', border: '1px solid var(--sage-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Share2 size={15} color="var(--success)" />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--success-fg)', flex: 1, wordBreak: 'break-all' }}>{shareUrl}</span>
          <button onClick={copyShareUrl} className="btn btn-sage btn-sm">{copied ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> Copiar</>}</button>
          <button onClick={() => revokeMutation.mutate()} className="btn btn-danger btn-sm"><X size={13} /> Revocar</button>
        </div>
      )}

      {/* No menu for this week */}
      {!existingMenu && !menuLoading && (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-8)', background: 'var(--surface-card)', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-6)' }}>
          <Calendar size={36} color="var(--text-subtle)" style={{ margin: '0 auto var(--space-4)' }} />
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text-strong)', marginBottom: 'var(--space-2)' }}>Sin menú para esta semana</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-5)' }}>Crea el menú y empieza a planificar {activeWeek.label.toLowerCase()}.</p>
          <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending} className="btn btn-primary btn-md">
            <Plus size={15} /> {createMutation.isPending ? 'Creando…' : 'Crear menú'}
          </button>
        </div>
      )}

      {/* Menu content */}
      {activeMenu && (
        <>
          {/* DESKTOP grid (hidden on mobile via CSS) */}
          <div className="menu-grid-desktop" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--space-6)', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(120px, 1fr))', gap: 'var(--space-3)', minWidth: 720 }}>
              {DAYS.map((day, di) => (
                <div key={di}>
                  <div style={{ textAlign: 'center', padding: 'var(--space-2) 0 var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {day}
                  </div>
                  {MEAL_SLOTS.map(meal => {
                    const entry = getEntry(di, meal)
                    return (
                      <MenuSlot
                        key={meal}
                        entry={entry}
                        meal={meal}
                        dragging={dragging}
                        onDrop={() => { if (dragging) { setEntryMutation.mutate({ day: di, meal, recipeId: dragging.id }); setDragging(null) } }}
                        onClick={() => { if (entry?.recipe) setEntryMutation.mutate({ day: di, meal, recipeId: undefined }) }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE day picker (hidden on desktop via CSS) */}
          <div className="menu-mobile-view">
            {/* Day selector */}
            <div className="menu-day-picker">
              {DAYS.map((day, di) => {
                const hasAny = MEAL_SLOTS.some(m => getEntry(di, m)?.recipe)
                return (
                  <button
                    key={di}
                    onClick={() => setMobileDay(di)}
                    className={`menu-day-chip${mobileDay === di ? ' active' : ''}${hasAny ? ' has-entries' : ''}`}
                  >
                    <span className="menu-day-chip-name">{day}</span>
                    {hasAny && <span className="menu-day-chip-dot" />}
                  </button>
                )
              })}
            </div>

            {/* Slots for selected day */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {MEAL_SLOTS.map(meal => {
                const entry = getEntry(mobileDay, meal)
                return (
                  <div
                    key={meal}
                    className={`menu-mobile-slot${selectedRecipe ? ' drop-ready' : ''}${entry?.recipe ? ' filled' : ''}`}
                    onClick={() => handleAssign(mobileDay, meal)}
                  >
                    <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: entry?.recipe ? 'var(--primary)' : 'var(--text-subtle)', marginBottom: 4 }}>
                      {MEAL_LABEL[meal]}
                    </div>
                    {entry?.recipe ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{entry.recipe.name}</span>
                        <button onClick={e => { e.stopPropagation(); setEntryMutation.mutate({ day: mobileDay, meal, recipeId: undefined }) }} style={{ color: 'var(--text-subtle)', display: 'flex', padding: 4 }}><X size={14} /></button>
                      </div>
                    ) : (
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-subtle)' }}>
                        {selectedRecipe ? `Toca para asignar «${selectedRecipe.name}»` : 'Selecciona una receta abajo'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recipe bank */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            {/* Selected recipe banner */}
            {selectedRecipe && (
              <div style={{ background: 'var(--primary-soft)', border: '1px solid var(--terracotta-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', flex: 1, fontWeight: 'var(--fw-semibold)' }}>Asignando: {selectedRecipe.name}</span>
                <button onClick={() => setSelectedRecipe(null)} style={{ color: 'var(--primary)', display: 'flex' }}><X size={15} /></button>
              </div>
            )}

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 4 }}>Banco de recetas</h2>
            <p className="menu-bank-hint menu-bank-hint-desktop">Arrastra una receta a cualquier slot del tablero</p>
            <p className="menu-bank-hint menu-bank-hint-mobile">Toca una receta para seleccionarla, luego toca el slot</p>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
              {recipes.map(r => (
                <div
                  key={r.id}
                  draggable
                  onDragStart={() => { setDragging(r); setSelectedRecipe(null) }}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => setSelectedRecipe(prev => prev?.id === r.id ? null : r)}
                  className={`recipe-bank-chip${selectedRecipe?.id === r.id ? ' selected' : ''}${r.meal_type === 'comida' ? ' chip-comida' : r.meal_type === 'cena' ? ' chip-cena' : ' chip-desayuno'}`}
                >
                  {r.name}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
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
              Se borrará «{activeMenu?.name ?? activeWeek.dateStr}» y todos sus platos asignados. Esta acción no se puede deshacer.
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
