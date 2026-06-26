# Mock momoshop

純前端重建 [momo 購物網](https://www.momoshop.com.tw/) 的核心體驗（Frontend Take-Home, 題目 A）。
**無任何真實 API 呼叫**，所有資料皆為 mock。

> 設計理念：把自己當成此系統的長期維護者，而非一次性的功能實作者。
> 完整設計筆記與取捨分析見 [`docs/`](./docs)。

## Tech Stack

Vue 3 (`<script setup>` + TypeScript) · Vite · Vue Router · Pinia · vue-i18n · Tailwind CSS v4 · Vitest

## 快速開始

```bash
pnpm install
pnpm dev          # 開發伺服器
pnpm build        # type-check + production build
pnpm test         # 執行 schema 驗證與 mock api smoke 測試
```

## 已實作功能

| 路由 | 內容 |
|---|---|
| `/` | 輪播 banner、限時下殺（共用倒數）、分類商品牆、人氣排行榜 |
| `/search?q=&cat=` | 關鍵字 / 分類搜尋結果，含結果數與空狀態 |
| `/goods/:id` | 商品詳情、折扣、相關商品；查無商品的處理 |
| `/discover` | 編輯精選主題商品列（重用 sections） |
| `/live` | 直播購物，展示 `live` 卡片變體 |
| `*` | 404 |

## 架構重點

```
src/
  mock/        資料層：型別契約(schema) + mock 資料 + async api(模擬後端邊界) + runtime 驗證
  stores/      Pinia：商品資料單一來源 + 簡單快取
  composables/ useCountdown 等可重用邏輯
  components/
    cards/     ★ schema/variant 驅動的商品卡（standard / flashSale / ranking / live）
    sections/  首頁區塊（輪播 / 下殺 / 商品牆 / 排行）
    layout/    Header(含搜尋) / 分類導覽 / Footer
  views/       五條路由頁面
```

三個核心設計決策：

1. **卡片 schema/variant 驅動** — 同一份 `Product` 依 `variant` 呈現不同卡片；新增卡片類型只需加一個 variant 與對應小元件，不動既有邏輯。未知 variant 會 fallback 並警告，不讓畫面崩潰。
2. **資料層即邊界** — UI / store 一律透過 `mock/api.ts` 取資料（皆為 async）。未來接真後端只需替換這一層，上層不動。
3. **型別即契約 + runtime 驗證** — `Product` 型別是全系統契約；mock 資料越過邊界前會被 `validateProduct` 檢查，dev 模式對壞資料發出明確警告（見 `docs/03`）。

詳見 [`docs/01-architecture.md`](./docs/01-architecture.md)。

## 刻意不做（取捨）

購物車結帳 / 金流、會員登入、真實搜尋演算法、SSR/SEO、完整 RWD、像素級還原。
理由與退守順序見 [`docs/02-tradeoffs.md`](./docs/02-tradeoffs.md)。
i18n 目前為基礎建設層（`zh-TW` / `en` 機制與切換器已就緒），UI 文案尚未全面接入，屬有意識的優先序取捨。

## Human-Agent 協作與可觀測性

本專案全程與 AI agent 協作完成，採「**人定契約 → AI 在契約內實作 → 人逐 commit 驗收**」循環。
- Commit 顆粒度：一動作一 commit，conventional commits，agent 參與者標註 co-author。
- Validation：`mock/schema.ts` runtime 驗證 + Vitest 測試。
- Observability：`mock/api.ts` dev 模式記錄請求耗時；卡片未知變體 fallback + warn。

詳見 [`docs/03-agent-collaboration.md`](./docs/03-agent-collaboration.md)。

## 驗證狀態

`pnpm type-check`、`pnpm build`、`pnpm test`（7 tests）皆通過。
