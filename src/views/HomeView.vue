<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main class="page">
    <h1>{{ t('home.title') }}</h1>
    <p>{{ t('home.welcome') }}</p>
  </main>
</template>

<style scoped>
.page {
  padding: 2rem;
}
</style>
