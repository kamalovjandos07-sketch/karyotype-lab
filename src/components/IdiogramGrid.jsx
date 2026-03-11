/**
 * IdiogramGrid — сетка идиограммы (пары 1-22, X, Y) с droppable-зонами
 */
import { useDroppable } from '@dnd-kit/core'
import { ChromosomeItem } from './ChromosomeItem'
import { SortableChromosome } from './SortableChromosome'

function DroppableSlot({ pair, slots, slotConfig, caseItem, sex }) {
  const items = slots[pair] || []
  const maxSlots = slotConfig[pair] ?? 2
  const showY = sex === 'male'

  if (pair === 'Y' && !showY) return null

  const { setNodeRef, isOver } = useDroppable({ id: `slot-${pair}` })

  return (
    <div
      ref={setNodeRef}
      className={`rounded border-2 min-h-[44px] p-1 flex flex-wrap gap-1 items-center ${
        isOver ? 'border-lab-accent bg-blue-50' : 'border-lab-border bg-white'
      }`}
    >
      <span className="text-xs font-semibold text-lab-muted w-6">{pair}</span>
      <div className="flex flex-wrap gap-1 flex-1">
        {items.map((chr) => (
          <SortableChromosome key={chr.id} chromosome={chr} />
        ))}
        {Array.from({ length: maxSlots - items.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="inline-flex items-center justify-center rounded border border-dashed border-gray-300 text-gray-400 text-xs"
            style={{ width: 28, height: 36 }}
          >
            —
          </div>
        ))}
      </div>
    </div>
  )
}

export function IdiogramGrid({ slots, slotConfig, caseItem, sex }) {
  const showY = sex === 'male'

  return (
    <div className="bg-lab-surface rounded-lg border border-lab-border p-4">
      <p className="text-sm text-lab-muted mb-4">Идиограмма (перетащите хромосомы сюда)</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto">
        {Array.from({ length: 22 }, (_, i) => i + 1).map((pair) => (
          <DroppableSlot
            key={pair}
            pair={pair}
            slots={slots}
            slotConfig={slotConfig}
            caseItem={caseItem}
            sex={sex}
          />
        ))}
        <DroppableSlot
          pair="X"
          slots={slots}
          slotConfig={slotConfig}
          caseItem={caseItem}
          sex={sex}
        />
        {showY && (
          <DroppableSlot
            pair="Y"
            slots={slots}
            slotConfig={slotConfig}
            caseItem={caseItem}
            sex={sex}
          />
        )}
      </div>
    </div>
  )
}
