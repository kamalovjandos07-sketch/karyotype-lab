/**
 * Этап 6: Сортировка хромосом (Drag-and-Drop)
 * Слева — разбросанные хромосомы, справа — идиограмма/сетка
 */
import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import { buildChromosomeSet, getSlotConfig } from '../utils/chromosomeSet'
import { Layout } from '../components/Layout'
import { ChromosomeItem } from '../components/ChromosomeItem'
import { SortableChromosome } from '../components/SortableChromosome'
import { IdiogramGrid } from '../components/IdiogramGrid'

export function Stage6Sorting({ caseItem, sex, onNext }) {
  const chromosomes = useMemo(
    () => buildChromosomeSet(caseItem, sex),
    [caseItem?.id, sex]
  )
  const slotConfig = useMemo(() => getSlotConfig(caseItem, sex), [caseItem?.id, sex])

  const [poolItems, setPoolItems] = useState(() =>
    chromosomes.map((c) => ({ ...c }))
  )
  const [slots, setSlots] = useState(() => {
    const s = {}
    for (let i = 1; i <= 22; i++) s[i] = []
    s['X'] = []
    s['Y'] = []
    return s
  })
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const activeItem = activeId
    ? poolItems.find((c) => c.id === activeId) ||
      Object.values(slots).flat().find((c) => c?.id === activeId)
    : null

  const findItemLocation = (id) => {
    if (poolItems.some((c) => c.id === id)) return { type: 'pool' }
    for (const [pair, arr] of Object.entries(slots)) {
      if ((arr || []).some((c) => c.id === id)) return { type: 'slot', pair }
    }
    return null
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeData = poolItems.find((c) => c.id === active.id) ||
      Object.values(slots).flat().find((c) => c?.id === active.id)
    if (!activeData) return

    const overId = String(over.id)

    if (overId.startsWith('slot-')) {
      const pair = overId.replace('slot-', '')
      const pairKey = pair === 'X' || pair === 'Y' ? pair : parseInt(pair, 10)
      const expectedPair = activeData.pair
      const match = String(pairKey) === String(expectedPair)
      const maxInSlot = slotConfig[pair] ?? 2
      const currentInSlot = (slots[pair] || []).length

      if (match && currentInSlot < maxInSlot) {
        const loc = findItemLocation(active.id)
        if (loc?.type === 'pool') {
          setPoolItems((prev) => prev.filter((c) => c.id !== active.id))
          setSlots((prev) => ({
            ...prev,
            [pair]: [...(prev[pair] || []), activeData],
          }))
        } else if (loc?.type === 'slot' && loc.pair !== pair) {
          setSlots((prev) => ({
            ...prev,
            [loc.pair]: (prev[loc.pair] || []).filter((c) => c.id !== active.id),
            [pair]: [...(prev[pair] || []), activeData],
          }))
        }
      }
    } else if (overId === 'pool') {
      const loc = findItemLocation(active.id)
      if (loc?.type === 'slot') {
        setSlots((prev) => ({
          ...prev,
          [loc.pair]: (prev[loc.pair] || []).filter((c) => c.id !== active.id),
        }))
        setPoolItems((prev) => [...prev, activeData])
      }
    }
  }

  const allPlaced = poolItems.length === 0

  return (
    <Layout currentStep={6} totalSteps={7} title="Этап 6: Сортировка хромосом">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(e.active.id)}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            id="pool"
            className="bg-gray-100 rounded-lg border-2 border-dashed border-lab-border min-h-[400px] p-4 relative"
          >
            <p className="text-sm text-lab-muted mb-2">Хромосомы (перетащите на сетку)</p>
            <DroppablePool>
              {poolItems.map((chr) => (
                <SortableChromosome key={chr.id} chromosome={chr} />
              ))}
            </DroppablePool>
          </div>

          <IdiogramGrid slots={slots} slotConfig={slotConfig} caseItem={caseItem} sex={sex} />
        </div>

        <DragOverlay>
          {activeItem ? <ChromosomeItem chromosome={activeItem} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={!allPlaced}
          className="px-6 py-2 rounded bg-lab-accent text-white font-medium disabled:opacity-50 hover:bg-lab-accentDark"
        >
          Перейти к заключению →
        </button>
      </div>
    </Layout>
  )
}

function DroppablePool({ children }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'pool' })
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-wrap gap-2 content-start min-h-[320px] ${isOver ? 'bg-blue-50' : ''}`}
    >
      {children}
    </div>
  )
}
