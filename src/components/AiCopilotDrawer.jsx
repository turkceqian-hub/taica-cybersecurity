import React, { useState } from 'react';
import { Bot, Sparkles, Send, ShieldAlert, CheckCircle, Code, MessageSquare, RefreshCw } from 'lucide-react';

export default function AiCopilotDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'chat'
  const [codeSnippet, setCodeSnippet] = useState(`// 請在此貼上待分析的程式碼，或點選下方範例
app.get('/api/search', (req, res) => {
  const query = "SELECT * FROM items WHERE name LIKE '%" + req.query.q + "%'";
  db.query(query, (err, results) => {
    res.json(results);
  });
});`);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Chat tab states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: '你好！我是你的 AI 資安攻防顧問。你可以貼上程式碼讓我做「代碼漏洞審計」，或向我詢問任何 Web 安全與 OWASP Top 10 的防禦問題！'
    }
  ]);

  const codePresets = [
    {
      title: 'SQL 拼接查詢',
      code: `app.get('/api/search', (req, res) => {
  const query = "SELECT * FROM items WHERE name LIKE '%" + req.query.q + "%'";
  db.query(query, (err, results) => {
    res.json(results);
  });
});`
    },
    {
      title: '不安全 IDOR 訂單查詢',
      code: `app.get('/api/order/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});`
    },
    {
      title: '未加鹽 MD5 密碼雜湊',
      code: `function savePassword(plainPassword) {
  const md5Hash = crypto.createHash('md5').update(plainPassword).digest('hex');
  db.users.update({ password: md5Hash });
}`
    }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);

      if (codeSnippet.includes("SELECT") && codeSnippet.includes("+")) {
        setAnalysisResult({
          vulnName: 'A03:2021 - SQL 注入漏洞 (SQL Injection)',
          riskLevel: 'Critical (極高風險)',
          location: "const query = 'SELECT * ... + req.query.q + ...'",
          reason: '伺服器未採用參數化查詢，直接將 URL 傳入的 req.query.q 字串拼接到 SQL 語句中，攻擊者可藉由惡意引號竄改查詢結構。',
          recommendation: '改用預編譯參數化查詢 (Prepared Statement)，例如：db.query("SELECT * FROM items WHERE name LIKE ?", ["%" + req.query.q + "%"])'
        });
      } else if (codeSnippet.includes("findById") && !codeSnippet.includes("userId")) {
        setAnalysisResult({
          vulnName: 'A01:2021 - 失效的存取控制 (IDOR 越權)',
          riskLevel: 'High (高風險)',
          location: 'Order.findById(req.params.id)',
          reason: 'API 僅以客戶端傳入的 id 查詢，未驗證該訂單是否屬於當前已驗證的使用者 (req.user.id)。',
          recommendation: '在查詢條件中強制加入目前登入使用者的身分限制：Order.findOne({ _id: req.params.id, userId: req.user.id })'
        });
      } else if (codeSnippet.toLowerCase().includes("md5")) {
        setAnalysisResult({
          vulnName: 'A02:2021 - 加密機制失效 (弱雜湊 MD5)',
          riskLevel: 'High (高風險)',
          location: "crypto.createHash('md5')",
          reason: 'MD5 演算法極易遭受彩虹表 (Rainbow Table) 逆向反查，且計算複雜度低，無法抵禦 GPU 暴力破解。',
          recommendation: '改用 bcrypt 或 Argon2id，搭配隨機加鹽 (Salt) 與可調工作因子 (Cost Factor)。'
        });
      } else {
        setAnalysisResult({
          vulnName: '潛在安全注意點 (General Security Review)',
          riskLevel: 'Medium (中等風險)',
          location: '使用者輸入與狀態管理邏輯',
          reason: '請確保所有外部不可信任輸入均通過嚴格的型別檢查 (Schema Validation) 與邊界約束。',
          recommendation: '建議引入 Zod 或 Joi 進行輸入驗證，並啟用 Content Security Policy (CSP) 與安全 Header。'
        });
      }
    }, 700);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let reply = '這是一個非常好的資安問題！';
      const q = userText.toLowerCase();

      if (q.includes('sql') || q.includes('資料庫')) {
        reply = 'SQL 注入防禦的核心原則是「參數化查詢 (Prepared Statements)」！切記千萬不要用字串相加組裝 SQL。資料庫會把參數嚴格當作純文字處理，永遠不會被當作指令執行。';
      } else if (q.includes('idor') || q.includes('越權')) {
        reply = '防止 IDOR (越權存取) 的關鍵是：後端絕不能相信前端傳來的 ID！每一筆查詢或更新請求，後端都必須從 JWT/Session 中取出當前使用者的 ID 做「資源擁有權比對 (Ownership Check)」。';
      } else if (q.includes('xss')) {
        reply = 'XSS 的主要防禦方式是「輸出轉義 (HTML Entity Encoding)」以及「後端設置 HttpOnly Cookie」。只要 Cookie 加上 HttpOnly，即便前端被注入了惡意 JS，腳本也無法偷取 Session Token！';
      } else if (q.includes('密碼') || q.includes('md5') || q.includes('hash')) {
        reply = '現代密碼儲存的黃金標準是 Argon2id 或 bcrypt！絕對不能使用 MD5 或 SHA1，因為它們沒有動態加鹽，駭客用彩虹表可以在幾毫秒內秒破幾億組密碼。';
      } else {
        reply = `針對「${userText}」，在 OWASP 安全體系中，核心精神是「零信任 (Zero Trust)」與「深度防禦 (Defense in Depth)」。所有不可信的使用者輸入都要驗證，後端必須實施嚴格的權限邊界！`;
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slideLeft font-sans">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              AI 資安攻防顧問 (Cyber Copilot)
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                TAICA-AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">智慧程式碼審計與資安情境解答小幫手</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 text-xs"
        >
          ✕ 關閉
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          代碼漏洞智慧審計
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'chat'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          資安導師對話室
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'audit' ? (
          <div className="space-y-4">
            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">快速載入範例程式碼：</span>
              <div className="flex flex-wrap gap-1.5">
                {codePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCodeSnippet(preset.code);
                      setAnalysisResult(null);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 transition-colors"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">原始程式碼 (支援 Node.js, PHP, Python 等)</label>
              <textarea
                rows={7}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AI 深度模型掃描中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  執行 AI 資安審計
                </>
              )}
            </button>

            {/* Analysis Result */}
            {analysisResult && (
              <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    {analysisResult.vulnName}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    {analysisResult.riskLevel}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 font-semibold">危險語法標記：</div>
                  <code className="block bg-slate-900 p-2 rounded text-[11px] font-mono text-amber-300 border border-slate-800">
                    {analysisResult.location}
                  </code>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 font-semibold">漏洞原因解析：</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {analysisResult.reason}
                  </p>
                </div>

                <div className="space-y-1 text-xs pt-1 border-t border-slate-800/80">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    AI 修復建議：
                  </div>
                  <p className="text-emerald-300/90 leading-relaxed text-[11px] bg-emerald-950/20 p-2 rounded border border-emerald-900/40">
                    {analysisResult.recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Chat Tab */
          <div className="flex flex-col h-full space-y-3">
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="詢問任何資安疑惑，例如：如何防範 CSRF？"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

