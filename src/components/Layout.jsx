/**
 * Layout — общая разметка экрана симуляции
 * Шапка, индикатор этапов, контент
 */
export function Layout({ children, currentStep, totalSteps, title }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className="min-h-screen flex flex-col bg-lab-bg">
      {/* Шапка */}
      <header className="bg-lab-surface border-b border-lab-border px-6 py-4">
        <h1 className="text-xl font-semibold text-lab-accentDark">
          Симуляция кариотипирования
        </h1>
        <p className="text-sm text-lab-muted mt-1">{title}</p>
        {/* Прогресс этапов */}
        <div className="flex gap-2 mt-4">
          {steps.map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded transition ${
                step <= currentStep
                  ? 'bg-lab-accent'
                  : 'bg-lab-border'
              }`}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
