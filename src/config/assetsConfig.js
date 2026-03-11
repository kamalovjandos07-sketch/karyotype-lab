/**
 * assetsConfig.js — Конфигурация путей к изображениям
 * 
 * Подставьте сюда ссылки на свои изображения.
 * В коде используются серые плейсхолдеры с текстовыми подписями.
 * Формат: пути к файлам или URL
 */

export const ASSETS = {
  // Фон лаборатории (экран забора и культивирования)
  labBackground: '/images/lab-background.svg',

  // Пробирка с кровью
  bloodTube: '/images/blood-tube.svg',

  // Реагенты
  reagents: {
    phytohemagglutinin: '/reagents/phytohemagglutinin.svg',
    colchicine: '/reagents/colchicine.svg',
    hypotonicKCl: '/reagents/hypotonic-kcl.svg',
    fixative: '/reagents/fixative.svg',
    giemsaStain: '/reagents/giemsa-stain.svg',
    placeholder: '/reagents/placeholder.svg',
  },

  // Микроскоп и окуляр
  microscope: '/images/microscope.svg',
  ocularView: '/images/ocular-view.svg',

  // Метафазная пластинка (общий вид под микроскопом)
  metaphasePlate: '/images/metaphase-plate.svg',

  // Спрайты хромосом (пары 1-22, X, Y)
  // Можно использовать общий placeholder или отдельные для каждой пары
  chromosomes: {
    base: '/chromosomes/chromosome.svg',
    placeholder: '/chromosomes/placeholder.svg',
    // Опционально: отдельные для пар
    // pair1: '/chromosomes/pair-1.svg',
    // pair2: '/chromosomes/pair-2.svg',
    // ...
  },

  // Предметное стекло
  glassSlide: '/images/glass-slide.svg',
};

/**
 * Вспомогательная функция: возвращает путь или fallback плейсхолдер
 */
export function getAsset(key, subKey = null) {
  const value = subKey ? ASSETS[key]?.[subKey] : ASSETS[key];
  return value || ASSETS.reagents?.placeholder || '';
}
