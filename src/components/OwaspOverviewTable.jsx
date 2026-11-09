import React from 'react';
import { Shield, ExternalLink, AlertTriangle } from 'lucide-react';
import { OWASP_OVERVIEW_LIST } from '../data/vulnerabilities';

export default function OwaspOverviewTable({ onSelectVulnByCode }) {
  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">OWASP Top 10 (2021 最新標準) 完整導覽</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            開放式網路應用程式安全專案 (OWASP) 定義的當前全球最普遍、危害最大的十種 Web 安全風險
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">排名與編號</th>
              <th className="py-3 px-4 font-semibold">漏洞類別名稱</th>
              <th className="py-3 px-4 font-semibold">風險等級</th>
              <th className="py-3 px-4 font-semibold">核心概念與影響</th>
              <th className="py-3 px-4 font-semibold text-right">沙盒實測</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {OWASP_OVERVIEW_LIST.map((item, idx) => {
              const hasLab = ['A01:2021', 'A02:2021', 'A03:2021', 'A07:2021'].includes(item.code);

              return (
                <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                    {item.code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getRiskBadge(item.risk)}`}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 max-w-md">
                    {item.desc}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {hasLab ? (
                      <button
                        onClick={() => onSelectVulnByCode(item.code)}
                        className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 rounded text-cyan-300 font-medium transition-colors"
                      >
                        進入體驗 →
                      </button>
                    ) : (
                      <span className="text-slate-600 font-mono text-[11px]">標準規範</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

