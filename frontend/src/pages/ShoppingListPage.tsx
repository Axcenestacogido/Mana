import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
      if (data.length > 0 && !selectedMenuId) {
        setSelectedMenuId(data[0].id)
      }
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

  const checkedCount = (items as ShoppingItem[]).filter(i => i.is_checked).length
  const totalCount = (items as ShoppingItem[]).length

  return (
    <div style={{ maxWidth: '700px' }}>
      <div className="page-header">
        <h1 className="page-title">Lista de Compras</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="no-print">
          <button onClick={handleCopy} className="btn btn-secondary" disabled={totalCount === 0}>
            📋 Copiar lista
          </button>
          <button onClick={() => window.print()} className="btn btn-secondary">
            🖨 Imprimir
          </button>
          <button
            onClick={() => generateMutation.mutate()}
            className="btn btn-primary"
            disabled={!menuId || generateMutation.isPending}
          >
            {generateMutation.isPending ? 'Generando...' : '🔄 Generar lista'}
          </button>
        </div>
      </div>

      <div className="no-print" style={{ marginBottom: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Seleccionar menú:</label>
          <select
            value={menuId || ''}
            onChange={e => setSelectedMenuId(parseInt(e.target.value))}
            className="form-input"
            style={{ maxWidth: '300px' }}
          >
            {(menus as any[]).map((m: any) => (
              <option key={m.id} value={m.id}>{m.name || `Semana ${m.week_start_date}`}</option>
            ))}
          </select>
        </div>
      </div>

      {!menuId && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          No hay menús disponibles. Crea un menú semanal primero.
        </div>
      )}

      {menuId && isLoading && <div className="loading">Cargando...</div>}

      {menuId && !isLoading && (
        <>
          {totalCount > 0 && (
            <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
              {checkedCount} de {totalCount} ingredientes comprados
              <div style={{ marginTop: '0.5rem', height: '6px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%`, background: '#16a34a', borderRadius: '999px', transition: 'width 0.3s' }} />
              </div>
            </div>
          )}

          <div className="card">
            {totalCount === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p style={{ marginBottom: '1rem' }}>La lista está vacía</p>
                <button onClick={() => generateMutation.mutate()} className="btn btn-primary">
                  Generar lista de compras
                </button>
              </div>
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {(items as ShoppingItem[]).map((item, i) => (
                  <li
                    key={item.id}
                    onClick={() => toggleMutation.mutate(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0.5rem',
                      borderBottom: i < totalCount - 1 ? '1px solid #f3f4f6' : 'none',
                      cursor: 'pointer',
                      opacity: item.is_checked ? 0.5 : 1,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: item.is_checked ? '#16a34a' : '#d1d5db',
                      background: item.is_checked ? '#16a34a' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.15s',
                    }}>
                      {item.is_checked && <span style={{ color: 'white', fontSize: '0.75rem' }}>✓</span>}
                    </div>
                    <span style={{ flex: 1, textTransform: 'capitalize', textDecoration: item.is_checked ? 'line-through' : 'none' }}>
                      {item.ingredient_name}
                    </span>
                    <span style={{ fontWeight: 500, color: '#374151' }}>
                      {item.total_quantity} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {totalCount > 0 && (
            <div className="no-print" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => { if (confirm('¿Eliminar la lista de compras?')) deleteMutation.mutate() }} className="btn btn-danger">
                Eliminar lista
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
