/**
 * Этап 4: Приготовление препарата и окрашивание
 * Раскапывание суспензии на стекло, G-окрашивание (Романовский–Гимза)
 */
import { useState } from 'react'
import { PlaceholderImage } from '../components/PlaceholderImage'
import { StageOverlay } from '../components/StageOverlay'
import { Layout } from '../components/Layout'

const EXPLANATIONS = {
  spread: {
    title: 'Приготовление препарата',
    description:
      'Капля фиксированной суспензии наносится на предметное стекло и раскапывается. При высыхании клетки разрываются, хромосомы равномерно распределяются на поверхности стекла.',
  },
  giemsa: {
    title: 'G-окрашивание (Романовский–Гимза)',
    description:
      'Краситель связывается с богатыми АТ-парами участками ДНК. Образуется характерная полосчатость (G-бэнды), позволяющая идентифицировать каждую хромосому по уникальному паттерну полос.',
  },
}

export function Stage4Staining({ onNext }) {
  const [spreadDone, setSpreadDone] = useState(false)
  const [stained, setStained] = useState(false)
  const [overlay, setOverlay] = useState(null)

  const canProceed = spreadDone && stained

  return (
    <Layout currentStep={4} totalSteps={7} title="Этап 4: Приготовление препарата и окрашивание">
      <StageOverlay
        isOpen={!!overlay}
        title={overlay?.title}
        description={overlay?.description}
        onClose={() => setOverlay(null)}
      />

      <div className="bg-lab-surface rounded-lg border border-lab-border p-6">
        <div className="flex flex-wrap gap-8 items-start justify-center">
          <div className="flex flex-col items-center gap-2">
            <PlaceholderImage label="Предметное стекло" sublabel="раскапывание" width={120} height={80} />
            <button onClick={() => setOverlay(EXPLANATIONS.spread)} className="text-xs text-lab-accent hover:underline">
              Зачем?
            </button>
            <button
              onClick={() => setSpreadDone(true)}
              disabled={spreadDone}
              className="px-4 py-2 rounded bg-lab-accent text-white text-sm disabled:opacity-50"
            >
              {spreadDone ? 'Препарат готов ✓' : 'Раскапать суспензию'}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <PlaceholderImage label="Романовский–Гимза" sublabel="G-окрашивание" width={100} height={100} />
            <button onClick={() => setOverlay(EXPLANATIONS.giemsa)} className="text-xs text-lab-accent hover:underline">
              Зачем?
            </button>
            <button
              onClick={() => setStained(true)}
              disabled={!spreadDone || stained}
              className="px-4 py-2 rounded bg-lab-accent text-white text-sm disabled:opacity-50"
            >
              {stained ? 'Окрашено ✓' : 'Применить краситель'}
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="px-6 py-2 rounded bg-lab-accent text-white font-medium disabled:opacity-50 hover:bg-lab-accentDark"
          >
            Далее →
          </button>
        </div>
      </div>
    </Layout>
  )
}
