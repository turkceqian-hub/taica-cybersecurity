import React, { useState } from 'react';
import { Database, ShieldCheck, ShieldAlert, Sparkles, Terminal, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SqlInjectionSandbox() {
  const [username, setUsername] = useState("' OR 1=1 --");
  const [password, setPassword] = useState("");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [lastExecuted, setLastExecuted] = useState(null);

  // Quick payload presets
  const presets = [
    { label: "經典恆真繞過", payload: "' OR 1=1 --", desc: "使 WHERE 條件恆真，無須密碼" },
    { label: "指定管理員登入", payload: "admin' --", desc: "直接鎖定 admin 帳號並註解密碼" },
    { label: "正常用戶登入", payload: "alice", desc: "正常合法的帳號輸入" }
  ];

  const handleExecute = (e) => {
    e?.preventDefault();

    if (isSecureMode) {
      // Prepared Statement behavior
      if (username === 'alice' && password === '123456') {
        setLastExecuted({
          status: 'success',
          msg: '登入成功 (合法用戶 Alice)',
          user: { id: 2, username: 'alice', role: 'member', email: 'alice@company.com' },
          rawSql: 'SELECT * FROM users WHERE username = ? AND password = ?',
          params: [username, '******'],
          dbLog: 'Query executed with parameters safely bound. Zero SQL syntax manipulation.'
        });
      } else {
        setLastExecuted({
          status: 'blocked',
          msg: '登入失敗：查無此帳號或密碼錯誤 (防禦成功！)',
          user: null,
          rawSql: 'SELECT * FROM users WHERE username = ? AND password = ?',
          params: [username, password ? '******' : ''],
          dbLog: `資料庫安全地將 "${username}" 視為純文字比對，未觸發任何語意竄改。`
        });
      }
    } else {
      // Vulnerable string concatenation behavior
      const isSqlInjection = username.includes("'") || username.includes("--") || username.toUpperCase().includes("OR");
      
      if (isSqlInjection) {
        setLastExecuted({
          status: 'hacked',
          msg: '💥 攻擊成功！身分驗證被直接繞過，管理員身分被劫持！',
          user: { id: 1, username: 'administrator', role: 'superadmin', api_token: 'sec_tok_9918a7b3c2' },
          rawSql: `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`,
          dbLog: '⚠️ 資料庫警告：WHERE 條件已恆為 TRUE，系統直接返回第一筆紀錄 (SuperAdmin)！'
        });
      } else if (username === 'alice' && password === '123456') {
        setLastExecuted({
          status: 'success',
          msg: '登入成功 (合法用戶 Alice)',
          user: { id: 2, username: 'alice', role: 'member', email: 'alice@company.com' },
          rawSql: `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`,
          dbLog: '正常查詢執行完畢。'
        });
      } else {
        setLastExecuted({
          status: 'failed',
          msg: '登入失敗：帳號或密碼不正確',
          user: null,
          rawSql: `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`,
          dbLog: '0 筆紀錄返回。'
        });
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">SQL 注入動態模擬沙盒 (Live Playground)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            嘗試在登入欄位輸入惡意語法，觀察後端 SQL 語句如何被竄改，或切換防禦模式檢驗修復效果。
          </p>
        </div>

        {/* Defense Switch */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-xs font-medium text-slate-300">防禦機制：</span>
          <button
            onClick={() => {
              setIsSecureMode(!isSecureMode);
              setLastExecuted(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              isSecureMode 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
            }`}
          >
            {isSecureMode ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                已開啟 (參數化查詢)
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                未防禦 (字串拼接)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">快速測試常用 Payload：</span>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUsername(preset.payload);
                if (preset.payload === 'alice') setPassword('123456');
                else setPassword('');
              }}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-lg text-xs text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="font-mono text-cyan-300">{preset.payload}</span>
              <span className="text-slate-400">({preset.label})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mock Login Form */}
      <form onSubmit={handleExecute} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <div className="md:col-span-5 space-y-1">
          <label className="text-xs font-medium text-slate-300">帳號 (Username / Input)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="請輸入帳號或 SQL Payload"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-lg text-sm text-cyan-200 font-mono"
          />
        </div>
        <div className="md:col-span-4 space-y-1">
          <label className="text-xs font-medium text-slate-300">密碼 (Password)</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="(注入攻擊可留空)"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-lg text-sm text-slate-200 font-mono"
          />
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm rounded-lg transition-all shadow-lg shadow-cyan-950/40 active:scale-95 flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            模擬發送請求
          </button>
        </div>
      </form>

      {/* Real-time Query Visualizer */}
      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800/80">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            後端資料庫解析出的 SQL 查詢指令：
          </span>
          <span className="text-[11px] text-slate-400">
            {isSecureMode ? '✨ Prepared Statements 模式' : '⚠️ 易脆弱拼接模式'}
          </span>
        </div>

        {isSecureMode ? (
          <div className="space-y-1">
            <div className="text-slate-300">
              <span className="text-blue-400">SELECT</span> * <span className="text-blue-400">FROM</span> users <span className="text-blue-400">WHERE</span> username = <span className="text-emerald-400 font-bold">?</span> <span className="text-blue-400">AND</span> password = <span className="text-emerald-400 font-bold">?</span>;
            </div>
            <div className="text-slate-400 pt-1 text-[11px]">
              綁定參數 (Parameters): <span className="text-amber-300 font-semibold">['{username}', '{password}']</span>
            </div>
          </div>
        ) : (
          <div className="text-slate-300 leading-relaxed break-all">
            <span className="text-blue-400">SELECT</span> * <span className="text-blue-400">FROM</span> users <span className="text-blue-400">WHERE</span> username = '<span className="bg-rose-500/20 text-rose-300 px-1 py-0.5 rounded border border-rose-500/40 font-bold">{username}</span>' <span className="text-blue-400">AND</span> password = '<span className="text-slate-400">{password}</span>';
          </div>
        )}
      </div>

      {/* Execution Result Box */}
      {lastExecuted && (
        <div className={`p-4 rounded-xl border transition-all animate-fadeIn ${
          lastExecuted.status === 'hacked'
            ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
            : lastExecuted.status === 'blocked'
            ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
            : lastExecuted.status === 'success'
            ? 'bg-cyan-950/40 border-cyan-600/60 text-cyan-200'
            : 'bg-slate-800/50 border-slate-700 text-slate-300'
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {lastExecuted.status === 'hacked' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
            {lastExecuted.status === 'blocked' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
            {lastExecuted.status === 'success' && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
            <span>{lastExecuted.msg}</span>
          </div>

          <p className="text-xs mt-2 opacity-90">{lastExecuted.dbLog}</p>

          {lastExecuted.user && (
            <div className="mt-3 bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
              <div className="text-slate-400 text-[11px] font-semibold">外洩的登入者資料庫紀錄：</div>
              <div className="text-cyan-300">
                {JSON.stringify(lastExecuted.user, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

