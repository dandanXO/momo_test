<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SUPPORT_LOCALES, type AppLocale } from '@/i18n'

const { locale } = useI18n()

function setLocale(value: AppLocale) {
  locale.value = value
  localStorage.setItem('locale', value)
}

const labelOf = (loc: AppLocale) => (loc === 'en' ? 'English' : '繁體中文')
</script>

<template>
  <div class="relative inline-flex items-center text-white">
    <!-- 地球 icon -->
    <svg
      class="pointer-events-none absolute left-2 h-4 w-4 opacity-90"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>

    <select
      :value="locale"
      aria-label="切換語言"
      class="appearance-none rounded-full border border-white/40 bg-white/15 py-1 pl-7 pr-7 text-sm font-medium text-white outline-none transition hover:bg-white/25 focus:border-white"
      @change="setLocale(($event.target as HTMLSelectElement).value as AppLocale)"
    >
      <option v-for="loc in SUPPORT_LOCALES" :key="loc" :value="loc" class="bg-white text-ink">
        {{ labelOf(loc) }}
      </option>
    </select>

    <!-- 下拉箭頭 -->
    <svg
      class="pointer-events-none absolute right-2 h-3 w-3 opacity-90"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </div>
</template>
