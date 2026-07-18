import 'server-only'

const dictionaries = {
  id: () => import('./id.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'id' | 'en') => {
  return dictionaries[locale]?.() ?? dictionaries.id()
}