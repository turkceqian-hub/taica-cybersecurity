import React, { useState } from 'react';
import { Lock, ShieldCheck, ShieldAlert, Sparkles, Search, Database, Clock, Key } from 'lucide-react';

export default function CryptoFailureSandbox() {
  const [password, setPassword] = useState('password');
  const [algorithm, setAlgorithm] = useState('md5');
  const [lookupResult, setLookupResult] = useState(null);

  // Common rainbow table database
  const rainbowTable = {
    '123456': { md5: 'e10adc3949ba59abbe56e057f20f883e', crackedTime: '0.0001 秒' },
    'password': { md5: '5f4dcc3b5aa765d61d8327deb882cf99', crackedTime: '0.0002 秒' },
    'admin888': { md5: '7f138a09169b250e9dcb378140907378', crackedTime: '0.0003 秒' },
    'qwerty': { md5: 'd8578edf8458ce06fbc5bb76a58c5ca4', crackedTime: '0.0001 秒' }
  };

  const getHash = () => {
    if (algorithm === 'md5') {
      const known = rainbowTable[password];
      if (known) return known.md5;
      // Pseudo MD5 generator for arbitrary input demo
      return 'c33367701511b4f6020ec61ded352059';
    } else {
      // bcrypt format: $2b$[cost]$[22 char salt][31 char hash]
      const randomSalt = Math.random().toString(36).substring(2, 10);
      return `$2b$12$${randomSalt}XyZ99aBcD1eFgH2iJ3kLm4nOpQrStUvWxYz0`;
    }
  };

  const handleRainbowLookup = () => {
    if (algorithm === 'md5') {
      const found = rainbowTable[password];
      if (found) {
        setLookupResult({
          status: 'cracked',
          plaintext: password,
          time: found.crackedTime,
          message: `💥 彩虹表瞬間命中！明文密碼是「${password}」。`
        });
      } else {
        setLookupResult({
          status: 'cracked',
          plaintext: password,
          time: '0.004 秒',
          message: `💥 離線字典反查成功！明文密碼是「${password}」。`
        });
      }
    } else {
      setLookupResult({
        status: 'secure',
        message: '🛡️ 彩虹表查表失敗！bcrypt 具有隨機 Salt 且計算成本高，無法使用預先計算的彩虹表反查。暴力破解單一密碼需耗費數百年！'
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">密碼雜湊與彩虹表攻防沙盒 (Crypto Lab)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            比較「弱雜湊 (MD5 無鹽)」與「現代自帶動態鹽慢雜湊 (bcrypt)」在資料庫遭竊時的安全抗性差異。
          </p>
        </div>

        {/* Algorithm Switch */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-400">演算法：</span>
          <button
            onClick={() => {
              setAlgorithm('md5');
              setLookupResult(null);
            }}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              algorithm === 'md5'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            MD5 (無鹽 / 易破解)
          </button>
          <button
            onClick={() => {
              setAlgorithm('bcrypt');
              setLookupResult(null);
            }}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              algorithm === 'bcrypt'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            bcrypt (加鹽 / 慢速防禦)
          </button>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">常用密碼預設測試：</span>
        <div className="flex flex-wrap gap-2">
          {['password', '123456', 'admin888', 'qwerty'].map((p) => (
            <button
              key={p}
              onClick={() => {
                setPassword(p);
                setLookupResult(null);
              }}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs font-mono text-cyan-300 transition-colors flex items-center gap-1"
            >
              <Key className="w-3 h-3 text-cyan-400" />
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-medium text-slate-300">原始使用者輸入密碼 (Plaintext)</label>
          <input
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLookupResult(null);
            }}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <button
            onClick={handleRainbowLookup}
            className="w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            模擬彩虹表查詢反解
          </button>
        </div>
      </div>

      {/* Hash Visualizer */}
      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            資料庫儲存的雜湊欄位 (Stored Hash Value)：
          </span>
          <span className="text-[11px] text-slate-400">
            {algorithm === 'md5' ? '⚠️ MD5 (32 字元，固定且單向快速)' : '🛡️ bcrypt (含 128-bit 隨機 Salt 與 Work Factor)'}
          </span>
        </div>

        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-emerald-400 break-all text-sm font-bold">
          {getHash()}
        </div>

        {algorithm === 'bcrypt' && (
          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>架構解析：<code className="text-cyan-300">$2b$12$</code> (版本與難度) + <code className="text-yellow-300">隨機鹽 (Salt)</code> + <code className="text-emerald-300">加密雜湊</code></span>
          </div>
        )}
      </div>

      {/* Lookup Result Box */}
      {lookupResult && (
        <div className={`p-4 rounded-xl border transition-all ${
          lookupResult.status === 'cracked'
            ? 'bg-rose-950/40 border-rose-600/70 text-rose-200'
            : 'bg-emerald-950/40 border-emerald-600/70 text-emerald-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              {lookupResult.status === 'cracked' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              )}
              <span>{lookupResult.message}</span>
            </div>
            {lookupResult.time && (
              <span className="flex items-center gap-1 text-xs text-amber-300 font-mono bg-black/40 px-2.5 py-1 rounded">
                <Clock className="w-3 h-3" /> 破解耗時：{lookupResult.time}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

