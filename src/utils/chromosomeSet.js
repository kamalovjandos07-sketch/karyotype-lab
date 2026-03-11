/**
 * chromosomeSet.js — Генерация набора хромосом для выбранного клинического случая
 * Относительные размеры пар соответствуют реальной идиограмме
 */

// Относительные размеры пар 1-22 (условные единицы для визуализации)
export const PAIR_SIZES = [
  1.9, 1.7, 1.5, 1.4, 1.3, 1.25, 1.2, 1.15, 1.1, 1.05, 1.0,
  0.98, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5
]

/**
 * Строит массив хромосом для перетаскивания
 * @param {Object} caseItem - выбранный клинический случай
 * @param {'female'|'male'} sex - пол (для нормального кариотипа)
 */
export function buildChromosomeSet(caseItem, sex = 'female') {
  const set = []
  let idCounter = 0

  const newId = () => `chr-${idCounter++}`

  // Аутосомы 1-22
  for (let i = 1; i <= 22; i++) {
    const baseCount = 2
    const extra = getExtraChromosome(caseItem.id, i)
    const count = baseCount + extra

    for (let j = 0; j < count; j++) {
      set.push({
        id: newId(),
        pair: i,
        isSex: false,
        size: PAIR_SIZES[i - 1] || 0.5,
      })
    }
  }

  // Половые хромосомы
  const sexChromosomes = getSexChromosomes(caseItem.id, sex)
  sexChromosomes.forEach((pair) => {
    set.push({
      id: newId(),
      pair,
      isSex: true,
      size: pair === 'X' ? 0.6 : 0.4,
    })
  })

  return set
}

function getExtraChromosome(caseId, pair) {
  if (caseId === 'down' && pair === 21) return 1
  if (caseId === 'edwards' && pair === 18) return 1
  if (caseId === 'patau' && pair === 13) return 1
  return 0
}

function getSexChromosomes(caseId, sex) {
  if (sex === 'male') return ['X', 'Y']
  return ['X', 'X']
}

/**
 * Возвращает максимальное количество слотов для каждой пары
 */
export function getSlotConfig(caseItem, sex = 'female') {
  const slots = {}
  for (let i = 1; i <= 22; i++) {
    const extra = getExtraChromosome(caseItem.id, i)
    slots[i] = 2 + extra
  }
  slots['X'] = sex === 'male' ? 1 : 2
  slots['Y'] = sex === 'male' ? 1 : 0
  return slots
}
