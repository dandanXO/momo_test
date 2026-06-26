<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { fetchProduct } from '@/mock/api'
import { useProductStore } from '@/stores/products'
import type { Product } from '@/mock/schema'
import PromotionTags from '@/components/cards/PromotionTags.vue'
import ProductWall from '@/components/sections/ProductWall.vue'
import SectionTitle from '@/components/sections/SectionTitle.vue'

const route = useRoute()
const store = useProductStore()
const product = ref<Product | undefined>()
const related = ref<Product[]>([])
const loading = ref(true)

const ntd = (n: number) => `$${n.toLocaleString('en-US')}`
const discountPercent = computed(() => {
  const p = product.value
  return p?.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0
})

async function load(id: string) {
  loading.value = true
  product.value = await fetchProduct(id)
  if (product.value) {
    const list = await store.query({ category: product.value.category, limit: 6 })
    related.value = list.filter((p) => p.id !== product.value?.id)
  }
  loading.value = false
}

watch(() => route.params.id, (id) => load(id as string), { immediate: true })
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-4">
    <p v-if="loading" class="py-20 text-center text-ink-soft">載入中…</p>

    <template v-else-if="product">
      <nav class="mb-3 text-xs text-ink-soft">
        <RouterLink to="/" class="hover:text-momo">首頁</RouterLink> / {{ product.title }}
      </nav>

      <div class="grid gap-6 rounded-lg bg-white p-4 md:grid-cols-2">
        <div class="relative aspect-square overflow-hidden rounded-md bg-line">
          <img :src="product.image" :alt="product.title" class="h-full w-full object-cover" />
          <div v-if="discountPercent" class="absolute right-0 top-0 bg-momo-accent px-2 py-1 text-sm font-bold text-white">
            {{ discountPercent }}% OFF
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <PromotionTags :tags="product.tags" />
          <h1 class="text-2xl font-bold text-ink">{{ product.title }}</h1>
          <div v-if="product.rating" class="text-sm text-ink-soft">
            <span class="text-amber-500">★ {{ product.rating }}</span>
            ({{ product.reviewCount?.toLocaleString('en-US') }} 則評價)
          </div>

          <div class="flex items-baseline gap-3 rounded-md bg-momo-light p-3">
            <span class="text-3xl font-bold text-momo">{{ ntd(product.price) }}</span>
            <span v-if="product.originalPrice" class="text-ink-soft line-through">{{ ntd(product.originalPrice) }}</span>
          </div>

          <div class="mt-auto flex gap-3">
            <button class="flex-1 rounded-md border border-momo py-3 font-bold text-momo hover:bg-momo-light">加入購物車</button>
            <button class="flex-1 rounded-md bg-momo py-3 font-bold text-white hover:bg-momo-dark">直接購買</button>
          </div>
          <p class="text-xs text-ink-soft">※ 此為 mock 商品頁，購買流程未實作（見 docs/02 取捨說明）。</p>
        </div>
      </div>

      <section v-if="related.length" class="mt-8">
        <SectionTitle title="相關商品" />
        <ProductWall :products="related" />
      </section>
    </template>

    <div v-else class="py-20 text-center">
      <p class="text-ink-soft">找不到這個商品。</p>
      <RouterLink to="/" class="mt-3 inline-block text-momo hover:underline">回首頁</RouterLink>
    </div>
  </main>
</template>
