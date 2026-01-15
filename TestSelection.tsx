
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_TESTS, TRANSLATIONS } from '../constants';
import { Container, GlassCard } from '../components/Layout';
import { Coins, ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TestRunner } from '../components/TestRunner';

export const TestSelection: React.FC = () => {
  const { lang, user, updateTokens, completeTest, completedTests } = useApp();
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const startTest = (id: string, price: number) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.tokens < price) {
      alert("Not enough tokens!");
      return;
    }
    updateTokens(-price);
    setActiveTest(id);
  };

  if (activeTest) {
    const test = MOCK_TESTS.find(t => t.id === activeTest)!;
    return (
      <Container className="pt-24">
        <TestRunner 
          test={test} 
          onComplete={(score) => {
            completeTest(activeTest);
            navigate(`/results/${activeTest}/${score}`);
          }} 
        />
      </Container>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <Container>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">{t.ctaTests}</h1>
          <p className="text-white/50">{lang === 'RU' ? 'Выберите один тест или купите полный набор' : 'Select a single test or buy the full bundle'}</p>
        </div>

        {/* Bundle Card */}
        <GlassCard className="mb-12 border-indigo-500/30 bg-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6 p-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t.allTestsPackage}</h2>
            <p className="text-white/60">Unlock all 5 modules and get early access to our private community.</p>
          </div>
          <button 
            onClick={() => alert("Bundle purchased (simulated)")}
            className="whitespace-nowrap px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold shadow-2xl shadow-indigo-500/50 flex items-center gap-3 transition-all"
          >
            <Coins size={20} />
            {t.buyBundle}
          </button>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TESTS.map(test => {
            const isCompleted = completedTests.includes(test.id);
            return (
              <GlassCard 
                key={test.id} 
                className={`relative flex flex-col h-full ${isCompleted ? 'opacity-80 grayscale-[0.5]' : ''}`}
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                    DONE
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{test.title[lang]}</h3>
                <p className="text-sm text-white/50 mb-8 line-clamp-2">{test.description[lang]}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins size={16} className="text-yellow-400" />
                    <span className="font-bold">{test.priceTokens}</span>
                  </div>
                  <button 
                    onClick={() => startTest(test.id, test.priceTokens)}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {t.startTest}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
