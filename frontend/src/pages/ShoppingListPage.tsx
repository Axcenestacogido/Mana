import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Printer, Copy, Check } from 'lucide-react'
import { getShoppingList } from '../api/shopping'
import { getMenus } from '../api/menu'

export default function ShoppingListPage() {
  const { menuId } = useParams<{ menuId?: string }>()
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const { data: menus = [] } = useQuery({ queryKey: ['menus'], queryFn: getMenus })
  const effectiveId = menuId ? Number(menuId) : menus[0]?.id

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['shopping', effectiveId],
    queryFn: () => getShoppingList(effectiveId!),
    enabled: Boolean(effectiveId),
  })

  const toggle = (name: string) => setChecked(s => {
    const next = new Set(s)
    next.has(name) ? next.delete(name) : next.add(name)
    return next
  })

  const copyText = () => {
    const text = items.map(i => `${checked.has(i.ingredient_name) ? '✓' : '☐'} ${i.ingredient_name}${i.total_quantity ? ` — ${i.total_quantity} ${i.unit ?? ''}` : ''}`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Lista de la compra</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={copyText} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #ddd', borderRadius: 8, background: 'white' }}>
            {copied ? <><Check size={16} /> Copiado</> : <><Copy size={16} /> Copiar</>}
          </button>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #ddd', borderRadius: 8, background: 'white' }}>
            <Printer size={16} /> Imprimir
          </button>
        </div>
      </div>

      {isLoading ? <p>Cargando...</p> : items.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: 40 }}>No hay ingredientes. Crea un menú semanal primero.</p>
      ) : (
        <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          {items.map(item => (
            <div key={item.ingredient_name} onClick={() => toggle(item.ingredient_name)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer',
                background: checked.has(item.ingredient_name) ? '#f9f9f9' : 'white' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 20, height: 20, borderRadius: 4, border: '2px solid', flexShrink: 0,
                  borderColor: checked.has(item.ingredient_name) ? '#b5451b' : '#ddd',
                  background: checked.has(item.ingredient_name) ? '#b5451b' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {checked.has(item.ingredient_name) && <Check size={12} color="white" />}
                </span>
                <span style={{ textDecoration: checked.has(item.ingredient_name) ? 'line-through' : 'none', color: checked.has(item.ingredient_name) ? '#aaa' : '#1a1a1a' }}>
                  {item.ingredient_name}
                </span>
              </span>
              {item.total_quantity && (
                <span style={{ color: '#666', fontSize: 14 }}>{item.total_quantity} {item.unit ?? ''}</span>
              )}
            </div>
          ))}
        </div>
      )}
      {checked.size > 0 && (
        <p style={{ marginTop: 16, color: '#888', textAlign: 'center', fontSize: 14 }}>
          {checked.size} de {items.length} artículos marcados
        </p>
      )}
    </div>
  )
}
