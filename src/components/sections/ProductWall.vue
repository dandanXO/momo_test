<script setup lang="ts">
import type { Product } from '@/mock/schema'
import ProductCard, { type CardVariant } from '@/components/cards/ProductCard.vue'

defineProps<{ products: Product[]; variant?: CardVariant }>()
</script>

<template>
  <!-- 高密度商品牆：手機 2 欄、桌機最多 6 欄 -->
  <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
    <ProductCard
      v-for="p in products"
      :key="p.id"
      :product="p"
      :variant="variant ?? 'standard'"
    />
  </div>
</template>
