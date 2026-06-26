# Card Showroom（題目 B）

> A 與 B 共用同一個 repo 與同一套卡片架構。B 在 A 的 `ProductCard` 基礎上，
> 補上「展示 / 編輯 / 持久化 / 對外輸出」四件事。

## 對應題目需求

| 需求 | 實作 |
|---|---|
| 列出所有商品卡 / 展示單一商品卡 | `/showroom`：底部「所有卡片變體」一覽 + 上方即時預覽單卡 |
| 商品卡細節調整介面 — Browser-side Persistence | Showroom 編輯器，設定存於 `localStorage`（`momo:cardConfig`），重整不遺失 |
| 提供使用商品卡的 sample html | `public/sample.html` + `public/momo-card.js`（Web Component，script 載入） |

## Bonus 對應

- **Reusable Card Architecture** — 同一份 `Product` schema 與 `variant` 概念，同時驅動 Vue 版 `ProductCard.vue` 與框架無關的 Web Component；A 的首頁 / 搜尋 / 直播頁與 B 的 showroom 全部重用同一個卡片。
- **Schema / Plugin Extensibility** — 卡片由 `variant` + schema 決定外觀；新增變體 = 加一個 case 與小元件，不動既有邏輯。Web Component 以 `data`(JSON) + `variant` 屬性驅動，等同對外開放的 schema 介面。
- **State Consistency Strategy** — 單一狀態來源（Pinia `cardConfig` store）；`watch(deep)` 自動同步 localStorage；編輯中的商品即時跑 `validateProduct` 顯示契約是否合法，確保「狀態 ↔ 儲存 ↔ 驗證」三者一致。

## 兩種卡片實作如何共用設計

```
Product schema (mock/schema.ts)  ← 單一契約
        │
        ├── ProductCard.vue        （Vue / 站內使用，A + B showroom）
        └── public/momo-card.js    （Web Component / 對外，sample.html）
```

兩者刻意不共用程式碼（一個吃 Vue runtime、一個要零依賴），但**共用同一份 schema 與 variant 語意**。
這是有意識的取捨：對外輸出的卡片不該把 Vue 綁進去，因此以 Web Component 重新實作，但保持介面一致，維護者只需理解一套 schema。

## 試用方式

- 站內：`pnpm dev` → 開 `/showroom`，調整參數即時預覽，重整驗證持久化。
- 對外：build 後開 `dist/sample.html`（或 dev 模式 `/sample.html`），示範以 `<script>` 載入卡片元件。
