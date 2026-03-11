/**
 * Этап 2: Блокировка митоза
 * Добавление Колхицина — остановка на стадии метафазы
 */
import { useState } from 'react'
import { PlaceholderImage } from '../components/PlaceholderImage'
import { StageOverlay } from '../components/StageOverlay'
import { Layout } from '../components/Layout'

const EXPLANATION = {
  title: 'Колхицин',
  description:
    'Алкалоид, разрушающий веретено деления. Клетки останавливаются на стадии метафазы, когда хромосомы максимально конденсированы и удобны для анализа. После добавления культуру инкубируют ещё 1–2 часа.',
}

export function Stage2Colchicine({ onNext }) {
  const [colchicineAdded, setColchicineAdded] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)

  const handleAdd = () => {
    setColchicineAdded(true)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <Layout currentStep={2} totalSteps={7} title="Этап 2: Блокировка митоза">
      <StageOverlay
        isOpen={overlayOpen}
        title={EXPLANATION.title}
        description={EXPLANATION.description}
        onClose={() => setOverlayOpen(false)}
      />

      <div className="bg-lab-surface rounded-lg border border-lab-border p-6">
        <div className="flex flex-col items-center gap-6">
          <PlaceholderImage
            label="Колхицин"
            sublabel="(блокировка метафазы)"
            width={100}
            height={120}
          />
          <button
            onClick={() => setOverlayOpen(true)}
            className="text-sm text-lab-accent hover:underline"
          >
            Зачем добавлять колхицин?
          </button>

          <button
            onClick={handleAdd}
            disabled={colchicineAdded}
            className="px-6 py-3 rounded bg-lab-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lab-accentDark transition"
          >
            {colchicineAdded ? 'Добавлено ✓' : 'Добавить колхицин'}
          </button>

          {showSuccess && (
            <div className="flex items-center gap-2 text-lab-success font-medium animate-pulse">
              <span className="inline-block w-4 h-4 rounded-full bg-lab-success" />
              Митоз заблокирован — клетки на стадии метафазы
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onNext}
            disabled={!colchicineAdded}
            className="px-6 py-2 rounded bg-lab-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lab-accentDark"
          >
            Далее →
          </button>
        </div>
      </div>
    </Layout>
  )
}
