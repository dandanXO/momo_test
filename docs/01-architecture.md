# Architecture

## 技術選型

| 層面 | 選擇 | 理由 |
|---|---|---|
| Framework | Vue 3 (`<script setup>` + TS) | Composition API 對「邏輯抽成 composable」友善，型別佳 |
| Build | Vite | 快、官方 create-vue 標準 |
| Routing | Vue Router | 五條路由 + lazy load |
| State | Pinia | 官方狀態管理，store 即資料邊界 |
| i18n | vue-i18n (`zh-TW` / `en`) | momo 是繁中站，預留多語 |
| Styling | Tailwind v4 | 高密度 UI 用 utility 最快，token 集中管理品牌色 |
| Validation | 輕量 schema 檢查 | mock 資料即使是假的，也要被驗證（見 doc 03） |

> 起點沿用既有 scaffold（Vue3+TS+Vite+Router+Pinia+i18n），降低樣板成本，把時間花在架構本身。

## 分層

```
src/
  mock/          # 假資料 + 資料存取（async，模擬 API 邊界）
    products.ts  #   - 資料
    api.ts       #   - fetchProducts() / fetchProduct(id)，未來換真 API 只動這層
    schema.ts    #   - 型別即契約 + runtime 驗證
  stores/        # Pinia：跨頁狀態（products / cart / ui）
  components/
    cards/       # ★ 卡片系統（schema/variant 驅動）— 本專案核心
    sections/    # 首頁區塊（下殺區、商品列、排行榜、輪播）
    layout/      # Header / 分類導覽 / Footer
  composables/   # useCountdown、useProducts… 可重用邏輯
  views/         # Home / Search / Goods / Discover / Live
  router/
  i18n/
```

設計原則：**UI 不直接碰 mock 資料**。頁面 → store/composable → `mock/api` → 資料。
之後接真後端，只需替換 `mock/api.ts`，UI 與 store 不動。

## 卡片系統（最高權重設計）

momo 的識別度來自「同一份商品資料，依情境呈現成不同卡片」。
因此採 **schema/variant 驅動**，而非每種卡片各寫一個獨立元件。

```ts
type CardVariant = 'standard' | 'flashSale' | 'ranking' | 'live'

interface ProductCardProps {
  product: Product
  variant?: CardVariant
  rank?: number          // ranking 用
  endsAt?: string        // flashSale 倒數
  soldRatio?: number     // flashSale 進度條
}
```

- 單一 `ProductCard.vue` 依 `variant` 決定要掛上哪些 badge / 倒數 / 進度條 / 名次。
- 變體專屬視覺拆成小元件（`FlashSaleBadge`、`CountdownTimer`、`RankBadge`），組合而非繼承。
- 新增卡片類型 = 加一個 variant + 對應小元件，**不改動既有卡片** → 開放封閉原則。
- 這同時命中 A 題與 B 題的 Bonus（Reusable Card Architecture / Schema Extensibility）。

## 資料契約

`Product` 型別是整個系統的契約，AI 後續擴充時以型別為護欄：

```ts
interface Product {
  id: string
  title: string
  image: string
  price: number
  originalPrice?: number     // 有則顯示折扣
  rating?: number
  reviewCount?: number
  tags?: PromotionTag[]      // '免運' | '限時' | '滿額折' ...
  category: CategoryId
}
```

## 路由

| 路徑 | 頁面 | 範圍 |
|---|---|---|
| `/` | 首頁 | 完整：輪播 + 下殺 + 商品牆 + 排行 |
| `/search` | 搜尋結果 | 完整：query 過濾 + 卡片牆 |
| `/goods/:id` | 商品頁 | 完整：走通單品資料流 |
| `/discover` | 探索 | 主題式商品列（共用 sections） |
| `/live` | 直播 | live 卡片變體展示 |

> 五條路由全做，但深度有別：`/`、`/search`、`/goods/:id` 走通完整資料流；
> `/discover`、`/live` 著重展示卡片變體與版型，不重複堆疊瑣碎功能（理由見 doc 02）。
