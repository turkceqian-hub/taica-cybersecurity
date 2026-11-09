import React, { useState } from 'react';
import { Layers, Globe, Server, Database, ShieldAlert, ChevronRight, Lock } from 'lucide-react';

export default function ArchitectureMap({ onSelectVuln }) {
  const [activeLayer, setActiveLayer] = useState('db');

  const layers = [
    {
      id: 'client',
      title: '1. 用戶端 / 瀏覽器層 (Client & Frontend)',
      icon: Globe,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      bgColor: 'bg-purple-950/20',
      scenarios: '使用者瀏覽網頁、填寫登入表單、發送 Ajax/Fetch 請求、查看訂單。',
      vulns: [
        { id: 'xss-cross-site-scripting', name: 'XSS 跨站腳本攻擊', reason: '前端以 innerHTML 渲染留言，受害者瀏覽器直接執行惡意代碼' },
        { id: 'broken-access-control-idor', name: 'IDOR 參數竄改', reason: '攻擊者在前端 URL 或請求中隨意修改 order_id=1001' }
      ]
    },
    {
      id: 'network',
      title: '2. 網路傳輸與 API 閘道層 (Gateway & Network)',
      icon: Lock,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      bgColor: 'bg-rose-950/20',
      scenarios: 'HTTP 封包轉發、負載平衡、登入路由頻率管控。',
      vulns: [
        { id: 'identification-authentication-failures', name: '暴力破解 & 缺乏速率限制', reason: '未設 Rate Limit，駭客秒送千次請求撞庫' },
        { id: 'cryptographic-failures', name: '傳輸層加密缺失 (No TLS/HTTPS)', reason: '公用 Wi-Fi 中間人直接側錄明文 Token' }
      ]
    },
    {
      id: 'backend',
      title: '3. 後端伺服器與業務邏輯層 (Backend Server)',
      icon: Server,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-950/20',
      scenarios: 'Express/FastAPI 處理認證邏輯、權限檢查、業務狀態流轉。',
      vulns: [
        { id: 'broken-access-control-idor', name: '失效的存取控制 (Broken Access Control)', reason: '只檢查用戶已登入，未校驗資源擁有權 (Ownership)' },
        { id: 'injection-sqli', name: '不可信輸入拼接 (Raw Concatenation)', reason: '直接以字串相加組裝查詢語句' }
      ]
    },
    {
      id: 'db',
      title: '4. 資料庫與持久儲存層 (Database & Storage)',
      icon: Database,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-950/20',
      scenarios: 'MySQL, PostgreSQL, Redis 執行 SQL 查詢與讀寫會員密碼。',
      vulns: [
        { id: 'injection-sqli', name: 'SQL Injection 語意破壞', reason: '資料庫解析器把輸入當作 SQL 控制邏輯執行' },
        { id: 'cryptographic-failures', name: '無鹽弱雜湊 (MD5 密碼儲存)', reason: '彩虹表瞬間反解資料庫所有明文密碼' }
      ]
    }
  ];

  const currentActive = layers.find((l) => l.id === activeLayer);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Web 系統全端架構：漏洞常出現在哪裡？</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            點選架構中的不同層級，快速透視各個環節最常出現的資安盲點與 OWASP 威脅
          </p>
        </div>
      </div>

      {/* Grid: Architecture Stack on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Stack */}
        <div className="lg:col-span-5 space-y-3">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const isSelected = activeLayer === layer.id;

            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${
                  isSelected
                    ? `${layer.bgColor} ${layer.borderColor} shadow-lg ring-1 ring-cyan-500/30`
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${layer.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {layer.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {layer.scenarios}
                    </div>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              當前層級深入分析：
            </span>
            <span className={`text-xs font-bold ${currentActive.color}`}>
              {currentActive.title}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-300">常見開發與業務場景：</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {currentActive.scenarios}
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              此層級最致命的 OWASP 威脅：
            </div>

            <div className="space-y-2">
              {currentActive.vulns.map((v, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-cyan-300">{v.name}</div>
                    <div className="text-[11px] text-slate-400">{v.reason}</div>
                  </div>

                  <button
                    onClick={() => onSelectVuln && onSelectVuln(v.id)}
                    className="self-start sm:self-center px-3 py-1 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded text-[11px] text-cyan-300 font-medium transition-colors shrink-0"
                  >
                    前往動態沙盒 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

