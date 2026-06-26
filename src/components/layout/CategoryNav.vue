<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { CATEGORIES } from '@/mock/schema'
</script>

<template>
  <nav class="border-b border-line bg-white">
    <div class="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 text-sm">
      <RouterLink
        to="/"
        class="shrink-0 rounded-full px-3 py-1 font-medium text-ink hover:bg-momo-light hover:text-momo"
      >
        全站
      </RouterLink>
      <RouterLink
        v-for="c in CATEGORIES"
        :key="c.id"
        :to="{ path: '/search', query: { cat: c.id } }"
        class="shrink-0 rounded-full px-3 py-1 text-ink hover:bg-momo-light hover:text-momo"
      >
        {{ c.name }}
      </RouterLink>
    </div>
  </nav>
</template>
