<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/products'
import { CATEGORIES, type Product } from '@/mock/schema'
import HeroCarousel from '@/components/sections/HeroCarousel.vue'
import FlashSaleSection from '@/components/sections/FlashSaleSection.vue'
import RankingSection from '@/components/sections/RankingSection.vue'
import ProductWall from '@/components/sections/ProductWall.vue'
import SectionTitle from '@/components/sections/SectionTitle.vue'

const store = useProductStore()
const { flashSale, ranking } = storeToRefs(store)

// 首頁主題商品列（取前三個分類各一排）
const featured = ref<{ name: string; items: Product[] }[]>([])

onMounted(async () => {
  await store.loadHome()
  const picks = CATEGORIES.slice(0, 3)
  featured.value = await Promise.all(
    picks.map(async (c) => ({ name: c.name, items: await store.query({ category: c.id, limit: 6 }) })),
  )
})
</script>

<template>
  <main class="mx-auto max-w-7xl space-y-8 px-4 py-4">
    <HeroCarousel />

    <FlashSaleSection v-if="flashSale.length" :products="flashSale" />

    <section v-for="block in featured" :key="block.name">
      <SectionTitle :title="block.name" />
      <ProductWall :products="block.items" />
    </section>

    <RankingSection v-if="ranking.length" :products="ranking" />
  </main>
</template>
