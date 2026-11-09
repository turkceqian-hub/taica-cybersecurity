import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Play, RotateCcw, Flame, CheckCircle, AlertOctagon, Terminal } from 'lucide-react';

export default function BruteForceSandbox() {
  const [isRunning, setIsRunning] = useState(false);
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [crackedResult, setCrackedResult] = useState(null);

  const wordlist = [
    '123456',
    'password',
    'admin888',
    'qwerty',
    'iloveyou',
    '111111',
    'welcome1',
    'admin123' // Correct password
  ];

  const handleStartAttack = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setLogs([]);
    setCrackedResult(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setLogs([]);
    setCrackedResult(null);
  };

  useEffect(() => {
    let timer;
    if (isRunning && currentStep < wordlist.length) {
      timer = setTimeout(() => {
        const attemptPassword = wordlist[currentStep];
        const attemptNum = currentStep + 1;

        if (isSecureMode && attemptNum > 3) {
          // Blocked by Rate Limiting!
          setLogs((prev) => [
            {
              id: Date.now(),
              attempt: attemptNum,
              password: attemptPassword,
              status: 429,
              statusText: 'Too Many Requests (IP 已被阻擋)',
              color: 'text-amber-400'
            },
            ...prev
          ]);
          setIsRunning(false);
          setCrackedResult({
            success: false,
            message: '🛡️ 防禦成功！觸發 Rate Limit 速率限制（3 次錯誤），伺服器阻斷連線並鎖定 IP 15 分鐘！'
          });
          return;
        }

        const isCorrect = attemptPassword === 'admin123';

        if (isCorrect) {
          setLogs((prev) => [
            {
              id: Date.now(),
              attempt: attemptNum,
              password: attemptPassword,
              status: 200,
              statusText: '200 OK (密碼猜測成功！)',
              color: 'text-rose-400 font-bold'
            },
            ...prev
          ]);
          setIsRunning(false);
          setCrackedResult({
            success: true,
            password: attemptPassword,
            attempts: attemptNum,
            message: `💥 帳號失守！未設防護的系統在第 ${attemptNum} 次嘗試時被成功破解弱密碼 "${attemptPassword}"！`
          });
        } else {
          setLogs((prev) => [
            {
              id: Date.now(),
              attempt: attemptNum,
              password: attemptPassword,
              status: 401,
              statusText: '401 Unauthorized (密碼錯誤)',
              color: 'text-slate-400'
            },
            ...prev
          ]);
          setCurrentStep((prev) => prev + 1);
        }
      }, 400); // 400ms per attempt for clear visual pacing
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep, isSecureMode]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-white">暴力破解與速率限制 (Brute Force & Rate Limit)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            目標帳號：<span className="text-cyan-300 font-mono">admin@company.com</span>。模擬自動化攻擊腳本發送字典檔密碼測試。
          </p>
        </div>

        {/* Defense Switch */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-xs font-medium text-slate-300">Rate Limit 頻率限制：</span>
          <button
            onClick={() => {
              setIsSecureMode(!isSecureMode);
              handleReset();
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
                已開啟 (最多 3 次失敗封鎖)
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                未開啟 (允許無限次嘗試)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleStartAttack}
          disabled={isRunning}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-rose-950/40 active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          {isRunning ? '攻擊進行中 (自動化重試)...' : '啟動暴力破解 (Burp Intruder 模擬)'}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重設狀態
        </button>
      </div>

      {/* Result Display */}
      {crackedResult && (
        <div className={`p-4 rounded-xl border transition-all ${
          crackedResult.success
            ? 'bg-rose-950/40 border-rose-600/70 text-rose-200'
            : 'bg-emerald-950/40 border-emerald-600/70 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {crackedResult.success ? (
              <AlertOctagon className="w-5 h-5 text-rose-400" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            )}
            <span>{crackedResult.message}</span>
          </div>
          {crackedResult.success && (
            <div className="mt-2 text-xs font-mono text-slate-300">
              破解密碼：<span className="text-yellow-400 font-bold bg-black/50 px-2 py-0.5 rounded">{crackedResult.password}</span> | 嘗試次數：{crackedResult.attempts} 次
            </div>
          )}
        </div>
      )}

      {/* Terminal / Request Log Stream */}
      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            HTTP 登入請求即時監聽日誌 (Request Traffic)
          </span>
          <span className="text-[11px] text-slate-400">
            字典檔總量：{wordlist.length} 組常見弱密碼
          </span>
        </div>

        <div className="h-44 overflow-y-auto space-y-1.5 pr-2">
          {logs.length === 0 ? (
            <div className="text-slate-600 text-center py-10 font-sans text-xs">
              點擊「啟動暴力破解」按鈕開始模擬高頻撞庫請求...
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-1 px-2 rounded bg-slate-900/60 border border-slate-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">#{log.attempt}</span>
                  <span className="text-cyan-400">POST /api/v1/auth/login</span>
                  <span className="text-slate-400">pass="{log.password}"</span>
                </div>
                <div className={`font-semibold ${log.color}`}>
                  HTTP {log.status} - {log.statusText}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

