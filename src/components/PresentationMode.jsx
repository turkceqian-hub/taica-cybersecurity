import React, { useState } from 'react';
import { Presentation, X, ChevronLeft, ChevronRight, Shield, Database, KeyRound, Code2, Bot, CheckCircle } from 'lucide-react';

export default function PresentationMode({ isOpen, onClose, onJumpToSandbox }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: '專題發表簡報 | Slide 01/05',
      title: 'WebSec Lab：OWASP Top 10 互動攻防實境與場景解析',
      subtitle: 'TAICA-AI 課業小專題成果報告',
      points: [
        '📌 核心痛點：初學者學 Web 開發時「只求功能跑得動」，缺乏資安防護意識。',
        '💡 設計理念：摒棄枯燥抽象的理論死背，將 Web 漏洞轉化為瀏覽器可動手操作的即時沙盒。',
        '🎯 專案主旨：聚焦「漏洞何時出現（業務場景）」、「攻擊者如何利用」與「安全防禦代碼對比」。'
      ],
      icon: Shield
    },
    {
      badge: '實戰場景分析 | Slide 02/05',
      title: 'OWASP 核心威脅與常見踩雷時機',
      subtitle: '真實開發情境中，漏洞最常潛伏在哪些業務功能中？',
      points: [
        '🛒 電商會員登入與搜尋 ➔ 貪圖方便使用字串拼接 SQL，直接引爆 SQL Injection (A03)。',
        '📦 我的訂單與檔案下載 ➔ 僅驗證「使用者已登入」，未校驗「資源是否屬於當前用戶」，引發 IDOR 越權 (A01)。',
        '💬 論壇留言與自我介紹 ➔ 未對輸入做 HTML 實體轉義，導致惡意腳本執行竊取 Cookie (XSS)。',
        '🔑 登入與重設密碼 API ➔ 缺乏 Rate Limit 頻率限制，駭客秒送千次請求暴力破解 (A07)。',
        '🔒 資料庫密碼儲存 ➔ 誤用極速無鹽的 MD5，一旦被拖庫，彩虹表在毫秒內秒破全站明文 (A02)。'
      ],
      icon: Database
    },
    {
      badge: '核心系統特色 | Slide 03/05',
      title: '五大動態攻防沙盒 (Live Interactive Sandboxes)',
      subtitle: '零安裝、免配置、純前端隔離安全虛擬引擎',
      points: [
        '🎮 SQL 注入沙盒：即時語意樹高亮，對比「字串拼接」vs「預編譯參數化查詢 (Prepared Statements)」。',
        '🕵️ IDOR 越權沙盒：扮演一般用戶 Bob，竄改 API 參數即可查看 Alice 甚至總經理的機密採購。',
        '🧪 XSS 攻擊沙盒：發表惡意留言，展示受害者 Cookie 如何被虛擬駭客 C2 伺服器監聽截獲。',
        '⚡ 暴力破解沙盒：模擬 Burp Suite Intruder 高速撞庫與 Rate Limit 429 阻斷機制。',
        '🔐 密碼彩虹表沙盒：對比 MD5 秒破與 bcrypt 加鹽慢雜湊的安全抗性差異。'
      ],
      icon: KeyRound
    },
    {
      badge: '深度防禦體系 | Slide 04/05',
      title: '全端架構防禦與 AI 智慧審計',
      subtitle: '從瀏覽器到資料庫的立體防護鏈',
      points: [
        '🌐 前端層：啟用 HttpOnly Cookie、實施嚴格 CSP (Content Security Policy) 與文字轉義。',
        '⚡ 閘道層：配置 IP/路由維度的 Rate Limiting，導入圖形驗證碼 (CAPTCHA) 與強制 TLS 1.3。',
        '🖥️ 後端層：落實 RBAC 角色授權、強制 Session 資源歸屬比對、關閉 Debug 錯誤回顯。',
        '🤖 TAICA-AI Copilot：內建 AI 代碼審計功能，開發者貼上程式碼即時獲取漏洞定點標記與修復建議。'
      ],
      icon: Bot
    },
    {
      badge: '專題成效總結 | Slide 05/05',
      title: '專題亮點效益與未來展望',
      subtitle: '打造人人都能輕鬆上手的資安教育平台',
      points: [
        '🏆 實戰測驗模組：內建 5 題情境測驗題庫，即時回饋與評分，適合課堂現場互動評測。',
        '📋 開發檢核清單：提供 10 項上線前必備防禦檢查，輔助學生專題建立安全基線。',
        '🚀 技術架構：React 19 + Tailwind CSS + Vite，輕量極速，具備高度擴充性。',
        '🎉 謝謝評審與老師！歡迎提出任何指教與問題 (Q&A)！'
      ],
      icon: CheckCircle
    }
  ];

  if (!isOpen) return null;

  const current = slides[currentSlide];
  const Icon = current.icon;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col justify-between p-6 sm:p-12 animate-fadeIn font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400">{current.badge}</span>
            <h4 className="text-sm font-bold text-white">課業專題發表模式 (Slide Show)</h4>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <X className="w-4 h-4" />
          退出簡報
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="max-w-4xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 my-auto">
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
            <Icon className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            {current.title}
          </h2>
          <p className="text-sm sm:text-base text-cyan-300 font-medium">
            {current.subtitle}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          {current.points.map((pt, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
              <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {pt}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
        <div className="text-slate-400 font-mono">
          簡報頁數：<span className="text-cyan-400 font-bold">{currentSlide + 1}</span> / {slides.length}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-medium transition-all flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            上一頁
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-medium transition-all flex items-center gap-1 shadow-lg shadow-cyan-950"
          >
            下一頁
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
