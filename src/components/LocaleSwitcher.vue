<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SUPPORT_LOCALES, type AppLocale } from '@/i18n'

const { locale, t } = useI18n()

function setLocale(value: AppLocale) {
  locale.value = value
  localStorage.setItem('locale', value)
}
</script>

<template>
  <label class="locale-switcher">
    {{ t('language') }}:
    <select :value="locale" @change="setLocale(($event.target as HTMLSelectElement).value as AppLocale)">
      <option v-for="loc in SUPPORT_LOCALES" :key="loc" :value="loc">
        {{ loc === 'en' ? 'English' : '繁體中文' }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.locale-switcher {
  font-size: 0.9rem;
}
</style>
