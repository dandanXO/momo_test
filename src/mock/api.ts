/**
 * Mock 資料存取層 —— 模擬真實 API 的邊界。
 * UI / store 一律透過這層取資料；未來接真後端只需替換此檔，上層不動（見 docs/01）。
 * 全部回傳 Promise，並在 dev 模式記錄耗時（Observability，見 docs/03）。
 */
import { MOCK_PRODUCTS } from './products'
import { validateProducts, type Product, type CategoryId } from './schema'

const LATENCY = 120 // ms，模擬網路延遲
const isDev = import.meta.env.DEV

// 啟動時驗證一次資料契約，壞資料在邊界即被攔下
const DATA = validateProducts(MOCK_PRODUCTS)

function delay<T>(label: string, value: T): Promise<T> {
  const start = performance.now()
  return new Promise((resolve) =>
    setTimeout(() => {
      if (isDev) console.debug(`[mock/api] ${label} (${Math.round(performance.now() - start)}ms, ${Array.isArray(value) ? value.length : 1} item)`) // eslint-disable-line
      resolve(value)
    }, LATENCY),
  )
}

export interface ProductQuery {
  category?: CategoryId
  keyword?: string
  limit?: number
}

export function fetchProducts(q: ProductQuery = {}): Promise<Product[]> {
  let list = DATA
  if (q.category) list = list.filter((p) => p.category === q.category)
  if (q.keyword) {
    const kw = q.keyword.trim().toLowerCase()
    list = list.filter((p) => p.title.toLowerCase().includes(kw))
  }
  if (q.limit) list = list.slice(0, q.limit)
  return delay(`fetchProducts ${JSON.stringify(q)}`, list)
}

export function fetchProduct(id: string): Promise<Product | undefined> {
  return delay(`fetchProduct ${id}`, DATA.find((p) => p.id === id))
}

/** 限時下殺：取有折扣的商品 */
export function fetchFlashSale(limit = 6): Promise<Product[]> {
  const list = DATA.filter((p) => p.originalPrice).slice(0, limit)
  return delay('fetchFlashSale', list)
}

/** 排行榜：依評分 * 評論數 排序 */
export function fetchRanking(limit = 5): Promise<Product[]> {
  const list = [...DATA]
    .sort((a, b) => (b.rating ?? 0) * (b.reviewCount ?? 0) - (a.rating ?? 0) * (a.reviewCount ?? 0))
    .slice(0, limit)
  return delay('fetchRanking', list)
}
