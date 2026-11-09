import React from 'react';
import { Shield, Terminal, Award, Layers, CheckSquare, Presentation, Bot } from 'lucide-react';

export default function Header({ currentSection, onNavigate, onOpenAi, onOpenPresentation }) {
  const navItems = [
    { id: 'labs', label: '核心漏洞沙盒', icon: Terminal },
    { id: 'arch', label: '系統架構與場景', icon: Layers },
    { id: 'overview', label: 'OWASP 完整清單', icon: Shield },
    { id: 'quiz', label: '實戰情境測驗', icon: Award },
    { id: 'checklist', label: '安全防禦表', icon: CheckSquare }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('labs')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">WebSec Lab</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800/80 rounded-full">
                課業小專題
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              OWASP Top 10 互動攻防與場景解析
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: Presentation & AI */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPresentation}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 rounded-lg text-xs font-semibold text-purple-300 transition-colors"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>簡報模式</span>
          </button>

          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 rounded-lg text-xs font-semibold text-cyan-300 transition-colors shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI 顧問</span>
          </button>
        </div>
      </div>
    </header>
  );
}
