/**
 * SortableChromosome — перетаскиваемая хромосома (useDraggable)
 */
import { useDraggable } from '@dnd-kit/core'
import { ChromosomeItem } from './ChromosomeItem'

export function SortableChromosome({ chromosome }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: chromosome.id,
    data: chromosome,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <ChromosomeItem chromosome={chromosome} isDragging={isDragging} />
    </div>
  )
}
