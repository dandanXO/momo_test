<script setup lang="ts">
import type { Product } from '@/mock/schema'
import SectionTitle from './SectionTitle.vue'
import ProductCard from '@/components/cards/ProductCard.vue'

defineProps<{ products: Product[] }>()
</script>

<template>
  <section>
    <SectionTitle title="人氣排行榜" subtitle="本週熱賣" />
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      <ProductCard
        v-for="(p, i) in products"
        :key="p.id"
        :product="p"
        variant="ranking"
        :rank="i + 1"
      />
    </div>
  </section>
</template>
