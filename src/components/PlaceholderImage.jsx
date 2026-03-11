/**
 * PlaceholderImage — серый плейсхолдер с текстовой подписью
 * Используется для изображений из assetsConfig, пока не подставлены свои
 */
export function PlaceholderImage({ label, sublabel, className = '', width = 120, height = 120 }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded border-2 border-lab-border bg-gray-200 text-lab-muted ${className}`}
      style={{ width, height, minWidth: width, minHeight: height }}
    >
      <svg
        className="mb-1"
        width={width * 0.5}
        height={height * 0.5}
        viewBox="0 0 100 100"
        fill="none"
      >
        <rect width="100" height="100" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
      </svg>
      <span className="text-xs font-medium text-center px-1">{label}</span>
      {sublabel && <span className="text-[10px] text-gray-500">{sublabel}</span>}
    </div>
  )
}
