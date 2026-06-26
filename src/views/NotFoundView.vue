<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
  <main class="mx-auto max-w-7xl px-4 py-24 text-center">
    <h1 class="text-5xl font-black text-momo">404</h1>
    <p class="mt-3 text-ink-soft">找不到這個頁面。</p>
    <RouterLink to="/" class="mt-4 inline-block rounded-md bg-momo px-5 py-2 font-bold text-white hover:bg-momo-dark">回首頁</RouterLink>
  </main>
</template>
