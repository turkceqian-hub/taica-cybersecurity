import React, { useState } from 'react';
import { KeyRound, ShieldCheck, ShieldAlert, Send, User, Lock, AlertTriangle, FileText } from 'lucide-react';

export default function IdorSandbox() {
  const [orderId, setOrderId] = useState('1002');
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [response, setResponse] = useState(null);

  // Mock Database of Orders
  const ordersDatabase = {
    '1000': {
      id: 1000,
      userId: 1,
      owner: 'Charlie (總經理 - Admin)',
      product: '極致商務伺服器節點 x 10',
      totalAmount: '$480,000 NTD',
      shippingAddress: '台北市信義區機密研發大樓 18F',
      phone: '0912-***-999',
      creditCard: '****-****-****-8819 (MasterCard VIP)'
    },
    '1001': {
      id: 1001,
      userId: 2,
      owner: 'Alice (普通會員)',
      product: '隱私醫療保健用品組合',
      totalAmount: '$3,200 NTD',
      shippingAddress: '新北市板橋區文化路二段 120 號 5 樓',
      phone: '0988-***-123',
      creditCard: '****-****-****-3341 (VISA)'
    },
    '1002': {
      id: 1002,
      userId: 3,
      owner: 'Bob (目前登入的使用者 - 你)',
      product: '機械式電競鍵盤 (青軸)',
      totalAmount: '$2,490 NTD',
      shippingAddress: '台中市西區台灣大道 45 號',
      phone: '0977-***-456',
      creditCard: '****-****-****-6672 (VISA)'
    }
  };

  const currentLoggedInUser = {
    id: 3,
    name: 'Bob',
    role: 'Regular User',
    token: 'jwt_sess_bob_982341'
  };

  const handleFetchOrder = () => {
    const targetOrder = ordersDatabase[orderId];

    if (!targetOrder) {
      setResponse({
        status: 404,
        statusText: 'Not Found',
        data: { error: '查無此訂單編號' },
        explanation: '資料庫中不存在此 ID 的紀錄。'
      });
      return;
    }

    if (isSecureMode) {
      // Secure mode: Check if logged in user is the owner
      if (targetOrder.userId === currentLoggedInUser.id) {
        setResponse({
          status: 200,
          statusText: 'OK',
          data: targetOrder,
          explanation: '✅ 驗證成功：此訂單確實屬於當前登入者 Bob。'
        });
      } else {
        setResponse({
          status: 403,
          statusText: 'Forbidden (存取被拒絕)',
          data: {
            error: '權限不足：您無權存取其他使用者的私人訂單紀錄！',
            code: 'AUTH_OWNERSHIP_MISMATCH'
          },
          explanation: '🛡️ 防禦成功！後端校驗了 Token.userId !== Order.userId，阻斷了越權竊取。'
        });
      }
    } else {
      // Vulnerable mode: Blindly returns whatever orderId is requested
      const isBreached = targetOrder.userId !== currentLoggedInUser.id;
      setResponse({
        status: 200,
        statusText: '200 OK (⚠️ 嚴重資料洩漏)',
        data: targetOrder,
        isBreached: isBreached,
        explanation: isBreached
          ? `💥 橫向越權攻擊成功！你是 Bob，但後端未檢查歸屬權，直接將 ${targetOrder.owner} 的私人電話、地址與交易明細全部洩漏！`
          : '正常查詢自己的訂單。'
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">IDOR 越權存取動態模擬沙盒</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            你目前是普通使用者 <span className="text-amber-300 font-semibold">Bob (ID: 3)</span>。嘗試修改請求網址中的訂單 ID，檢視能否越權竊取他人個資。
          </p>
        </div>

        {/* Defense Switch */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-xs font-medium text-slate-300">後端權限校驗：</span>
          <button
            onClick={() => {
              setIsSecureMode(!isSecureMode);
              setResponse(null);
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
                已啟用 (資源歸屬權檢查)
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                未驗證 (僅查直接 ID)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current User Session Bar */}
      <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">當前登入者身分 (Session Token)：</span>
          <span className="text-white font-semibold">Bob (UserId: 3)</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-400">一般消費者</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-slate-400 font-mono text-[11px]">
          <Lock className="w-3 h-3 text-emerald-400" />
          Bearer jwt_sess_bob_982341
        </div>
      </div>

      {/* Quick Target Selector */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">點選情境快速測試：</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => setOrderId('1002')}
            className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
              orderId === '1002'
                ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="font-semibold">📦 查詢自己訂單 (ID: 1002)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">正常合法的業務行為</div>
          </button>

          <button
            onClick={() => setOrderId('1001')}
            className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
              orderId === '1001'
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="font-semibold text-rose-300">🕵️ 橫向越權竊取 Alice (ID: 1001)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">嘗試偷看平級客戶隱私商品與住址</div>
          </button>

          <button
            onClick={() => setOrderId('1000')}
            className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
              orderId === '1000'
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="font-semibold text-amber-300">👑 縱向越權偷看 Charlie 總經理 (ID: 1000)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">窺視企業高層機密採購明細</div>
          </button>
        </div>
      </div>

      {/* Mock HTTP URL Bar */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          HTTP 請求發送器 (可手動修改 URL 參數)
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="w-full flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden font-mono text-xs">
            <span className="bg-blue-600/20 text-blue-400 px-3 py-2 font-bold border-r border-slate-700">GET</span>
            <span className="px-3 py-2 text-slate-400">https://api.shop.test/v1/orders?order_id=</span>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="bg-transparent text-amber-300 font-bold px-2 py-2 focus:outline-none w-24 border-b border-cyan-500"
            />
          </div>
          <button
            onClick={handleFetchOrder}
            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            發送 API 請求
          </button>
        </div>
      </div>

      {/* Response Box */}
      {response && (
        <div className={`p-4 rounded-xl border font-mono text-xs space-y-3 transition-all ${
          response.isBreached
            ? 'bg-rose-950/40 border-rose-600/60'
            : response.status === 403
            ? 'bg-emerald-950/40 border-emerald-600/60'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                response.status === 200 ? (response.isBreached ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white') : 'bg-rose-800 text-rose-200'
              }`}>
                HTTP {response.status}
              </span>
              <span className="text-slate-300 font-semibold">{response.statusText}</span>
            </div>
            {response.isBreached && (
              <span className="flex items-center gap-1 text-rose-400 font-bold text-xs animate-pulse">
                <AlertTriangle className="w-4 h-4" /> 偵測到 IDOR 個資外洩！
              </span>
            )}
          </div>

          <div className="text-slate-300 text-xs font-sans">
            {response.explanation}
          </div>

          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-200 overflow-x-auto">
            <pre>{JSON.stringify(response.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

