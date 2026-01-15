
import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS, MOCK_TESTS } from '../constants';
import { Container, GlassCard } from '../components/Layout';
import { User, Activity, Coins, Shield, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, lang, completedTests } = useApp();
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();

  if (!user) return null;

  const finishedTests = MOCK_TESTS.filter(test => completedTests.includes(test.id));

  return (
    <div className="pt-32 pb-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="text-center p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                <User size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-1">{user.email.split('@')[0]}</h2>
              <div className="flex items-center justify-center gap-2 text-white/40 text-sm mb-6">
                <Shield size={14} />
                <span className="uppercase tracking-widest font-bold">{user.role}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-black text-indigo-400">{user.tokens}</p>
                  <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">{t.balance}</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <p className="text-2xl font-black text-green-400">{completedTests.length}</p>
                  <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">{lang === 'RU' ? 'Тестов' : 'Tests'}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-indigo-400">{lang === 'RU' ? 'Детали аккаунта' : 'Account Details'}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Calendar size={16} />
                  <span>{lang === 'RU' ? 'В сети с Окт 2023' : 'Member since Oct 2023'}</span>
                </div>
              </div>
            </GlassCard>
            
            <button 
              onClick={() => navigate('/tokens')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3"
            >
              <Coins size={20} className="text-yellow-400" />
              {t.buyTokens}
            </button>
          </div>

          {/* Activity Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-indigo-400" />
              <h2 className="text-3xl font-bold">{t.accountStats}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="bg-gradient-to-br from-indigo-500/10 to-transparent">
                <h4 className="font-bold mb-4">{t.recentResults}</h4>
                {finishedTests.length === 0 ? (
                  <p className="text-white/30 text-sm italic">{t.noResults}</p>
                ) : (
                  <div className="space-y-3">
                    {finishedTests.map(test => (
                      <div key={test.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-sm font-medium">{test.title[lang]}</span>
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>

              <GlassCard>
                <h4 className="font-bold mb-4">{t.transactionHistory}</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Initial Grant</span>
                    <span className="text-green-400 font-bold">+1000</span>
                  </div>
                  {finishedTests.map(test => (
                    <div key={test.id} className="flex justify-between items-center text-sm">
                      <span className="text-white/60">{test.title[lang]}</span>
                      <span className="text-red-400 font-bold">-{test.priceTokens}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
            
            <GlassCard className="p-8">
               <h4 className="font-bold mb-6">{lang === 'RU' ? 'Ваш прогресс' : 'Your Progress'}</h4>
               <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                  <div 
                    className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-1000"
                    style={{ width: `${(completedTests.length / MOCK_TESTS.length) * 100}%` }}
                  ></div>
               </div>
               <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/30">
                  <span>0%</span>
                  <span>{completedTests.length} / {MOCK_TESTS.length} {lang === 'RU' ? 'Тестов завершено' : 'Tests Completed'}</span>
                  <span>100%</span>
               </div>
            </GlassCard>
          </div>
        </div>
      </Container>
    </div>
  );
};
