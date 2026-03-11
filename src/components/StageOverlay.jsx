/**
 * StageOverlay — поп-ап/тултип с объяснением этапа
 * Показывает образовательную информацию о реагентах и процедурах
 */
export function StageOverlay({ title, description, isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-lab-surface rounded-lg shadow-xl border border-lab-border max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-lab-accentDark mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-lab-accent text-white rounded hover:bg-lab-accentDark transition"
        >
          Понятно
        </button>
      </div>
    </div>
  )
}
