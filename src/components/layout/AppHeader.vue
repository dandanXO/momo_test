<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'

const router = useRouter()
const keyword = ref('')

function onSearch() {
  const q = keyword.value.trim()
  router.push({ path: '/search', query: q ? { q } : {} })
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-momo text-white shadow-md">
    <div class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5">
      <RouterLink to="/" class="shrink-0 text-2xl font-black tracking-tight">
        momo<span class="text-momo-accent">.</span>
      </RouterLink>

      <form class="flex flex-1 items-center overflow-hidden rounded-full bg-white" @submit.prevent="onSearch">
        <input
          v-model="keyword"
          type="search"
          placeholder="搜尋商品、品牌、活動…"
          class="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-ink outline-none"
        />
        <button type="submit" class="px-4 py-2 text-sm font-bold text-momo">搜尋</button>
      </form>

      <nav class="hidden shrink-0 items-center gap-4 text-sm md:flex">
        <RouterLink to="/discover" class="hover:underline">探索</RouterLink>
        <RouterLink to="/live" class="flex items-center gap-1 hover:underline">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>直播
        </RouterLink>
        <RouterLink to="/showroom" class="hover:underline">卡片庫</RouterLink>
        <span class="opacity-90">購物車</span>
        <LocaleSwitcher class="text-white" />
      </nav>
    </div>
  </header>
</template>
