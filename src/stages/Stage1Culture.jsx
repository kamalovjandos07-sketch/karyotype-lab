/**
 * Этап 1: Забор и культивирование
 * Пробирка с кровью, добавление Фитогемагглютинина, инкубация 37°C
 */
import { useState } from 'react'
import { PlaceholderImage } from '../components/PlaceholderImage'
import { StageOverlay } from '../components/StageOverlay'
import { Layout } from '../components/Layout'

const EXPLANATIONS = {
  phytohemagglutinin: {
    title: 'Фитогемагглютинин (ФГА)',
    description:
      'Лектин, стимулирующий деление лимфоцитов. Добавляется в культуру крови для индукции митоза. Лимфоциты в норме находятся в G0-фазе и не делятся; ФГА переводит их в клеточный цикл.',
  },
  incubate: {
    title: 'Инкубация при 37°C',
    description:
      'Культура выдерживается 48–72 часа при 37°C — температуре тела человека. За это время лимфоциты проходят несколько митотических циклов, достигая стадии метафазы, оптимальной для анализа хромосом.',
  },
}

export function Stage1Culture({ onNext }) {
  const [phyloAdded, setPhyloAdded] = useState(false)
  const [incubated, setIncubated] = useState(false)
  const [overlay, setOverlay] = useState(null)

  const canProceed = phyloAdded && incubated

  return (
    <Layout currentStep={1} totalSteps={7} title="Этап 1: Забор и культивирование">
      <StageOverlay
        isOpen={!!overlay}
        title={overlay?.title}
        description={overlay?.description}
        onClose={() => setOverlay(null)}
      />

      <div className="bg-lab-surface rounded-lg border border-lab-border p-6">
        <div className="flex flex-wrap gap-8 items-start justify-center">
          {/* Пробирка с кровью */}
          <div className="flex flex-col items-center">
            <PlaceholderImage label="Пробирка с кровью" sublabel="(забор)" width={100} height={140} />
          </div>

          {/* Зона добавления ФГА */}
          <div className="flex flex-col items-center gap-2">
            <PlaceholderImage
              label="Фитогемагглютинин"
              sublabel="(стимуляция митоза)"
              width={100}
              height={100}
            />
            <button
              onClick={() => setOverlay(EXPLANATIONS.phytohemagglutinin)}
              className="text-xs text-lab-accent hover:underline"
            >
              Зачем добавлять?
            </button>
            <button
              onClick={() => setPhyloAdded(true)}
              disabled={phyloAdded}
              className="px-4 py-2 rounded bg-lab-accent text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lab-accentDark"
            >
              {phyloAdded ? 'Добавлено ✓' : 'Добавить ФГА'}
            </button>
          </div>

          {/* Инкубация */}
          <div className="flex flex-col items-center gap-2">
            <PlaceholderImage label="Инкубатор 37°C" sublabel="(48–72 ч)" width={120} height={120} />
            <button
              onClick={() => setOverlay(EXPLANATIONS.incubate)}
              className="text-xs text-lab-accent hover:underline"
            >
              Зачем инкубировать?
            </button>
            <button
              onClick={() => setIncubated(true)}
              disabled={!phyloAdded || incubated}
              className="px-4 py-2 rounded bg-lab-accent text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lab-accentDark"
            >
              {incubated ? 'Инкубация завершена ✓' : 'Запустить инкубацию'}
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="px-6 py-2 rounded bg-lab-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lab-accentDark"
          >
            Далее →
          </button>
        </div>
      </div>
    </Layout>
  )
}
