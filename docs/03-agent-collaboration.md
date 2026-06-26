# Human-Agent Iteration & Observability

> 對應題目 Bonus：Human-Agent Iteration Architecture / Validation / Observability Thinking。
> 核心立場：把自己定位為 **AI 產出的監督者與架構守門人**，而不是把鍵盤交出去。

## 1. 協作工作流（怎麼指揮 AI）

採「**人定契約 → AI 填實作 → 人驗收**」的循環：

1. **人先定邊界**：型別契約（`Product`）、分層、卡片 variant 介面由人決定並寫進 doc。
   → 給 AI 護欄，避免它自由發揮把架構帶歪。
2. **AI 在契約內實作**：一個 commit 對應一個明確、可驗收的任務（資料層 / 卡片 / 單一路由）。
3. **人驗收每個 commit**：跑 `type-check` + `build` + 視覺檢查，不過不進下一步。
4. **回饋收斂**：發現偏差立即在下一個 commit 修正，並把學到的規則寫回 doc，讓後續產出更穩。

## 2. Commit 策略（history 即證據）

- **一動作一 commit**，訊息用 conventional commits（`feat:` / `chore:` / `docs:`）。
- Agent 參與的 commit 標註 co-author，使協作可追溯：

  ```
  Co-authored-by: Claude <noreply@anthropic.com>
  ```

- Commit 顆粒度本身就在展示「能把大任務拆成可驗收的小步」。

## 3. Validation —— 不讓 AI 產出無防護的程式

即使是 mock 資料，也建立 runtime 驗證（`mock/schema.ts`）：

- 載入 mock 資料時驗證每筆 `Product` 形狀（必要欄位、價格非負、`originalPrice >= price`）。
- 開發模式下，資料不合法 → console 警告並指出哪筆、哪個欄位。
- 價值：當 AI 之後新增資料或欄位時，**錯誤在邊界就被攔截**，不會默默壞掉 UI。

## 4. Observability —— 開發期的最小可觀測性

- 資料存取層（`mock/api.ts`）在 dev 模式記錄請求/耗時，模擬真實 API 的觀測點。
- 卡片 variant 若收到未知型別，fallback 成標準卡並 `console.warn`，而非整頁崩潰。
- 這些是「正式環境 error boundary + 前端監控」的縮小版示範方向。

## 5. 這套作法如何規模化

- 契約（型別 + doc）讓多個 AI agent / 多人能平行擴充而不互相破壞。
- variant/schema 模式讓「加一種卡片」變成低風險、可被 AI 安全執行的局部變更。
- 文件與 commit history 形成知識留存，新接手者（人或 agent）能快速理解系統意圖。
