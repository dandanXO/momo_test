# rule.md — 給評估者的閱讀指南與工程規範

> 一頁讀懂本專案：它是什麼、怎麼跑、對照評分標準看哪裡、以及我遵循的工程規範。
> 立場：把自己當成此系統的**長期維護者**，而非一次性功能實作者。

---

## 1. 專案定位

純前端 Mock momoshop（題目 A）+ Card Showroom（題目 B），**同一個 repo、共用同一套卡片架構**。
無任何真實 API 呼叫，資料全為 mock；重點放在**架構、可維護性、取捨與 AI 協作**，而非 UI 精緻度。

## 2. 30 秒啟動

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # type-check + production build
pnpm test       # 7 個測試（schema 驗證 + api smoke）
```

逛這幾個地方最快看出設計：
- `/`（首頁商品牆 + 限時下殺 + 排行榜）
- `/showroom`（卡片編輯器 + 即時預覽 + 全變體；改完重整看持久化）
- `/sample.html`（Web Component，零框架依賴的對外範例）

## 3. 對照評估標準的索引（rubric → 證據）

| 評估項目 | 在哪裡看 |
|---|---|
| 架構與可維護性 | `docs/01-architecture.md`、`src/components/cards/`、`src/mock/` |
| Production / Delivery Thinking | 資料層即邊界 `src/mock/api.ts`、code-split 路由、`pnpm build` |
| Tradeoff Thinking | `docs/02-tradeoffs.md`（優先序 + 刻意不做 + 退守順序） |
| AI / Agent 協作與監督 | `docs/03-agent-collaboration.md`、24/24 commit 的 `Co-authored-by` |
| 問題拆解 / 系統演進 | commit history（一動作一 commit）、README roadmap |
| A：路由 / 狀態 / Mock Data | `src/router`、`src/stores`、`src/mock` |
| A Bonus：Validation / Observability | `src/mock/schema.ts`、`src/mock/api.ts`、`src/mock/__tests__` |
| B：列卡 / 單卡 / 持久化 / sample | `/showroom`、`src/stores/cardConfig.ts`、`public/sample.html` |
| B Bonus：Reusable / Schema / State Consistency | `docs/04-card-showroom.md` |

## 4. 工程規範（本專案遵循的 rules）

這些是讓 AI 與人都能安全擴充系統的規則：

1. **型別即契約**：`Product`（`src/mock/schema.ts`）是全系統單一契約；任何資料越過邊界前需通過 `validateProduct`。
2. **UI 不直接碰資料**：頁面 → store / composable → `mock/api.ts`。接真後端只准改 `mock/api.ts` 這一層。
3. **卡片以 variant + schema 驅動**：新增卡片類型 = 加一個 `variant` 與對應小元件，**不得修改既有變體邏輯**（開放封閉）。未知 variant 必須 fallback + warn，不得讓畫面崩潰。
4. **對外輸出不綁框架**：對外卡片以 Web Component 實作（`public/momo-card.js`），與 Vue 版共用同一份 schema 語意，但不引入 Vue runtime。
5. **狀態一致性**：可持久化狀態走單一來源（Pinia）→ `localStorage`（`watch` 同步）→ 即時驗證，三者保持一致。
6. **Commit 規範**：一個動作一個 commit；conventional commits（`feat/fix/docs/chore/test`）；AI 參與一律標註 `Co-authored-by`。
7. **可驗收才算完成**：每個 commit 需通過 `type-check`；資料 / 邏輯類變更需有對應測試或驗證。

## 5. AI 協作規範（Human-Agent Iteration）

採「**人定契約 → AI 在契約內實作 → 人逐 commit 驗收**」循環：
- 人先定型別、分層、variant 介面（護欄），再交給 AI 填實作。
- 每個 commit 都先過 `type-check` / `build` / 視覺檢查才進下一步。
- 偏差立即修正並把規則寫回文件，使後續產出更穩、可規模化。
詳見 `docs/03-agent-collaboration.md`。

## 6. 刻意不做（取捨摘要）

購物車結帳 / 金流、會員登入、真實搜尋演算法、SSR/SEO、完整 RWD、像素級還原。
理由與「時間不足時的退守順序」見 `docs/02-tradeoffs.md`。

## 7. 未來維護與演進（分模組）

| 模組 | 下一步 | 優先 |
|---|---|---|
| 資料層 | 以 zod 取代手寫驗證；`api.ts` 換成真實 HTTP client（上層不動） | 高 |
| 卡片系統 | 演進為 server-driven UI（後端下發版型）；新增組合包 / 加價購變體 | 高 |
| 品質 | 元件層測試、E2E（Playwright）、CI | 高 |
| 狀態管理 | query 失效 / 重取策略（React Query 風格快取） | 中 |
| i18n | UI 文案全面接入、語系檔依頁面拆分 lazy load | 中 |
| 效能 | 商品牆虛擬捲動、圖片 lazy load + CDN | 中 |
| 可觀測性 | dev 驗證升級為正式 error boundary + 前端監控（Sentry） | 中 |

## 8. 已知限制（誠實揭露）

- momo 首頁為 JS 動態渲染，fetch 只取得 HTML 外殼 + meta，故版型是依**品牌色 / 分類 / 促銷特徵**重建，非逐像素對照。
- i18n 目前為基礎建設層，UI 文案尚未全面接入。
- 商品圖以 picsum 佔位，避免版權與抓圖成本。
