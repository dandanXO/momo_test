<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/mock/schema'
import SectionTitle from './SectionTitle.vue'
import ProductCard from '@/components/cards/ProductCard.vue'
import { useCountdown } from '@/composables/useCountdown'

const props = defineProps<{ products: Product[] }>()

// 全區共用一個結束時間（今天稍晚），示範限時下殺
const endsAt = new Date(Date.now() + 3 * 3600 * 1000).toISOString()
const { text } = useCountdown(endsAt)

// 依商品 id 產生穩定的「已售比例」
const soldRatios = computed(() =>
  Object.fromEntries(
    props.products.map((p) => [p.id, 0.3 + ((p.id.length * 13) % 60) / 100]),
  ),
)
</script>

<template>
  <section class="rounded-lg bg-gradient-to-r from-momo to-momo-dark p-3">
    <SectionTitle title="限時下殺" accent>
      <template #action>
        <span class="rounded-full bg-momo-accent px-3 py-1 font-mono text-sm font-bold text-white tabular-nums">
          {{ text }}
        </span>
      </template>
    </SectionTitle>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        variant="flashSale"
        :ends-at="endsAt"
        :sold-ratio="soldRatios[p.id]"
      />
    </div>
  </section>
</template>
