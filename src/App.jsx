import React, { useState } from 'react';
import Header from './components/Header';
import VulnerabilityCard from './components/VulnerabilityCard';
import VulnerabilityDetailView from './components/VulnerabilityDetailView';
import ArchitectureMap from './components/ArchitectureMap';
import OwaspOverviewTable from './components/OwaspOverviewTable';
import QuizSection from './components/QuizSection';
import DefenseChecklist from './components/DefenseChecklist';
import AiCopilotDrawer from './components/AiCopilotDrawer';
import PresentationMode from './components/PresentationMode';
import { OWASP_VULNERABILITIES } from './data/vulnerabilities';
import { Shield, Sparkles, Terminal, Flame, Presentation, Bot } from 'lucide-react';

export default function App() {
  const [selectedVulnId, setSelectedVulnId] = useState('injection-sqli');
  const [currentSection, setCurrentSection] = useState('labs');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  const selectedVuln = OWASP_VULNERABILITIES.find((v) => v.id === selectedVulnId) || OWASP_VULNERABILITIES[0];

  const handleSelectVuln = (id) => {
    setSelectedVulnId(id);
    setCurrentSection('labs');
    const el = document.getElementById('labs-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectVulnByCode = (code) => {
    const match = OWASP_VULNERABILITIES.find((v) => v.owaspCode === code);
    if (match) {
      handleSelectVuln(match.id);
    }
  };

  const handleNavigate = (sectionId) => {
    setCurrentSection(sectionId);
    const el = document.getElementById(`${sectionId}-section`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Header
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-slate-900 bg-gradient-to-b from-cyan-950/20 via-slate-950 to-slate-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>課業小專題成果展示 | Web 安全互動攻防實境室</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            深入 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">OWASP Top 10</span> 攻擊原理
            <br />
            <span className="text-2xl sm:text-4xl text-slate-300 font-bold">與真實開發踩雷場景</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            告別抽象的死背名詞！透過親手動態注入、參數越權竄改、XSS Cookie 竊聽與彩虹表反查，直觀理解 Web 漏洞在何時何處發生，以及工程師如何撰寫安全的防禦程式碼。
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleSelectVuln('injection-sqli')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs sm:text-sm transition-all shadow-lg shadow-cyan-950/50 flex items-center gap-2 active:scale-95"
            >
              <Terminal className="w-4 h-4" />
              SQL 注入沙盒
            </button>
            <button
              onClick={() => handleSelectVuln('broken-access-control-idor')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 font-medium text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              IDOR 越權存取
            </button>
            <button
              onClick={() => handleNavigate('quiz')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 font-medium text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              實戰情境自我測驗
            </button>
            <button
              onClick={() => setIsPresentationOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/90 border border-purple-500/50 text-purple-200 font-medium text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <Presentation className="w-4 h-4 text-purple-400" />
              專題簡報模式
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 flex-1">
        {/* Section 1: Core Labs & Sandboxes */}
        <section id="labs-section" className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  精選 OWASP 核心攻防實驗室 (Live Interactive Labs)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                點選下方卡片切換不同漏洞，即可直接操作沙盒與查看場景剖析
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              5 大代表性攻防組件
            </span>
          </div>

          {/* Grid of Vulnerability Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {OWASP_VULNERABILITIES.map((vuln) => (
              <VulnerabilityCard
                key={vuln.id}
                vuln={vuln}
                isSelected={selectedVulnId === vuln.id}
                onSelect={(id) => setSelectedVulnId(id)}
              />
            ))}
          </div>

          {/* Active Detail & Sandbox View */}
          <div className="mt-8">
            <VulnerabilityDetailView
              vuln={selectedVuln}
              onBack={() => {}}
            />
          </div>
        </section>

        {/* Section 2: Real-World Architecture Attack Map */}
        <section id="arch-section">
          <ArchitectureMap onSelectVuln={handleSelectVuln} />
        </section>

        {/* Section 3: OWASP Top 10 Full Overview */}
        <section id="overview-section">
          <OwaspOverviewTable onSelectVulnByCode={handleSelectVulnByCode} />
        </section>

        {/* Section 4: Gamified Scenario Quiz */}
        <section id="quiz-section">
          <QuizSection />
        </section>

        {/* Section 5: Developer Security Checklist */}
        <section id="checklist-section">
          <DefenseChecklist />
        </section>
      </main>

      {/* Floating AI Copilot Button */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl shadow-2xl shadow-cyan-900/60 flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 border border-cyan-400/40"
      >
        <Bot className="w-5 h-5 animate-bounce" />
        <span>AI 資安審計顧問</span>
      </button>

      {/* AI Copilot Drawer */}
      <AiCopilotDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Presentation Mode Modal */}
      <PresentationMode isOpen={isPresentationOpen} onClose={() => setIsPresentationOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-16 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 font-mono text-slate-400">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>TAICA-AI 課業小專題 | 資訊安全 Web 攻防實境與場景解析</span>
        </div>
        <p>
          本網站所有攻防實驗皆於前端安全虛擬沙盒 (Mock Engine) 運行，僅供資安教育與學術研究用途。
        </p>
      </footer>
    </div>
  );
}
