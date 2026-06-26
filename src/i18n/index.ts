import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zhTW from './locales/zh-TW.json'

export const SUPPORT_LOCALES = ['en', 'zh-TW'] as const
export type AppLocale = (typeof SUPPORT_LOCALES)[number]

const DEFAULT_LOCALE: AppLocale = 'en'

function getStartingLocale(): AppLocale {
  const saved = localStorage.getItem('locale') as AppLocale | null
  if (saved && SUPPORT_LOCALES.includes(saved)) return saved
  const browser = navigator.language
  if (browser.startsWith('zh')) return 'zh-TW'
  return DEFAULT_LOCALE
}

const i18n = createI18n({
  legacy: false,
  locale: getStartingLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
    'zh-TW': zhTW,
  },
})

export default i18n
