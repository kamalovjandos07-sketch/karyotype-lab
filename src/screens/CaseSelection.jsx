/**
 * CaseSelection — экран выбора клинического случая перед стартом симуляции
 */
import { useState } from 'react'
import { CLINICAL_CASES } from '../config/clinicalCases'

export function CaseSelection({ onSelect }) {
  const [selectedCase, setSelectedCase] = useState(null)

  const handleCaseClick = (caseItem) => {
    setSelectedCase(caseItem)
  }

  const handleSexSelect = (sex) => {
    onSelect(selectedCase, sex)
  }

  return (
    <div className="min-h-screen bg-lab-bg flex flex-col">
      <header className="bg-lab-surface border-b border-lab-border px-6 py-8">
        <h1 className="text-2xl font-bold text-lab-accentDark">
          Симулятор кариотипирования
        </h1>
        <p className="text-lab-muted mt-2">
          Интерактивная цитогенетическая лаборатория для обучения
        </p>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Выберите клинический случай
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CLINICAL_CASES.map((caseItem) => (
            <button
              key={caseItem.id}
              onClick={() => handleCaseClick(caseItem)}
              className={`text-left p-5 rounded-lg border-2 bg-lab-surface transition ${
                selectedCase?.id === caseItem.id
                  ? 'border-lab-accent bg-blue-50/50'
                  : 'border-lab-border hover:border-lab-accent hover:bg-blue-50/30'
              }`}
            >
              <h3 className="font-semibold text-lab-accentDark">
                {caseItem.name}
              </h3>
              <p className="text-sm text-lab-muted mt-1">{caseItem.description}</p>
              <span className="inline-block mt-3 text-xs text-lab-accent font-medium">
                {selectedCase?.id === caseItem.id ? 'Выбрано' : 'Выбрать →'}
              </span>
            </button>
          ))}
        </div>

        {selectedCase && (
          <div className="mt-8 p-4 bg-lab-surface rounded-lg border border-lab-border">
            <p className="text-sm text-lab-muted mb-3">
              Выбран: <strong>{selectedCase.name}</strong>. Укажите пол пациента:
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleSexSelect('female')}
                className="px-4 py-2 rounded bg-lab-accent text-white hover:bg-lab-accentDark"
              >
                46/47,XX (Женский)
              </button>
              <button
                onClick={() => handleSexSelect('male')}
                className="px-4 py-2 rounded bg-lab-accent text-white hover:bg-lab-accentDark"
              >
                46/47,XY (Мужской)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
