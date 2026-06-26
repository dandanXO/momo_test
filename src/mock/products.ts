import type { Product, CategoryId, PromotionTag } from './schema'

/**
 * Mock 商品資料。圖片用 picsum 佔位（非 momo API），避免版權與抓圖成本。
 * 資料刻意涵蓋各分類與促銷情境，供不同卡片變體展示。
 */

const TITLES: Record<CategoryId, string[]> = {
  '3c': ['無線藍牙耳機 ANC 降噪', '120Hz 旗艦手機 256G', '機械式電競鍵盤 RGB', '4K 65吋 智慧電視', '行動電源 20000mAh', '筆電 16吋 輕薄'],
  beauty: ['玻尿酸保濕精華 30ml', '胺基酸潔顏霜', '持久霧面唇釉', '物理防曬乳 SPF50', '視黃醇晚霜', '保濕面膜 10入'],
  fashion: ['純棉寬版T恤', '機能防風外套', '高腰直筒牛仔褲', '真皮樂福鞋', '針織開襟毛衣', '尼龍後背包'],
  food: ['冷凍藍鑽蝦 1kg', '日本和牛燒肉片', '初榨橄欖油 1L', '阿拉比卡濾掛咖啡', '紐西蘭奇異果', '手工千層蛋糕'],
  appliance: ['變頻除濕機 12L', '氣炸鍋 5.5L', '無線手持吸塵器', '雙門變頻冰箱', '掃地機器人', '快煮玻璃壼'],
  baby: ['嬰兒推車 輕量', '幫寶適尿布 L號', '兒童安全座椅', '副食品調理機', '矽膠學習餐具', '木製積木組'],
}

const TAG_POOL: PromotionTag[] = ['免運', '限時', '滿額折', '新品', '熱銷']

function priceFor(cat: CategoryId, i: number): number {
  const base: Record<CategoryId, number> = {
    '3c': 4990, beauty: 590, fashion: 890, food: 690, appliance: 3990, baby: 1290,
  }
  return base[cat] + ((i * 137) % 9) * 100
}

const products: Product[] = []
const cats = Object.keys(TITLES) as CategoryId[]

for (const cat of cats) {
  TITLES[cat].forEach((title, i) => {
    const price = priceFor(cat, i)
    const discounted = i % 2 === 0
    const idx = products.length
    const tags: PromotionTag[] = []
    if (discounted) tags.push('限時')
    const pooled = TAG_POOL[idx % TAG_POOL.length]
    if (pooled) tags.push(pooled)
    products.push({
      id: `${cat}-${i + 1}`,
      title,
      image: `https://picsum.photos/seed/momo-${cat}-${i}/400/400`,
      price: discounted ? Math.round(price * 0.8) : price,
      originalPrice: discounted ? price : undefined,
      rating: Number((3.8 + ((idx * 7) % 12) / 10).toFixed(1)),
      reviewCount: 12 + ((idx * 53) % 4000),
      tags,
      category: cat,
    })
  })
}

export const MOCK_PRODUCTS: Product[] = products
