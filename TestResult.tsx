
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_TESTS, TRANSLATIONS } from '../constants';
import { generateTestReport } from '../services/gemini';
import { Container, GlassCard } from '../components/Layout';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { Send, Download, Share2, Loader2, Zap } from 'lucide-react';

const EnergyScale: React.FC<{ score: number; max: number }> = ({ score, max }) => {
  const percentage = Math.min(Math.max((score / max) * 100, 5), 100);
  
  // Determine color based on levels
  let color = "#ef4444"; // Default Red
  if (percentage > 66) color = "#22c55e"; // Green
  else if (percentage > 33) color = "#eab308"; // Yellow

  return (
    <div className="relative flex flex-col items-center gap-6 py-8">
      <div className="flex gap-12 items-center">
        {/* Vertical Scale */}
        <div className="relative w-12 h-64 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col-reverse shadow-inner">
          <div 
            className="w-full transition-all duration-1000 ease-out relative"
            style={{ 
              height: `${percentage}%`, 
              background: `linear-gradient(to top, #ef4444 0%, #eab308 50%, #22c55e 100%)`,
              backgroundColor: color, // Fallback
              backgroundSize: '100% 200%',
              backgroundPosition: `0 ${100 - percentage}%`
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 blur-[1px]"></div>
          </div>
          {/* Scale Markers */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-white/10 mx-auto" />
            ))}
          </div>
        </div>

        {/* Meditation Silhouette */}
        <div className="relative">
          <svg 
            viewBox="0 0 100 100" 
            className="w-48 h-48 transition-colors duration-1000"
            fill={color}
            style={{ filter: `drop-shadow(0 0 15px ${color}44)` }}
          >
            <path d="M50 15c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm12 18H38c-2.2 0-4 1.8-4 4v10c0 1.1.9 2 2 2h4v12l-8 12c-.6.9-.4 2.1.5 2.7.9.6 2.1.4 2.7-.5l7.5-11.2h14.6l7.5 11.2c.4.6 1 1 1.7 1 .3 0 .7-.1 1-.3.9-.6 1.1-1.8.5-2.7L58 51V39h4c1.1 0 2-.9 2-2 0-2.2-1.8-4-4-4zM50 85c-11 0-20-4.5-20-10 0-4.1 5.1-7.7 12.5-9.2l.5-.1.5.8c1.3 2.1 3.6 3.5 6.5 3.5s5.2-1.4 6.5-3.5l.5-.8.5.1C64.9 67.3 70 70.9 70 75c0 5.5-9 10-20 10z" />
          </svg>
          <div 
            className="absolute inset-0 bg-current blur-3xl opacity-10 animate-pulse rounded-full"
            style={{ backgroundColor: color }}
          ></div>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black font-manrope tracking-tighter" style={{ color }}>
          {percentage.toFixed(0)}%
        </span>
        <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Energy Potential</span>
      </div>
    </div>
  );
};

export const TestResult: React.FC = () => {
  const { testId, score } = useParams();
  const { lang } = useApp();
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const test = MOCK_TESTS.find(t => t.id === testId);
  const numericScore = Number(score);
  const maxScore = test?.questions.reduce((acc, q) => acc + Math.max(...q.options.map(o => o.weight)), 0) || 10;

  useEffect(() => {
    if (test) {
      generateTestReport(test.title[lang], numericScore, maxScore, lang).then(res => {
        setReport(res);
        setLoading(false);
      });
    }
  }, [testId, lang]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={48} />
      <p className="text-white/60 animate-pulse">Our AI is analyzing your performance...</p>
    </div>
  );

  const chartData = [
    { name: 'Score', value: numericScore },
    { name: 'Remaining', value: maxScore - numericScore },
  ];

  return (
    <div className="pt-32 pb-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-4xl font-bold">{report.title}</h1>
            
            {/* Special Energy Visual if test type is energy */}
            {test?.type === 'energy' && (
              <GlassCard className="flex flex-col items-center bg-gradient-to-b from-white/5 to-transparent border-indigo-500/20">
                <EnergyScale score={numericScore} max={maxScore} />
              </GlassCard>
            )}

            <GlassCard>
              <p className="text-xl leading-relaxed text-white/90 mb-6">{report.summary}</p>
              <div className="space-y-4">
                {report.details.map((detail: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                    <p className="text-white/60">{detail}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <h3 className="text-2xl font-bold">{lang === 'RU' ? 'Рекомендации' : (lang === 'ES' ? 'Recomendaciones' : (lang === 'HI' ? 'सिफारिशें' : 'Recommendations'))}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.recommendations.map((rec: string, i: number) => (
                <GlassCard key={i} className="bg-white/5 border-none">
                  <p className="text-sm font-medium">{rec}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <GlassCard className="text-center">
              {test?.type !== 'energy' && (
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        <Cell fill="#6366f1" />
                        <Cell fill="rgba(255,255,255,0.05)" />
                        <Label 
                          value={`${Math.round((numericScore/maxScore)*100)}%`} 
                          position="center" 
                          fill="white" 
                          style={{ fontSize: '24px', fontWeight: 'bold' }} 
                        />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              {test?.type === 'energy' && (
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Zap size={32} />
                  </div>
                </div>
              )}
              <p className="text-sm text-white/50 mb-6">{lang === 'RU' ? 'Общий балл' : 'Total Score'}: {numericScore} / {maxScore}</p>
              <div className="flex flex-col gap-3">
                <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                  <Download size={18} />
                  {lang === 'RU' ? 'Скачать PDF' : (lang === 'ES' ? 'Descargar PDF' : (lang === 'HI' ? 'पीडीएफ डाउनलोड' : 'Download PDF'))}
                </button>
                <button className="w-full glass py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  {lang === 'RU' ? 'Поделиться' : (lang === 'ES' ? 'Compartir' : (lang === 'HI' ? 'साझा करें' : 'Share'))}
                </button>
              </div>
            </GlassCard>

            {/* TG Invite */}
            <GlassCard className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
              <h4 className="text-xl font-bold mb-4">{t.joinChannel}</h4>
              <p className="text-sm text-white/70 mb-6">
                {lang === 'RU' ? 'Вы получили бесплатный доступ к нашему закрытому Telegram-каналу. Присоединяйтесь сейчас!' : 'You have gained free access to our private Telegram channel. Join now!'}
              </p>
              <a 
                href="https://t.me/example_channel" 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center bg-[#24A1DE] hover:bg-[#208aba] py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#24A1DE]/20"
              >
                <Send size={20} />
                Open Telegram
              </a>
            </GlassCard>
          </div>
        </div>
      </Container>
    </div>
  );
};
