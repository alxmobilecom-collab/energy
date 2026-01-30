
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { TestDefinition, TestOption } from '../types';
import { GlassCard } from './Layout';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const TestRunner: React.FC<{ test: TestDefinition, onComplete: (score: number) => void }> = ({ test, onComplete }) => {
  const { lang } = useApp();
  const t = TRANSLATIONS[lang];
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, TestOption>>({});

  const currentQuestion = test.questions[currentStep];
  const progress = ((currentStep + 1) / test.questions.length) * 100;

  const handleSelect = (option: TestOption) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const next = () => {
    if (currentStep < test.questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const totalScore = (Object.values(answers) as TestOption[]).reduce((acc, opt) => acc + opt.weight, 0);
      onComplete(totalScore);
    }
  };

  const prev = () => setCurrentStep(prev => Math.max(0, prev - 1));

  return (
    <div className="max-w-2xl mx-auto py-4 md:py-12 px-2 md:px-0">
      <div className="mb-4 md:mb-8">
        <div className="flex justify-between items-end mb-2 md:mb-4">
          <div>
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-indigo-400 font-bold">Question {currentStep + 1} / {test.questions.length}</span>
            <h2 className="text-xl md:text-3xl font-bold mt-0.5">{test.title[lang]}</h2>
          </div>
          <span className="text-xs md:sm font-medium text-white/40">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <GlassCard className="min-h-[300px] md:min-h-[400px] flex flex-col p-4 md:p-8">
        <h3 className="text-lg md:text-xl font-medium mb-6 md:mb-12 text-center leading-tight">{currentQuestion.text[lang]}</h3>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
          {currentQuestion.options.map(option => {
            const isSelected = answers[currentQuestion.id]?.id === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className={`
                  px-4 md:px-8 py-2 md:py-4 rounded-full border text-xs md:text-sm font-semibold oval-jump
                  ${isSelected 
                    ? 'bg-indigo-600 border-indigo-400 selected-oval' 
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                  }
                `}
              >
                {option.text[lang]}
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex justify-between gap-2 md:gap-4">
          <button 
            disabled={currentStep === 0}
            onClick={prev}
            className="flex items-center gap-1 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-white/10 text-white/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all text-xs md:text-sm"
          >
            <ChevronLeft size={16} className="md:w-5 md:h-5" />
            {t.back}
          </button>
          
          <button 
            disabled={!answers[currentQuestion.id]}
            onClick={next}
            className="flex items-center gap-1 md:gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg shadow-indigo-500/20 text-xs md:text-sm"
          >
            {currentStep === test.questions.length - 1 ? t.finish : t.continue}
            {currentStep === test.questions.length - 1 ? <Check size={16} className="md:w-5 md:h-5" /> : <ChevronRight size={16} className="md:w-5 md:h-5" />}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
