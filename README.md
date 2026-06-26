# Mock momoshop

純前端重建 [momo 購物網](https://www.momoshop.com.tw/) 的核心體驗（Frontend Take-Home, 題目 A）。
**無任何真實 API 呼叫**，所有資料皆為 mock。

> 設計理念：把自己當成此系統的長期維護者，而非一次性的功能實作者。
> Phase 1 設計筆記與取捨分析見 [`docs/`](./docs)。

---

## 目錄

- [Tech Stack](#tech-stack)
- [快速開始](#快速開始)
- [專案結構（分模組）](#專案結構分模組)
- [模組功能總覽](#模組功能總覽)
- [路由與頁面功能](#路由與頁面功能)
- [核心設計決策](#核心設計決策)
- [刻意不做（取捨）](#刻意不做取捨)
- [後續演進計畫（分模組）](#後續演進計畫分模組)
- [驗證狀態](#驗證狀態)

---

## Tech Stack

| 類別 | 技術 |
|---|---|
| Framework | Vue 3（`<script setup>` + TypeScript） |
| Build | Vite |
| Routing | Vue Router（含 lazy load、scrollBehavior） |
| State | Pinia |
| i18n | vue-i18n（`zh-TW` / `en`） |
| Styling | Tailwind CSS v4（`@theme` 設計 token） |
| Test | Vitest + @vue/test-utils + jsdom |
| Lint | ESLint + oxlint |

## 快速開始

```bash
pnpm install
pnpm dev          # 開發伺服器
pnpm build        # type-check + production build
pnpm test         # 執行 schema 驗證與 mock api smoke 測試
pnpm lint         # oxlint + eslint
```

## 專案結構（分模組）

```
src/
├── mock/                  # ① 資料層（模擬後端邊界）
│   ├── schema.ts          #    型別契約 + runtime 驗證 + 分類定義
│   ├── products.ts        #    mock 商品資料（36 筆，跨 6 分類）
│   ├── api.ts             #    async 資料存取 + dev 觀測
│   └── __tests__/         #    schema / api 測試
├── stores/                # ② 狀態管理（Pinia）
│   └── products.ts        #    商品資料單一來源 + 快取
├── composables/           # ③ 可重用邏輯
│   └── useCountdown.ts    #    倒數計時
├── components/
│   ├── cards/             # ④ 卡片系統（schema/variant 驅動）★ 核心
│   │   ├── ProductCard.vue
│   │   ├── CountdownTimer.vue
│   │   └── PromotionTags.vue
│   ├── sections/          # ⑤ 首頁區塊（可重用）
│   │   ├── HeroCarousel.vue
│   │   ├── FlashSaleSection.vue
│   │   ├── RankingSection.vue
│   │   ├── ProductWall.vue
│   │   └── SectionTitle.vue
│   ├── layout/            # ⑥ 版面框架
│   │   ├── AppHeader.vue
│   │   ├── CategoryNav.vue
│   │   └── AppFooter.vue
│   └── LocaleSwitcher.vue
├── i18n/                  # ⑦ 多語系
│   ├── index.ts
│   └── locales/{en,zh-TW}.json
├── router/                # ⑧ 路由
│   └── index.ts
├── views/                 # ⑨ 頁面
│   ├── HomeView.vue
│   ├── SearchView.vue
│   ├── GoodsView.vue
│   ├── DiscoverView.vue
│   ├── LiveView.vue
│   └── NotFoundView.vue
└── assets/main.css        # ⑩ 全域樣式 + 設計 token
```

## 模組功能總覽

### ① 資料層 `mock/`
模擬真實後端的邊界。UI 與 store 一律透過這層取資料，未來接真 API 只需替換此模組。

- **`schema.ts`** — 定義 `Product`、`CategoryId`、`PromotionTag` 等型別契約；`CATEGORIES` 六大分類；`validateProduct()` / `validateProducts()` runtime 驗證（必填欄位、價格非負、`originalPrice >= price`、分類合法），dev 模式對壞資料發出明確警告。
- **`products.ts`** — 以分類模板產生 36 筆 mock 商品，涵蓋折扣 / 評分 / 促銷標籤等情境；圖片用 picsum 佔位。
- **`api.ts`** — `fetchProducts(query)`、`fetchProduct(id)`、`fetchFlashSale()`、`fetchRanking()`，全為 async（模擬延遲）；dev 模式記錄每次請求耗時與筆數（observability）；啟動時對資料做一次契約驗證。

### ② 狀態管理 `stores/products.ts`
Pinia store，商品資料的單一來源。提供 `loadHome()`（限時下殺 + 排行榜）、`query()`（含 `Map` 快取，避免重複請求，縮小版 query cache）。

### ③ Composables `composables/`
- **`useCountdown(endsAt)`** — 把倒數時間邏輯從 UI 抽離，回傳 `remaining` / `expired` / `text`，可被任何需要倒數的元件重用。

### ④ 卡片系統 `components/cards/` ★ 專案核心
- **`ProductCard.vue`** — schema/variant 驅動的單一商品卡，支援四種變體：
  - `standard` — 標準卡（圖、促銷標籤、標題、價格、折扣 badge、評分）
  - `flashSale` — 限時下殺（倒數 + 已售進度條）
  - `ranking` — 排行榜（左上名次）
  - `live` — 直播（LIVE 標記）
  - 未知變體會 **fallback 成 standard 並警告**，不讓畫面崩潰。
- **`CountdownTimer.vue`** — 包裝 `useCountdown` 的倒數顯示元件。
- **`PromotionTags.vue`** — 促銷標籤（限時 / 免運 / 滿額折 / 新品 / 熱銷 / 直播優惠），各有對應配色。

### ⑤ 區塊 `components/sections/`
可重用的頁面組裝積木，被多個頁面共用：

- **`HeroCarousel.vue`** — 自動輪播 banner（漸層 + 指示點）。
- **`FlashSaleSection.vue`** — 限時下殺區，全區共用一個倒數，渲染 `flashSale` 卡片。
- **`RankingSection.vue`** — 人氣排行榜，渲染 `ranking` 卡片。
- **`ProductWall.vue`** — 高密度商品牆（手機 2 欄 → 桌機 6 欄）。
- **`SectionTitle.vue`** — 統一的區塊標題（含 accent 色條與 action slot）。

### ⑥ 版面 `components/layout/`
- **`AppHeader.vue`** — 洋紅置頂 header：logo、搜尋框（送出導向 `/search?q=`）、探索 / 直播 / 購物車 / 語言切換。
- **`CategoryNav.vue`** — 分類橫向導覽，點擊導向 `/search?cat=`。
- **`AppFooter.vue`** — 頁尾與 mock 聲明。
- **`LocaleSwitcher.vue`** — 語言切換（樣式配合洋紅背景，半透明膠囊 + 地球 icon），選擇記憶於 `localStorage`。

### ⑦ i18n `i18n/`
vue-i18n（Composition 模式），`zh-TW` / `en` 兩語系，啟動時依 `localStorage` 或瀏覽器語言決定初始語言；目前涵蓋 UI chrome（導覽 / 搜尋 / 語言）字串。

### ⑧ 路由 `router/index.ts`
HTML5 history 模式，首頁直載、其餘頁面 lazy load，切頁自動捲回頂部，含 404 萬用路由。

### ⑨ 頁面 `views/`
見下方[路由與頁面功能](#路由與頁面功能)。

### ⑩ 樣式 `assets/main.css`
Tailwind v4 進入點 + `@theme` 設計 token：品牌洋紅 `--color-momo (#D62872)`、`momo-dark`、`momo-light`、促銷橘 `momo-accent`，以及 ink / line / surface 等中性色，產生 `bg-momo`、`text-momo` 等 utilities。

## 路由與頁面功能

| 路由 | 頁面 | 功能 |
|---|---|---|
| `/` | HomeView | 輪播 banner、限時下殺（共用倒數）、分類商品牆 ×3、人氣排行榜 |
| `/search?q=&cat=` | SearchView | 依關鍵字 / 分類查詢，顯示結果數、載入中與空狀態；query 變動即重查 |
| `/goods/:id` | GoodsView | 商品詳情、折扣、促銷標籤、相關商品；查無商品的處理 |
| `/discover` | DiscoverView | 編輯精選主題商品列（重用 sections） |
| `/live` | LiveView | 直播購物，直播間卡 + `live` 變體商品卡 |
| `*` | NotFoundView | 404 |

## 核心設計決策

1. **卡片 schema/variant 驅動** — 同一份 `Product` 依 `variant` 呈現不同卡片；新增卡片類型只需加一個 variant 與小元件，不動既有邏輯（開放封閉）。同時命中 Reusable Card Architecture / Schema Extensibility。
2. **資料層即邊界** — UI / store 只透過 `mock/api.ts` 取資料（皆 async）。接真後端只動這一層，上層不動。
3. **型別即契約 + runtime 驗證** — `Product` 是全系統契約；資料越過邊界前被驗證，dev 模式攔截並標示壞資料（見 `docs/03`）。

完整架構說明見 [`docs/01-architecture.md`](./docs/01-architecture.md)。

## 刻意不做（取捨）

購物車結帳 / 金流、會員登入、真實搜尋演算法、SSR / SEO、完整 RWD、像素級還原。
i18n 目前為基礎建設層（機制與切換器就緒，UI 文案尚未全面接入）。
理由與退守順序見 [`docs/02-tradeoffs.md`](./docs/02-tradeoffs.md)。

## 後續演進計畫（分模組）

> 以模組為單位的演進路線，方便長期維護者分批接手。

| 模組 | 計畫項目 | 優先 |
|---|---|---|
| ① 資料層 | 以 zod 取代手寫驗證；`api.ts` 抽成可替換的真實 HTTP client | 高 |
| ② 狀態管理 | 導入 query 失效 / 重取策略（React Query 風格快取層） | 中 |
| ④ 卡片系統 | 演進為 server-driven UI（後端下發版型設定）；新增「組合包 / 加價購」變體 | 高 |
| ⑤ 區塊 | 區塊改為設定驅動（首頁版位由資料決定排序） | 中 |
| ⑥ 版面 | 購物車 drawer、會員選單、完整 RWD | 中 |
| ⑦ i18n | UI 文案全面接入；語系檔依頁面拆分與 lazy load | 中 |
| ⑧ 路由 | 路由守衛、頁面層級 loading / error 邊界 | 低 |
| 效能 | 商品牆虛擬捲動（vue-virtual-scroller）、圖片 lazy load 與 CDN | 中 |
| 品質 | 元件層測試、E2E（Playwright）、CI | 高 |
| 可觀測性 | dev 驗證升級為正式 error boundary + 前端監控（Sentry） | 中 |

## Human-Agent 協作與可觀測性

全程與 AI agent 協作完成，採「人定契約 → AI 在契約內實作 → 人逐 commit 驗收」循環。
Commit 一動作一個、conventional commits、全部標註 `Co-authored-by`。
Validation：`mock/schema.ts` + Vitest；Observability：`api.ts` dev 耗時記錄、卡片未知變體 fallback + warn。
詳見 [`docs/03-agent-collaboration.md`](./docs/03-agent-collaboration.md)。

## 驗證狀態

`pnpm type-check`、`pnpm build`（按路由 code-split）、`pnpm test`（7 tests）皆通過。
