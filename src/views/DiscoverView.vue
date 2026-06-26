<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { CATEGORIES, type Product } from '@/mock/schema'
import SectionTitle from '@/components/sections/SectionTitle.vue'
import ProductWall from '@/components/sections/ProductWall.vue'

const store = useProductStore()
const blocks = ref<{ title: string; subtitle: string; items: Product[] }[]>([])

// 探索頁：編輯精選式的主題商品列，重用既有 sections 與卡片
const THEMES = [
  { cat: CATEGORIES[1].id, title: '編輯精選', subtitle: '美編私心推薦' },
  { cat: CATEGORIES[0].id, title: '科技嚐鮮', subtitle: '3C 新品速報' },
  { cat: CATEGORIES[3].id, title: '在家也能吃好料', subtitle: '美食生鮮嚴選' },
]

onMounted(async () => {
  blocks.value = await Promise.all(
    THEMES.map(async (t) => ({
      title: t.title,
      subtitle: t.subtitle,
      items: await store.query({ category: t.cat, limit: 6 }),
    })),
  )
})
</script>

<template>
  <main class="mx-auto max-w-7xl space-y-8 px-4 py-4">
    <div class="rounded-lg bg-gradient-to-br from-purple-600 to-momo p-8 text-white">
      <h1 class="text-3xl font-black">探索 Discover</h1>
      <p class="mt-1 opacity-90">編輯精選主題，發現你可能會喜歡的好物。</p>
    </div>

    <section v-for="b in blocks" :key="b.title">
      <SectionTitle :title="b.title" :subtitle="b.subtitle" />
      <ProductWall :products="b.items" />
    </section>
  </main>
</template>
