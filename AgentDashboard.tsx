
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { Container, GlassCard } from '../components/Layout';
import { Users, Send, History, Coins, Search } from 'lucide-react';

export const AgentDashboard: React.FC = () => {
  const { lang, user, updateTokens } = useApp();
  const t = TRANSLATIONS[lang];
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState('');

  const handleGrant = () => {
    const val = parseInt(amount);
    if (isNaN(val) || val <= 0) return;
    if (user && user.tokens < val) {
      alert("Insufficient funds");
      return;
    }
    updateTokens(-val);
    alert(`Granted ${val} tokens to user ${targetId}`);
    setTargetId('');
    setAmount('');
  };

  return (
    <div className="pt-32 pb-20">
      <Container>
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
            <Users size={24} />
          </div>
          <h1 className="text-4xl font-bold">{t.agentPanel}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="bg-indigo-600/10">
              <p className="text-sm text-white/50 mb-1">{lang === 'RU' ? 'Доступные токены' : 'Available Tokens'}</p>
              <div className="flex items-center gap-2">
                <Coins className="text-yellow-400" />
                <span className="text-3xl font-bold">{user?.tokens}</span>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Send size={18} className="text-indigo-400" />
                {t.sendTokens}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">{t.recipient}</label>
                  <input 
                    type="text" 
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    placeholder="e.g. USER-9921"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">{t.amount}</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleGrant}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                  {t.sendTokens}
                </button>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-2">
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <History size={18} className="text-indigo-400" />
                  {t.tokenHistory}
                </h3>
                <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg text-xs">
                  <Search size={14} />
                  <input type="text" placeholder="Filter..." className="bg-transparent border-none outline-none w-24" />
                </div>
              </div>

              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all">
                    <div>
                      <p className="font-medium">Sent to ID-882{i}</p>
                      <p className="text-xs text-white/30">Oct {12 + i}, 2023 • 14:20</p>
                    </div>
                    <span className="font-bold text-red-400">-50</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </Container>
    </div>
  );
};
