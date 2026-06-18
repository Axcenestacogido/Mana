import { Recipe, WeeklyMenu, MenuEntry } from '../types'

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEAL_TYPES = ['comida', 'cena']

interface Props {
  menu: WeeklyMenu
  onDropRecipe?: (dayOfWeek: number, mealType: string, recipeId: number) => void
  onRemoveEntry?: (entryId: number) => void
}

export default function WeeklyBoard({ menu, onDropRecipe, onRemoveEntry }: Props) {
  const getEntry = (day: number, mealType: string): MenuEntry | undefined =>
    menu.entries.find(e => e.day_of_week === day && e.meal_type === mealType)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent, day: number, mealType: string) => {
    e.preventDefault()
    const recipeId = parseInt(e.dataTransfer.getData('recipeId'))
    if (!isNaN(recipeId) && onDropRecipe) {
      onDropRecipe(day, mealType, recipeId)
    }
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
        <thead>
          <tr>
            <th style={{ width: '80px', padding: '0.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>
              Comida
            </th>
            {DAY_NAMES.map(day => (
              <th key={day} style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEAL_TYPES.map(mealType => (
            <tr key={mealType}>
              <td style={{ padding: '0.5rem', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', textTransform: 'capitalize', verticalAlign: 'middle' }}>
                {mealType}
              </td>
              {DAY_NAMES.map((_, dayIndex) => {
                const entry = getEntry(dayIndex, mealType)
                return (
                  <td
                    key={dayIndex}
                    onDragOver={handleDragOver}
                    onDrop={e => handleDrop(e, dayIndex, mealType)}
                    style={{
                      padding: '0.25rem',
                      border: '1px solid #e5e7eb',
                      minHeight: '60px',
                      verticalAlign: 'top',
                    }}
                  >
                    {entry?.recipe ? (
                      <div style={{
                        background: mealType === 'comida' ? '#dcfce7' : '#dbeafe',
                        borderRadius: '6px',
                        padding: '0.375rem 0.5rem',
                        fontSize: '0.75rem',
                        position: 'relative',
                        minHeight: '44px',
                      }}>
                        <div style={{ fontWeight: 500, lineHeight: 1.3, paddingRight: '16px' }}>
                          {entry.recipe.name}
                        </div>
                        <div style={{ color: '#6b7280', marginTop: '2px' }}>
                          {entry.recipe.prep_time_minutes}min
                        </div>
                        {onRemoveEntry && (
                          <button
                            onClick={() => onRemoveEntry(entry.id)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: 'none',
                              border: 'none',
                              color: '#9ca3af',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              lineHeight: 1,
                              padding: '0',
                            }}
                            title="Eliminar"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ) : (
                      <div style={{
                        border: '2px dashed #d1d5db',
                        borderRadius: '6px',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d1d5db',
                        fontSize: '0.75rem',
                      }}>
                        soltar aquí
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
