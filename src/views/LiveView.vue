<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import type { Product } from '@/mock/schema'
import ProductCard from '@/components/cards/ProductCard.vue'
import SectionTitle from '@/components/sections/SectionTitle.vue'

const store = useProductStore()
const liveProducts = ref<Product[]>([])

const rooms = [
  { host: '小美的美妝直播間', viewers: 3280 },
  { host: 'momo 3C 開箱實測', viewers: 1542 },
]

onMounted(async () => {
  liveProducts.value = await store.query({ limit: 12 })
})
</script>

<template>
  <main class="mx-auto max-w-7xl space-y-6 px-4 py-4">
    <div class="flex items-center gap-2">
      <span class="flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-sm font-bold text-white">
        <span class="h-2 w-2 animate-pulse rounded-full bg-white"></span>LIVE
      </span>
      <h1 class="text-2xl font-black text-ink">直播購物</h1>
    </div>

    <!-- 直播間 -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div
        v-for="r in rooms"
        :key="r.host"
        class="relative flex h-40 flex-col justify-end overflow-hidden rounded-lg bg-gradient-to-br from-purple-700 to-momo p-4 text-white"
      >
        <span class="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-xs">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400"></span>{{ r.viewers.toLocaleString('en-US') }} 人觀看
        </span>
        <h3 class="text-lg font-bold">{{ r.host }}</h3>
        <p class="text-sm opacity-90">點擊進入直播間搶優惠</p>
      </div>
    </div>

    <!-- 直播商品（live 變體卡） -->
    <section>
      <SectionTitle title="直播熱賣商品" subtitle="限直播優惠價" accent />
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <ProductCard v-for="p in liveProducts" :key="p.id" :product="p" variant="live" />
      </div>
    </section>
  </main>
</template>
