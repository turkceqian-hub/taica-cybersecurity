import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';

export default function QuizSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState([]);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = currentQ.options[idx].isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedIdx: idx,
        isCorrect: isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (score + (currentQ.options[selectedOption]?.isCorrect ? 0 : 0) >= 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setHistory([]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">OWASP Top 10 實戰場景自我測驗</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              檢驗你對 Web 漏洞常見場景與攻防原理的理解程度
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
          <span>進度：</span>
          <span className="font-mono text-cyan-400 font-bold">
            {isFinished ? QUIZ_QUESTIONS.length : currentQuestionIndex + 1}
          </span>
          <span>/ {QUIZ_QUESTIONS.length} 題</span>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Question Category & Scenario Box */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/40 rounded-md text-xs font-semibold text-cyan-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {currentQ.category}
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{currentQ.scenario}</span>
            </div>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';

              if (isAnswered) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                } else if (isSelected && !option.isCorrect) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-mono text-xs sm:text-sm">{option.text}</span>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0">
                      {option.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isSelected && !option.isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
              <div className="text-xs sm:text-sm font-medium text-slate-200">
                {currentQ.options[selectedOption].feedback}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
                >
                  <span>{currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? '下一題' : '查看測驗成績'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Result Screen */
        <div className="text-center py-8 space-y-6">
          <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2">
            <Award className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">測驗完成！</h3>
            <p className="text-sm text-slate-400">
              你的資安小專題實戰測驗得分：
            </p>
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-mono py-2">
              {score} / {QUIZ_QUESTIONS.length} 題 ({Math.round((score / QUIZ_QUESTIONS.length) * 100)} 分)
            </div>
          </div>

          <div className="max-w-md mx-auto text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
            {score === QUIZ_QUESTIONS.length && '🎉 完美的資安感知力！你對 OWASP Top 10 與真實攻擊場景掌握得非常透徹！'}
            {score >= 3 && score < QUIZ_QUESTIONS.length && '👍 表現優異！你已經具備很強的 Web 安全防護基礎，足以應對大部分課業專題問題。'}
            {score < 3 && '💪 還有進步空間，建議多在上方動態沙盒中觀察「攻擊前與修復後」的差異喔！'}
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-all inline-flex items-center gap-2 border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              重新挑戰測驗
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

