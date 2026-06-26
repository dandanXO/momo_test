import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/mock/schema'
import { validateProduct } from '@/mock/schema'
import type { CardVariant } from '@/components/cards/ProductCard.vue'

/**
 * Card Showroom 的單一狀態來源（State Consistency Strategy）。
 * 編輯結果即時寫入 localStorage（Browser-side Persistence），重整後自動還原。
 */
const KEY = 'momo:cardConfig'

export interface CardConfig {
  product: Product
  variant: CardVariant
  rank: number
  soldRatio: number
  countdownHours: number
}

const DEFAULT: CardConfig = {
  product: {
    id: 'demo-1',
    title: '無線藍牙耳機 ANC 主動降噪',
    image: 'https://picsum.photos/seed/momo-demo/400/400',
    price: 1280,
    originalPrice: 1980,
    rating: 4.6,
    reviewCount: 1284,
    tags: ['限時', '免運'],
    category: '3c',
  },
  variant: 'standard',
  rank: 1,
  soldRatio: 0.66,
  countdownHours: 3,
}

function load(): CardConfig {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) }
  } catch {
    /* 壞掉的 localStorage 不應讓 app 崩潰，退回預設 */
  }
  return JSON.parse(JSON.stringify(DEFAULT))
}

export const useCardConfigStore = defineStore('cardConfig', () => {
  const config = ref<CardConfig>(load())

  // 任何變動即持久化
  watch(config, (v) => localStorage.setItem(KEY, JSON.stringify(v)), { deep: true })

  // flashSale 倒數結束時間，由 countdownHours 推導
  const endsAt = computed(() =>
    new Date(Date.now() + config.value.countdownHours * 3600 * 1000).toISOString(),
  )

  // 即時驗證編輯中的商品是否符合契約（驗證與狀態一致性的展示）
  const validationErrors = computed(() => validateProduct(config.value.product))

  function reset() {
    config.value = JSON.parse(JSON.stringify(DEFAULT))
  }

  return { config, endsAt, validationErrors, reset }
})
