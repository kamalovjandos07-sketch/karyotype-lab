/**
 * Этап 7: Заключение
 * Пользователь вводит или выбирает формулу ISCN, система проверяет
 */
import { useState } from 'react'
import { Layout } from '../components/Layout'

export function Stage7Conclusion({ caseItem, sex, onRestart }) {
  const correctAnswers = caseItem?.correctAnswers || []
  const [inputValue, setInputValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const normalized = (s) => s.replace(/\s/g, '').toUpperCase()

  const handleSubmit = () => {
    const val = normalized(inputValue)
    const match = correctAnswers.some((a) => normalized(a) === val)
    setIsCorrect(match)
    setSubmitted(true)
  }

  const options = caseItem?.correctAnswers || []

  return (
    <Layout currentStep={7} totalSteps={7} title="Этап 7: Заключение">
      <div className="bg-lab-surface rounded-lg border border-lab-border p-6 max-w-lg">
        <h3 className="text-lg font-semibold text-lab-accentDark mb-2">
          Введите формулу кариотипа (номенклатура ISCN)
        </h3>
        <p className="text-sm text-lab-muted mb-4">
          Например: 46,XX или 47,XY,+21
        </p>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="46,XX"
            className="px-4 py-2 border border-lab-border rounded focus:ring-2 focus:ring-lab-accent focus:border-lab-accent"
            disabled={submitted}
          />
          <div className="flex gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setInputValue(opt)}
                disabled={submitted}
                className="px-3 py-1 text-sm border border-lab-border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitted || !inputValue.trim()}
            className="px-6 py-2 rounded bg-lab-accent text-white font-medium disabled:opacity-50 hover:bg-lab-accentDark"
          >
            Проверить
          </button>
        </div>

        {submitted && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              isCorrect ? 'bg-green-50 border border-lab-success text-lab-success' : 'bg-red-50 border border-lab-error text-lab-error'
            }`}
          >
            {isCorrect ? (
              <>
                <p className="font-semibold">Верно!</p>
                <p className="text-sm mt-1">
                  Кариотип {inputValue} — {caseItem?.name}.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">Неверно</p>
                <p className="text-sm mt-1">
                  Правильный ответ: {correctAnswers.join(' или ')}
                </p>
              </>
            )}
          </div>
        )}

        <button
          onClick={onRestart}
          className="mt-6 text-sm text-lab-accent hover:underline"
        >
          ← Начать заново
        </button>
      </div>
    </Layout>
  )
}
