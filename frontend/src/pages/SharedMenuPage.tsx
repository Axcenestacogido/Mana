import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getSharedMenu } from '../api/menu'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function SharedMenuPage() {
  const { token } = useParams<{ token: string }>()

  const { data: menu, isLoading, isError } = useQuery({
    queryKey: ['shared-menu', token],
    queryFn: () => getSharedMenu(token!),
    enabled: Boolean(token),
  })

  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf9f7' }}>
      <p style={{ color: '#999' }}>Cargando menú...</p>
    </div>
  )

  if (isError || !menu) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#faf9f7', gap: 12 }}>
      <p style={{ fontSize: 48 }}>😕</p>
      <p style={{ fontSize: 20, fontWeight: 600 }}>Enlace no válido</p>
      <p style={{ color: '#999' }}>Este enlace ha caducado o no existe.</p>
    </div>
  )

  const getEntry = (day: number, meal: string) =>
    menu.entries.find(e => e.day_of_week === day && e.meal_type === meal)

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7' }}>
      <div style={{ background: '#b5451b', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22 }}>🍽</span>
        <div>
          <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{menu.name ?? 'Menú semanal'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0 }}>
            Semana del {menu.week_start_date} · Solo lectura
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
        <div style={{ overflowX: 'auto', marginBottom: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(200px, 1fr))', gap: 10, minWidth: 1000 }}>
          {DAYS.map((day, di) => (
            <div key={di}>
              <div style={{ textAlign: 'center', fontWeight: 700, padding: '10px 0', fontSize: 13, color: '#444' }}>{day}</div>
              {[
                { key: 'comida', label: 'Comida', slots: ['comida_primero', 'comida_segundo'] },
                { key: 'cena',   label: 'Cena',   slots: ['cena_primero',   'cena_segundo']   },
              ].map(group => (
                <div key={group.key} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>{group.label}</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {group.slots.map((slotKey, idx) => {
                      const entry = getEntry(di, slotKey)
                      return (
                        <div key={slotKey} style={{
                          flex: 1, minHeight: 70, border: '1px solid #e8e0d8', borderRadius: 8, padding: 8,
                          background: entry?.recipe ? 'white' : '#f5f0ea', overflow: 'hidden',
                        }}>
                          <div style={{ fontSize: 9, color: '#bbb', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>
                            {idx === 0 ? '1°' : idx === 1 ? '2°' : 'Postre'}
                          </div>
                          {entry?.recipe ? (
                            <>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {entry.recipe.name}
                              </div>
                              <div style={{ fontSize: 10, color: '#888' }}>
                                {entry.recipe.prep_time_minutes} min · {entry.recipe.servings} pers.
                              </div>
                            </>
                          ) : (
                            <div style={{ fontSize: 11, color: '#ccc', fontStyle: 'italic' }}>—</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        </div>

        {/* Lista de recetas con ingredientes */}
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Recetas de esta semana</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {Array.from(new Map(
              menu.entries
                .filter(e => e.recipe)
                .map(e => [e.recipe!.id, e.recipe!])
            ).values()).map(recipe => (
              <div key={recipe.id} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{recipe.name}</h3>
                <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>
                  {recipe.prep_time_minutes} min · {recipe.servings} porciones
                </p>
                {recipe.ingredients.length > 0 && (
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Ingredientes:</p>
                    <ul style={{ paddingLeft: 18, fontSize: 13, color: '#555' }}>
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing.ingredient_name}{ing.quantity ? ` — ${ing.quantity} ${ing.unit ?? ''}` : ''}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 40, textAlign: 'center', color: '#bbb', fontSize: 12 }}>
          Generado con App de Recetas y Menú Semanal
        </p>
      </div>
    </div>
  )
}
