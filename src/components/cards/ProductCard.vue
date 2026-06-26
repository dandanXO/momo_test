<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Product } from '@/mock/schema'
import PromotionTags from './PromotionTags.vue'
import CountdownTimer from './CountdownTimer.vue'

/**
 * Schema/variant 驅動的商品卡。
 * 同一份 Product，依 variant 切換呈現；新增變體 = 加一個 case，不動既有邏輯（見 docs/01）。
 */
export type CardVariant = 'standard' | 'flashSale' | 'ranking' | 'live'

const props = withDefaults(
  defineProps<{
    product: Product
    variant?: CardVariant
    rank?: number
    endsAt?: string
    soldRatio?: number
  }>(),
  { variant: 'standard' },
)

const KNOWN: CardVariant[] = ['standard', 'flashSale', 'ranking', 'live']

// Observability: 未知變體不讓畫面崩潰，fallback 成 standard 並警告
const safeVariant = computed<CardVariant>(() => {
  if (KNOWN.includes(props.variant)) return props.variant
  if (import.meta.env.DEV) console.warn(`[ProductCard] unknown variant "${props.variant}", fallback to standard`)
  return 'standard'
})

const discountPercent = computed(() => {
  if (!props.product.originalPrice) return 0
  return Math.round((1 - props.product.price / props.product.originalPrice) * 100)
})

const ntd = (n: number) => `$${n.toLocaleString('en-US')}`
</script>

<template>
  <RouterLink
    :to="`/goods/${product.id}`"
    class="group flex flex-col overflow-hidden rounded-md bg-white shadow-sm transition hover:shadow-md"
  >
    <!-- 圖片區 -->
    <div class="relative aspect-square overflow-hidden bg-line">
      <img
        :src="product.image"
        :alt="product.title"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />

      <!-- 排行名次 -->
      <div
        v-if="safeVariant === 'ranking' && rank"
        class="absolute left-0 top-0 flex h-7 w-7 items-center justify-center bg-momo text-sm font-bold text-white"
      >
        {{ rank }}
      </div>

      <!-- 直播中 -->
      <div
        v-if="safeVariant === 'live'"
        class="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white"
      >
        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>LIVE
      </div>

      <!-- 折扣 -->
      <div
        v-if="discountPercent"
        class="absolute right-0 top-0 bg-momo-accent px-1.5 py-0.5 text-[11px] font-bold text-white"
      >
        {{ discountPercent }}% OFF
      </div>
    </div>

    <!-- 內容區 -->
    <div class="flex flex-1 flex-col gap-1 p-2">
      <PromotionTags :tags="product.tags" />

      <h3 class="line-clamp-2 min-h-[2.5em] text-sm leading-tight text-ink">
        {{ product.title }}
      </h3>

      <!-- 限時下殺：倒數 + 進度 -->
      <div v-if="safeVariant === 'flashSale'" class="flex flex-col gap-1">
        <CountdownTimer v-if="endsAt" :ends-at="endsAt" />
        <div v-if="soldRatio !== undefined" class="h-2.5 overflow-hidden rounded-full bg-momo-light">
          <div
            class="h-full rounded-full bg-momo-accent text-[8px] text-white"
            :style="{ width: Math.round(soldRatio * 100) + '%' }"
          ></div>
        </div>
        <span v-if="soldRatio !== undefined" class="text-[10px] text-ink-soft">
          已售出 {{ Math.round(soldRatio * 100) }}%
        </span>
      </div>

      <!-- 價格 -->
      <div class="mt-auto flex items-baseline gap-1.5">
        <span class="text-lg font-bold text-momo">{{ ntd(product.price) }}</span>
        <span v-if="product.originalPrice" class="text-xs text-ink-soft line-through">
          {{ ntd(product.originalPrice) }}
        </span>
      </div>

      <!-- 評分 -->
      <div v-if="product.rating" class="flex items-center gap-1 text-[11px] text-ink-soft">
        <span class="text-amber-500">★ {{ product.rating }}</span>
        <span>({{ product.reviewCount?.toLocaleString('en-US') }})</span>
      </div>
    </div>
  </RouterLink>
</template>
