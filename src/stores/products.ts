import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/mock/schema'
import { fetchProducts, fetchFlashSale, fetchRanking, type ProductQuery } from '@/mock/api'

/**
 * 商品資料的單一來源。頁面透過 store / composable 取資料，不直接碰 mock。
 * 加入簡單快取，避免重複請求（縮小版的 query cache）。
 */
export const useProductStore = defineStore('products', () => {
  const flashSale = ref<Product[]>([])
  const ranking = ref<Product[]>([])
  const cache = new Map<string, Product[]>()

  async function loadHome() {
    if (!flashSale.value.length) flashSale.value = await fetchFlashSale()
    if (!ranking.value.length) ranking.value = await fetchRanking()
  }

  async function query(q: ProductQuery = {}): Promise<Product[]> {
    const key = JSON.stringify(q)
    if (cache.has(key)) return cache.get(key)!
    const list = await fetchProducts(q)
    cache.set(key, list)
    return list
  }

  return { flashSale, ranking, loadHome, query }
})
