<script setup lang="ts">
import { useCountdown } from '@/composables/useCountdown'

const props = defineProps<{ endsAt: string }>()
const { text, expired } = useCountdown(props.endsAt)
</script>

<template>
  <span
    class="inline-flex items-center gap-1 font-mono text-xs font-bold tabular-nums"
    :class="expired ? 'text-ink-soft' : 'text-momo-accent'"
  >
    <span>{{ expired ? '已結束' : '剩' }}</span>
    <span v-if="!expired">{{ text }}</span>
  </span>
</template>
