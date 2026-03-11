/**
 * Этап 5: Микроскопирование
 * Имитация взгляда в окуляр — вид метафазной пластинки
 */
import { PlaceholderImage } from '../components/PlaceholderImage'
import { Layout } from '../components/Layout'

export function Stage5Microscopy({ onNext }) {
  return (
    <Layout currentStep={5} totalSteps={7} title="Этап 5: Микроскопирование">
      <div className="bg-lab-surface rounded-lg border border-lab-border p-6">
        <p className="text-sm text-lab-muted mb-4">
          Имитация вида через окуляр микроскопа. Метафазная пластинка — хромосомы на стадии максимальной конденсации.
        </p>
        <div className="flex justify-center py-8">
          <PlaceholderImage
            label="Метафазная пластинка"
            sublabel="(фото под микроскопом)"
            width={320}
            height={240}
          />
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onNext}
            className="px-6 py-2 rounded bg-lab-accent text-white font-medium hover:bg-lab-accentDark"
          >
            Перейти к сортировке →
          </button>
        </div>
      </div>
    </Layout>
  )
}
