# WebSec Lab | OWASP Top 10 互動攻防實境與場景解析
> **課業小專題 (TAICA-AI 專案)**
> 專為初學者與專題報告設計的動態 Web 資安互動學習網站。

---

## 🎯 專題核心設計目標

1. **破除理論枯燥**：把抽象的資安名詞（如 SQLi、IDOR、XSS、MD5 彩虹表）轉化為可在瀏覽器中親手操作的動態沙盒。
2. **強調「真實踩雷場景」**：詳細剖析工程師在開發什麼業務功能（電商登入、訂單查詢、留言板、API 接口、密碼儲存）時最容易寫出漏洞。
3. **攻防雙向對比**：提供「脆弱代碼 (Vulnerable)」vs「安全修復代碼 (Secure)」，並可在沙盒中一鍵切換防禦機制，即時驗證阻斷效果。
4. **專題互動展示神器**：內建全端架構威脅圖、OWASP Top 10 全覽、5 題情境測驗（含即時評分與彩帶特效）及開發防禦檢核清單。

---

## 🎮 5 大核心互動實驗室 (Live Sandboxes)

| 漏洞名稱 | OWASP 編號 | 容易發生的場景 | 互動沙盒亮點 |
| :--- | :--- | :--- | :--- |
| **SQL 注入攻擊 (SQLi)** | A03:2021 | 電商登入、商品關鍵字搜尋、分頁排序 | • 一鍵填入 `' OR 1=1 --`<br>• 即時語意樹高亮<br>• 切換「字串拼接 vs 參數化查詢」 |
| **失效存取控制 (IDOR)** | A01:2021 | 個人訂單查詢、健檢報告下載、資料修改 | • 扮演 Bob 修改 API 參數 `order_id=1001`<br>• 越權窺視 Alice 機密個資<br>• 切換「資源歸屬權檢查」防禦 |
| **XSS 跨站腳本攻擊** | A03:2021 | 社群留言板、文章評論區、個人簡介 | • 留言注入 `<img onerror=...>`<br>• 觸發瀏覽器彈窗與 Session Cookie 遭竊<br>• 切換「HTML Entity 轉義」輸出 |
| **暴力破解與速率限制** | A07:2021 | 登入與 OTP 驗證 API 缺乏頻率限制 | • 模擬 Burp Intruder 高頻撞庫動畫<br>• 第 7 次猜中弱密碼<br>• 切換「Rate Limit (429 阻斷)」|
| **弱雜湊與彩虹表攻擊** | A02:2021 | 資料庫密碼儲存使用 MD5 / SHA-1 | • 輸入密碼生成 MD5，彩虹表 0.0002 秒秒破<br>• 切換「bcrypt + 隨機 Salt」使彩虹表徹底失效 |

---

## 🚀 快速啟動指南

### 1. 安裝套件
```bash
npm install
```

### 2. 啟動本地開發伺服器
```bash
npm run dev
```
啟動後在瀏覽器開啟提示的網址（預設通常為 `http://localhost:5173`）。

### 3. 建置生產版本
```bash
npm run build
```

---

## 📁 專案架構說明

```
c:\Users\mybab\Desktop\TAICA-AI專案\
├── src/
│   ├── components/
│   │   ├── Header.jsx                 # 頂部導航與品牌標誌
│   │   ├── VulnerabilityCard.jsx      # 漏洞概述卡片組件
│   │   ├── VulnerabilityDetailView.jsx# 漏洞四分頁詳細視圖（沙盒/場景/原理/代碼）
│   │   ├── ArchitectureMap.jsx        # 全端 Web 架構與攻擊面場景地圖
│   │   ├── OwaspOverviewTable.jsx     # OWASP Top 10 (2021) 完整規範清單
│   │   ├── QuizSection.jsx            # 5 題實戰情境測驗（含特效與評分）
│   │   ├── DefenseChecklist.jsx       # 10 項安全開發檢核清單
│   │   └── sandboxes/
│   │       ├── SqlInjectionSandbox.jsx   # SQL 注入動態模擬器
│   │       ├── IdorSandbox.jsx           # IDOR 越權 API 模擬器
│   │       ├── XssSandbox.jsx            # XSS 留言板與 Cookie 竊取模擬器
│   │       ├── BruteForceSandbox.jsx     # 暴力破解與 Rate Limit 模擬器
│   │       └── CryptoFailureSandbox.jsx  # MD5 彩虹表 vs Bcrypt 模擬器
│   ├── data/
│   │   ├── vulnerabilities.js         # 漏洞資料、原理解析、脆弱/安全代碼庫
│   │   └── quizQuestions.js           # 實戰情境測驗題庫
│   ├── App.jsx                        # 主頁面整合
│   └── index.css                      # Tailwind CSS 樣式
├── package.json
└── vite.config.js
```

---

## 🎤 課業專題口頭報告建議講稿結構 (3~5 分鐘)

1. **研究動機 (1 分鐘)**：
   - 很多同學或新手在寫 Web 專案時只關注「功能能不能跑」，卻完全不知道自己在登入、搜尋、訂單 API 寫法中埋下了致命的 OWASP 漏洞。
   - 傳統宣導文章太枯燥，因此我們打造了這個「情境化 + 動態沙盒」的教學網站。
2. **核心展示 (2 分鐘)**：
   - 現場 Demo **SQL 注入**：點擊預設語法，展示原本的 SQL 是怎麼被破壞的；切換開關展示參數化查詢如何阻斷攻擊。
   - 現場 Demo **IDOR 越權**：展示改一下網址上的 `order_id`，為什麼就能看到別人的電話與住址。
   - 介紹**全端架構圖**：說明從前端到資料庫，每一層容易踩雷的地方。
3. **成效檢驗與結論 (1 分鐘)**：
   - 展示**情境測驗模組**與**開發檢核表**，說明本系統如何幫助學生在專案上線前落實安全開發防護。
