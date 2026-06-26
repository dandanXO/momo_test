<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCounterStore } from '@/stores/counter'

const { t } = useI18n()
const counter = useCounterStore()
</script>

<template>
  <main class="page">
    <h1>{{ t('home.title') }}</h1>
    <p>{{ t('home.welcome') }}</p>

    <section class="counter">
      <p>{{ t('counter.count') }}: {{ counter.count }}</p>
      <p>{{ t('counter.double') }}: {{ counter.doubleCount }}</p>
      <button type="button" @click="counter.increment()">
        {{ t('counter.increment') }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.page {
  padding: 2rem;
}

.counter {
  margin-top: 1.5rem;
}

button {
  padding: 0.4rem 1rem;
  cursor: pointer;
}
</style>
