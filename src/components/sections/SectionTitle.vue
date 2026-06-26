<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; accent?: boolean }>()
</script>

<template>
  <div class="mb-3 flex items-end justify-between">
    <div class="flex items-center gap-2">
      <span class="h-5 w-1.5 rounded-full" :class="accent ? 'bg-momo-accent' : 'bg-momo'"></span>
      <h2 class="text-xl font-bold text-ink">{{ title }}</h2>
      <span v-if="subtitle" class="text-sm text-ink-soft">{{ subtitle }}</span>
    </div>
    <slot name="action" />
  </div>
</template>
