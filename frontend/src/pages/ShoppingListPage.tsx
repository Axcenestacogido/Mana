import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Clipboard, Printer, RefreshCw, Trash2, Check } from 'lucide-react'
import { getMenus } from '../api/menu'
import { getShoppingList, generateShoppingList, toggleShoppingItem, deleteShoppingList } from '../api/shopping'
import { ShoppingItem } from '../types'

export default function ShoppingListPage() {
  const queryClient = useQueryClient()
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)

  const { data: menus = [] } = useQuery({
    queryKey: ['menus'],
    queryFn: getMenus,
    onSuccess: (data: any[]) => {
      if (data.length > 0 && !selectedMenuId) setSelectedMenuId(data[0].id)
    },
  } as any)

  const menuId = selectedMenuId || (menus as any[])[0]?.id

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['shopping', menuId],
    queryFn: () => getShoppingList(menuId!),
    enabled: !!menuId,
  })

  const generateMutation = useMutation({
    mutationFn: () => generateShoppingList(menuId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shopping', menuId] }),
  })

  const toggleMutation = useMutation({
    mutationFn: (itemId: number) => toggleShoppingItem(menuId!, itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shopping', menuId] }),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteShoppingList(menuId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shopping', menuId] }),
  })

  const handleCopy = () => {
    const text = (items as ShoppingItem[])
      .map(i => `${i.is_checked ? '✓' : '○'} ${i.ingredient_name}: ${i.total_quantity} ${i.unit}`)
      .join('\n')
    navigator.clipboard.writeText(text).then(() => alert('Lista copiada al portapapeles'))
  }

  const allItems = items as ShoppingItem[]
  const checkedCount = allItems.filter(i => i.is_checked).length
  const totalCount = allItems.length
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0

  const CATEGORY_ORDER = ['verduras','frutas','carnes','pescados','lácteos','huevos','cereales','legumbres','aceites y salsas','especias','otros']
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const catItems = allItems.filter(i => (i.category ?? 'otros') === cat)
    if (catItems.length > 0) acc[cat] = catItems
    return acc
  }, {} as Record<string, ShoppingItem[]>)

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Lista de compra</h1>
          {totalCount > 0 && (
            <p className="page-sub">{checkedCount} de {totalCount} ingredientes comprados</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }} className="no-print">
          <button onClick={handleCopy} disabled={totalCount === 0} className="btn btn-secondary btn-md">
            <Clipboard size={15} /> Copiar
          </button>
          <button onClick={() => window.print()} className="btn btn-secondary btn-md">
            <Printer size={15} /> Imprimir
          </button>
          <button onClick={() => generateMutation.mutate()} disabled={!menuId || generateMutation.isPending} className="btn btn-primary btn-md">
            <RefreshCw size={15} /> {generateMutation.isPending ? 'Generando…' : 'Generar lista'}
          </button>
        </div>
      </div>

      {/* Menu selector */}
      {(menus as any[]).length > 1 && (
        <div className="no-print form-group" style={{ maxWidth: 320 }}>
          <label className="form-label">Menú:</label>
          <select
            value={menuId || ''}
            onChange={e => setSelectedMenuId(parseInt(e.target.value))}
            className="form-input"
          >
            {(menus as any[]).map((m: any) => (
              <option key={m.id} value={m.id}>{m.name || `Semana ${m.week_start_date}`}</option>
            ))}
          </select>
        </div>
      )}

      {!menuId && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
          No hay menús disponibles. Crea un menú semanal primero.
        </div>
      )}

      {menuId && isLoading && <div className="loading">Cargando…</div>}

      {menuId && !isLoading && (
        <>
          {/* Progress bar */}
          {totalCount > 0 && (
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <div style={{ height: 6, background: 'var(--neutral-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${progress}%`,
                  background: 'var(--accent)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width var(--dur-slow) var(--ease-standard)',
                }} />
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {totalCount === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: 'var(--space-4)' }}>La lista está vacía</p>
                <button onClick={() => generateMutation.mutate()} className="btn btn-primary btn-md">
                  Generar lista de compras
                </button>
              </div>
            ) : (
              <div>
                {Object.entries(grouped).map(([cat, catItems]) => (
                  <div key={cat}>
                    <div style={{ padding: 'var(--space-2) var(--space-5)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--text-subtle)', background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-subtle)', borderTop: '1px solid var(--border-subtle)' }}>
                      {cat}
                    </div>
                    <ul style={{ listStyle: 'none' }}>
                      {catItems.map((item, i) => (
                        <li key={item.id} onClick={() => toggleMutation.mutate(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: i < catItems.length - 1 ? '1px solid var(--border-subtle)' : 'none', cursor: 'pointer', opacity: item.is_checked ? 0.55 : 1, transition: 'opacity var(--dur-fast), background var(--dur-fast)' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-sunken)')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
                          <div style={{ width: 20, height: 20, borderRadius: 'var(--radius-xs)', border: `1.5px solid ${item.is_checked ? 'var(--accent)' : 'var(--border-default)'}`, background: item.is_checked ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all var(--dur-fast)' }}>
                            {item.is_checked && <Check size={12} color="white" strokeWidth={3} />}
                          </div>
                          <span style={{ flex: 1, textTransform: 'capitalize', fontSize: 'var(--text-sm)', color: 'var(--text-body)', textDecoration: item.is_checked ? 'line-through' : 'none' }}>{item.ingredient_name}</span>
                          <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{item.total_quantity} {item.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalCount > 0 && (
            <div className="no-print" style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { if (confirm('¿Eliminar la lista de compras?')) deleteMutation.mutate() }}
                className="btn btn-ghost btn-md"
                style={{ color: 'var(--danger)' }}
              >
                <Trash2 size={14} /> Eliminar lista
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
