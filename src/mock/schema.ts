/**
 * Data contract for the whole app.
 * 型別即契約：UI / store / mock 三方都以此為準。
 * 另含輕量 runtime 驗證——即使是 mock 資料，越過邊界前也要被檢查（見 docs/03）。
 */

export const CATEGORIES = [
  { id: '3c', name: '3C數位' },
  { id: 'beauty', name: '美妝保養' },
  { id: 'fashion', name: '流行服飾' },
  { id: 'food', name: '美食生鮮' },
  { id: 'appliance', name: '家電生活' },
  { id: 'baby', name: '親子婦幼' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export type PromotionTag = '免運' | '限時' | '滿額折' | '新品' | '熱銷' | '直播優惠'

export interface Product {
  id: string
  title: string
  image: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  tags?: PromotionTag[]
  category: CategoryId
}

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id))
const isDev = import.meta.env.DEV

/**
 * 驗證單筆 Product 形狀。回傳錯誤訊息陣列（空陣列代表合法）。
 * 不丟例外——壞資料應被攔下並記錄，而非讓整頁崩潰。
 */
export function validateProduct(p: unknown): string[] {
  const errors: string[] = []
  if (typeof p !== 'object' || p === null) return ['not an object']
  const o = p as Record<string, unknown>

  if (!o.id || typeof o.id !== 'string') errors.push('id missing/invalid')
  if (!o.title || typeof o.title !== 'string') errors.push('title missing/invalid')
  if (typeof o.price !== 'number' || o.price < 0) errors.push('price must be >= 0')
  if (o.originalPrice !== undefined) {
    if (typeof o.originalPrice !== 'number' || o.originalPrice < (o.price as number)) {
      errors.push('originalPrice must be >= price')
    }
  }
  if (typeof o.category !== 'string' || !CATEGORY_IDS.has(o.category)) {
    errors.push(`category "${String(o.category)}" not in CATEGORIES`)
  }
  return errors
}

/** 驗證整批資料，dev 模式下對不合法者發出明確警告，並濾掉壞資料。 */
export function validateProducts(list: Product[]): Product[] {
  return list.filter((p) => {
    const errors = validateProduct(p)
    if (errors.length && isDev) {
      // Observability: 指出哪一筆、哪個欄位壞了
      console.warn(`[mock/schema] invalid product "${(p as Product)?.id}":`, errors.join('; '))
    }
    return errors.length === 0
  })
}
