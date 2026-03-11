/**
 * ChromosomeItem — визуальное представление одной хромосомы
 */
export function ChromosomeItem({ chromosome, isDragging }) {
  const { pair, size } = chromosome
  const width = 24 + (size || 0.5) * 20
  const height = 40

  return (
    <div
      className={`inline-flex items-center justify-center rounded border-2 border-lab-accent bg-lab-surface text-lab-accentDark font-medium text-xs shadow ${isDragging ? 'opacity-90 scale-110' : ''}`}
      style={{ width, height, minWidth: width }}
    >
      {pair}
    </div>
  )
}
