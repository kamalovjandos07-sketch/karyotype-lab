/**
 * Этап 3: Гипотоническая обработка и фиксация
 * KCl (гипотонический раствор) → фиксатор (метанол + уксусная кислота)
 */
import { useState } from 'react'
import { PlaceholderImage } from '../components/PlaceholderImage'
import { StageOverlay } from '../components/StageOverlay'
import { Layout } from '../components/Layout'

const EXPLANATIONS = {
  kcl: {
    title: 'Гипотонический раствор KCl',
    description:
      'Низкая осмолярность вызывает набухание клеток за счёт поступления воды. Ядерная мембрана разрывается, хромосомы рассредоточиваются в цитоплазме, что облегчает их последующее разделение на предметном стекле.',
  },
  fixative: {
    title: 'Фиксатор (метанол : уксусная кислота 3:1)',
    description:
      'Фиксирует клетки в текущем состоянии, предотвращает автолиз. Метанол денатурирует белки, уксусная кислота осаждает ДНК. После фиксации материал готов к приготовлению препарата.',
  },
}

export function Stage3HypotonicFixation({ onNext }) {
  const [kclAdded, setKclAdded] = useState(false)
  const [fixativeAdded, setFixativeAdded] = useState(false)
  const [overlay, setOverlay] = useState(null)

  const canProceed = kclAdded && fixativeAdded

  return (
    <Layout currentStep={3} totalSteps={7} title="Этап 3: Гипотоническая обработка и фиксация">
      <StageOverlay
        isOpen={!!overlay}
        title={overlay?.title}
        description={overlay?.description}
        onClose={() => setOverlay(null)}
      />

      <div className="bg-lab-surface rounded-lg border border-lab-border p-6">
        <div className="flex flex-wrap gap-8 items-start justify-center">
          <div className="flex flex-col items-center gap-2">
            <PlaceholderImage label="KCl (гипотонический)" sublabel="0.075 M" width={100} height={100} />
            <button onClick={() => setOverlay(EXPLANATIONS.kcl)} className="text-xs text-lab-accent hover:underline">
              Зачем?
            </button>
            <button
              onClick={() => setKclAdded(true)}
              disabled={kclAdded}
              className="px-4 py-2 rounded bg-lab-accent text-white text-sm disabled:opacity-50"
            >
              {kclAdded ? 'Добавлено ✓' : 'Добавить KCl'}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <PlaceholderImage label="Фиксатор" sublabel="метанол + CH₃COOH" width={100} height={100} />
            <button onClick={() => setOverlay(EXPLANATIONS.fixative)} className="text-xs text-lab-accent hover:underline">
              Зачем?
            </button>
            <button
              onClick={() => setFixativeAdded(true)}
              disabled={!kclAdded || fixativeAdded}
              className="px-4 py-2 rounded bg-lab-accent text-white text-sm disabled:opacity-50"
            >
              {fixativeAdded ? 'Добавлено ✓' : 'Добавить фиксатор'}
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
