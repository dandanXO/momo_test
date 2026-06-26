<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { CATEGORIES, type Product, type CategoryId } from '@/mock/schema'
import ProductWall from '@/components/sections/ProductWall.vue'

const route = useRoute()
const store = useProductStore()
const results = ref<Product[]>([])
const loading = ref(false)
const label = ref('')

async function run() {
  loading.value = true
  const q = (route.query.q as string) || ''
  const cat = route.query.cat as CategoryId | undefined
  results.value = await store.query({ keyword: q || undefined, category: cat })
  label.value = q
    ? `「${q}」`
    : cat
      ? CATEGORIES.find((c) => c.id === cat)?.name ?? ''
      : '全部商品'
  loading.value = false
}

watch(() => route.query, run, { immediate: true })
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-4">
    <div class="mb-4 flex items-baseline gap-2">
      <h1 class="text-xl font-bold text-ink">{{ label }}</h1>
      <span class="text-sm text-ink-soft">共 {{ results.length }} 件商品</span>
    </div>

    <p v-if="loading" class="py-20 text-center text-ink-soft">載入中…</p>
    <ProductWall v-else-if="results.length" :products="results" />
    <p v-else class="py-20 text-center text-ink-soft">找不到符合的商品，換個關鍵字試試。</p>
  </main>
</template>
