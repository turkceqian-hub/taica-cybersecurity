import React, { useState } from 'react';
import { CheckSquare, ShieldCheck, Download, Sparkles } from 'lucide-react';

export default function DefenseChecklist() {
  const initialChecklist = [
    { id: 1, category: '輸入過濾與查詢安全 (Injection & XSS 防禦)', text: '所有 SQL 查詢強制採用參數化查詢 (Prepared Statements) 或 ORM，絕不以字串拼接 SQL。', checked: true },
    { id: 2, category: '輸入過濾與查詢安全 (Injection & XSS 防禦)', text: '所有使用者提交的內容在渲染到 HTML 前，強制做 HTML Entity 轉義 (Escape) 或使用安全庫過濾。', checked: true },
    { id: 3, category: '權限控制 (IDOR & Access Control 防禦)', text: '任何資料讀取、修改、刪除 API，後端皆必須驗證資源擁有者 (Resource Ownership Check)，不單純依賴前端 ID。', checked: true },
    { id: 4, category: '權限控制 (IDOR & Access Control 防禦)', text: '關鍵管理員路由與後台端點強制實施 RBAC (基於角色的存取控制) 中介軟體。', checked: false },
    { id: 5, category: '身分認證與 Session 安全 (Authentication 防禦)', text: '登入、註冊、密碼找回 API 必須設置 Rate Limiting (如 15 分鐘最多 5 次嘗試) 與驗證碼 (CAPTCHA)。', checked: true },
    { id: 6, category: '身分認證與 Session 安全 (Authentication 防禦)', text: 'Session Cookie 強制加上 HttpOnly、Secure、SameSite=Strict 屬性，避免被 XSS 腳本竊取。', checked: false },
    { id: 7, category: '密碼與加密機制 (Cryptographic Security)', text: '密碼儲存全面採用 Argon2id 或 bcrypt (搭配適當的工作因子與動態鹽)，嚴禁使用 MD5 或 SHA1。', checked: true },
    { id: 8, category: '密碼與加密機制 (Cryptographic Security)', text: '全站強制啟用 HTTPS (TLS 1.3)，敏感連線啟用 HSTS 標頭。', checked: false },
    { id: 9, category: '安全配置與依賴維護 (Misconfiguration & Dependencies)', text: '正式生產環境強制關閉 Debug 模式與詳細 Stack Trace 錯誤回顯。', checked: true },
    { id: 10, category: '安全配置與依賴維護 (Misconfiguration & Dependencies)', text: '定期執行 npm audit 或 Snyk 掃描第三方套件庫中已知的 CVE 漏洞。', checked: false }
  ];

  const [items, setItems] = useState(initialChecklist);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((checkedCount / items.length) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Web 安全開發防禦檢核清單 (Developer Checklist)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              專題評分與實務專案上線前必檢核的 10 大關鍵防護準則
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">完成度：</div>
            <div className="text-xs font-mono font-bold text-emerald-400">{checkedCount} / {items.length} 項 ({progressPercent}%)</div>
          </div>
          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              item.checked
                ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {}}
                className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-slate-900 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                {item.category}
              </span>
              <p className={`text-xs sm:text-sm ${item.checked ? 'text-slate-100 font-medium' : 'text-slate-400'}`}>
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

