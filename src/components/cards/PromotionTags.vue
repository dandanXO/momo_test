<script setup lang="ts">
import type { PromotionTag } from '@/mock/schema'

defineProps<{ tags?: PromotionTag[] }>()

const styleMap: Record<PromotionTag, string> = {
  限時: 'bg-momo-accent text-white',
  免運: 'bg-momo text-white',
  滿額折: 'bg-momo-light text-momo-dark',
  新品: 'bg-emerald-500 text-white',
  熱銷: 'bg-amber-500 text-white',
  直播優惠: 'bg-purple-600 text-white',
}
</script>

<template>
  <div v-if="tags?.length" class="flex flex-wrap gap-1">
    <span
      v-for="tag in tags"
      :key="tag"
      class="rounded-sm px-1.5 py-0.5 text-[10px] font-bold leading-none"
      :class="styleMap[tag] ?? 'bg-line text-ink'"
    >
      {{ tag }}
    </span>
  </div>
</template>
