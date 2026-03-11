/**
 * clinicalCases.js — Клинические случаи для симуляции кариотипирования
 * Хранит правильные ответы (ISCN) для каждого варианта
 */

export const CLINICAL_CASES = [
  {
    id: 'normal',
    name: 'Классический кариотип (Норма)',
    shortName: 'Норма',
    description: 'Нормальный кариотип без хромосомных аномалий',
    correctAnswers: ['46,XX', '46,XY'],
    sexOptions: ['female', 'male'],
    chromosomeSet: 'normal', // 46 хромосом: 22 пары + XX или XY
  },
  {
    id: 'down',
    name: 'Синдром Дауна (Трисомия 21)',
    shortName: 'Трисомия 21',
    description: 'Дополнительная хромосома 21',
    correctAnswers: ['47,XX,+21', '47,XY,+21'],
    sexOptions: ['female', 'male'],
    chromosomeSet: 'trisomy21',
  },
  {
    id: 'edwards',
    name: 'Синдром Эдвардса (Трисомия 18)',
    shortName: 'Трисомия 18',
    description: 'Дополнительная хромосома 18',
    correctAnswers: ['47,XX,+18', '47,XY,+18'],
    sexOptions: ['female', 'male'],
    chromosomeSet: 'trisomy18',
  },
  {
    id: 'patau',
    name: 'Синдром Патау (Трисомия 13)',
    shortName: 'Трисомия 13',
    description: 'Дополнительная хромосома 13',
    correctAnswers: ['47,XX,+18', '47,XY,+13'],
    sexOptions: ['female', 'male'],
    chromosomeSet: 'trisomy13',
  },
];

// Исправление опечатки в синдроме Патау (для female должно быть +13)
CLINICAL_CASES[3].correctAnswers[0] = '47,XX,+13';
