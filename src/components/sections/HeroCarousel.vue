<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const banners = [
  { title: '年中慶 全站下殺', sub: '滿$1,500 折$150', from: 'from-momo', to: 'to-momo-dark' },
  { title: '3C 數位狂購節', sub: '指定品牌 12 期 0 利率', from: 'from-purple-600', to: 'to-momo' },
  { title: '美妝保養週', sub: '買一送一 限時開搶', from: 'from-momo-accent', to: 'to-momo' },
]
const idx = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => (idx.value = (idx.value + 1) % banners.length), 4000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="relative h-44 overflow-hidden rounded-lg sm:h-56">
    <div
      v-for="(b, i) in banners"
      :key="i"
      class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br text-white transition-opacity duration-700"
      :class="[b.from, b.to, i === idx ? 'opacity-100' : 'opacity-0']"
    >
      <h2 class="text-3xl font-black sm:text-4xl">{{ b.title }}</h2>
      <p class="mt-2 text-lg">{{ b.sub }}</p>
    </div>
    <div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
      <button
        v-for="(b, i) in banners"
        :key="i"
        class="h-2 w-2 rounded-full transition"
        :class="i === idx ? 'bg-white' : 'bg-white/40'"
        @click="idx = i"
      ></button>
    </div>
  </div>
</template>
