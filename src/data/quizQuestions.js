export const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: 'A03:2021 Injection',
    question: '工程師在開發會員登入 API 時，寫下：`SELECT * FROM users WHERE email=\'${req.body.email}\' AND password=\'${req.body.password}\'`。攻擊者在密碼欄輸入了什麼可以無密碼直接登入？',
    options: [
      { text: "' OR 1=1 --", isCorrect: true, feedback: '正確！\' 閉合前引號，OR 1=1 使判斷式恆真，-- 註解掉後續的密碼比對，造成身分驗證被直接繞過！' },
      { text: "<script>alert(1)</script>", isCorrect: false, feedback: '這是 XSS 的測試 Payload，此處是在 SQL 查詢語境中，不會觸發 XSS。' },
      { text: "../../../../etc/passwd", isCorrect: false, feedback: '這是路徑遍歷 (Path Traversal) 的 Payload，無法繞過 SQL 邏輯。' },
      { text: "admin:admin", isCorrect: false, feedback: '這只是一組猜測的帳密，如果密碼不對依然無法登入。' }
    ],
    scenario: '真實場景：許多剛學 Web 開發的學生或初學者，最容易貪圖方便用模板字串拼接 SQL，直接引爆 SQL 注入。'
  },
  {
    id: 2,
    category: 'A01:2021 Broken Access Control',
    question: '小明在查看自己的訂單時，網址列顯示 `https://shop.test/order?id=8025`。他隨手將 8025 改成 8024，竟然看到了隔壁班同學的姓名、電話和購買商品！請問該系統存在什麼漏洞？',
    options: [
      { text: "IDOR (不安全的直接物件引用 / 橫向越權)", isCorrect: true, feedback: '正確！系統直接暴露資料庫 ID 作為參數，且後端只確認了小明已登入，卻沒驗證「訂單 8024 是不是小明的」。' },
      { text: "CSRF (跨站請求偽造)", isCorrect: false, feedback: 'CSRF 是誘騙受害者點擊連結發起未授權操作，這裡是用戶主動手動修改參數越權讀取。' },
      { text: "SQL Injection (SQL 注入)", isCorrect: false, feedback: '小明只是改了另一個合法 ID 號碼，並未注入 SQL 語法指令。' },
      { text: "DDoS (分散式阻斷服務)", isCorrect: false, feedback: 'DDoS 是流量癱瘓攻擊，與權限存取缺陷無關。' }
    ],
    scenario: '真實場景：外送平台、電商網站、醫療診所系統在剛上線時最常爆出此漏洞。'
  },
  {
    id: 3,
    category: 'A03:2021 XSS',
    question: '在一個社群平台的個人自我介紹欄位，攻擊者填寫了 `<img src=x onerror="alert(document.cookie)">`。只要有其他用戶瀏覽該主頁，瀏覽器就會跳出 Cookie 警告視窗。這是哪一種類型的攻擊？',
    options: [
      { text: "預存型跨站腳本攻擊 (Stored XSS)", isCorrect: true, feedback: '正確！惡意腳本被保存在伺服器資料庫中，任何造訪該主頁的無辜使用者都會受害，危害最大。' },
      { text: "反射型跨站腳本攻擊 (Reflected XSS)", isCorrect: false, feedback: '反射型需要誘騙受害者點擊帶有參數的惡意 URL，腳本不會永久保存在資料庫中。' },
      { text: "中間人攻擊 (MITM)", isCorrect: false, feedback: '中間人攻擊是指在網路傳輸層攔截通訊，而非在網頁 DOM 注入腳本。' },
      { text: "SQL 注入攻擊 (SQLi)", isCorrect: false, feedback: '惡意腳本是在瀏覽器端被 DOM 渲染執行，並非資料庫被竄改。' }
    ],
    scenario: '真實場景：論壇留言板、商品評論區、GitHub Issue 或聊天室若未對 HTML 做 Entity Encoding，容易造成全站受害。'
  },
  {
    id: 4,
    category: 'A02:2021 Cryptographic Failures',
    question: '開發團隊發現舊系統資料庫直接用 `MD5(password)` 儲存密碼。資安專家指出這極度危險，主要原因是：',
    options: [
      { text: "MD5 計算速度太快且缺乏隨機加鹽 (Salt)，駭客可用彩虹表 (Rainbow Table) 瞬間反解明文", isCorrect: true, feedback: '賓果！現代顯卡每秒可算上百億次 MD5，且沒有加鹽的情況下相同的密碼雜湊永遠相同，彩虹表秒查！' },
      { text: "MD5 只能加密英文不能加密中文", isCorrect: false, feedback: 'MD5 是對二進位 Byte 做摘要計算，與文字語言無關。' },
      { text: "MD5 產生的字串太長導致資料庫空間不足", isCorrect: false, feedback: 'MD5 固定長度僅 32 個十六進位字元 (128-bit)，反而是非常短的。' },
      { text: "MD5 只能在 Windows 上運行，不相容 Linux", isCorrect: false, feedback: 'MD5 是通用的跨平台演算法規範。' }
    ],
    scenario: '真實場景：許多舊電商系統因循舊習使用 MD5，一旦伺服器遭入侵被拖庫，所有用戶的密碼等同於明文公開。'
  },
  {
    id: 5,
    category: 'A07:2021 Authentication Failures',
    question: '攻擊者撰寫 Python 腳本，對登入 API 在 30 秒內發送了 15,000 次密碼測試請求，成功猜中管理員密碼。請問後端最有效的即時防護手段是什麼？',
    options: [
      { text: "在 API 層引入 Rate Limiting (頻率限制，例如 15 分鐘最多 5 次失敗) 與 CAPTCHA 驗證碼", isCorrect: true, feedback: '正確！限制嘗試速率並在異常時加入圖形/人機驗證碼，能讓自動化暴力破解的成本提高到駭客無法承受。' },
      { text: "將資料庫升級到最新版", isCorrect: false, feedback: '資料庫版本升級無法防止針對 API 的自動化暴力請求。' },
      { text: "將 HTTP 改成 HTTPS", isCorrect: false, feedback: 'HTTPS 只能保護傳輸加密防監聽，無法阻止攻擊者主動向伺服器發送暴力登入請求。' },
      { text: "在前端 JavaScript 寫死帳號密碼比對", isCorrect: false, feedback: '把帳密寫在前端只會讓駭客直接按 F12 檢視原始碼一秒破解！' }
    ],
    scenario: '真實場景：沒有 Rate Limit 的 API 是撞庫 (Credential Stuffing) 與黑帽駭客的最愛。'
  }
];

