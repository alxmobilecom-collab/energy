
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS, MOCK_TESTS } from '../constants';
import { Language, UserRole } from '../types';
import { Menu, User as UserIcon, LogOut, Globe, Coins, ShieldCheck, Github, Twitter, MessageCircle, BarChart3, Activity, Heart, Check, FileText, Zap, StretchHorizontal, Utensils, Dumbbell, Share2, Rocket, ChevronDown, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LANG_LABELS: Record<Language, string> = {
  [Language.EN]: 'English',
  [Language.RU]: 'Русский',
  [Language.ES]: 'Español',
  [Language.HI]: 'हिन्दी',
};

export const Navbar: React.FC = () => {
  const { user, lang, setLang, logout } = useApp();
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white text-xs md:text-base">N</div>
        <span className="text-base md:text-xl font-manrope font-extrabold tracking-tight">NOVATEST</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
        <Link to="/tests" className="hover:text-white transition-colors">{t.ctaTests}</Link>
        <Link to="/food-scanner" className="hover:text-white transition-colors flex items-center gap-2">
           <Camera size={14} className="text-indigo-400" />
           {t.foodScan}
        </Link>
        <Link to="/tokens" className="hover:text-white transition-colors">{t.ctaTokens}</Link>
        {user?.role === UserRole.AGENT && <Link to="/agent" className="text-purple-400 hover:text-purple-300">{t.agentPanel}</Link>}
        {user?.role === UserRole.ADMIN && <Link to="/admin" className="text-red-400 hover:text-red-300">{t.adminPanel}</Link>}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Dropdown */}
        <div className="relative" ref={langMenuRef}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="glass px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs hover:bg-white/10 transition-all flex items-center gap-1.5 md:gap-2 border border-white/5"
          >
            <Globe size={12} className="text-indigo-400 md:w-[14px] md:h-[14px]" />
            <span className="font-bold uppercase">{lang}</span>
            <ChevronDown size={10} className={`transition-transform duration-300 md:w-3 md:h-3 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-32 md:w-40 bg-[#130d2b] border border-white/20 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="py-1">
                {(Object.keys(Language) as Array<keyof typeof Language>).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setLang(Language[key]);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-[10px] md:text-xs font-medium hover:bg-white/10 transition-colors flex items-center justify-between ${lang === Language[key] ? 'text-indigo-400 bg-white/5' : 'text-white/60'}`}
                  >
                    {LANG_LABELS[Language[key]]}
                    {lang === Language[key] && <Check size={10} className="md:w-3 md:h-3" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-1.5 md:gap-3">
            <button 
              onClick={() => navigate('/tokens')}
              className="flex items-center gap-1 md:gap-2 glass px-2 md:px-3 py-1 md:py-1.5 rounded-full hover:bg-white/10 transition-all"
            >
              <Coins size={14} className="text-yellow-400 md:w-4 md:h-4" />
              <span className="text-[10px] md:text-sm font-bold">{user.tokens}</span>
            </button>
            <Link to="/profile" className="w-7 h-7 md:w-9 md:h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
              <UserIcon size={14} className="text-white/70 md:w-5 md:h-5" />
            </Link>
            <button onClick={logout} className="p-1 md:p-2 text-white/50 hover:text-white">
              <LogOut size={16} className="md:w-5 md:h-5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/auth')}
            className="bg-indigo-600 hover:bg-indigo-500 px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

const getTestIcon = (type: string) => {
  switch (type) {
    case 'energy': return <Zap size={16} />;
    case 'flexibility': return <StretchHorizontal size={16} />;
    case 'food': return <Utensils size={16} />;
    case 'fitness': return <Dumbbell size={16} />;
    case 'social': return <Share2 size={16} />;
    default: return <Activity size={16} />;
  }
};

export const FloatingQuickAccess: React.FC = () => {
  const { lang, completedTests } = useApp();
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[98%] md:w-[95%] max-w-4xl">
      <div className="glass border border-white/20 rounded-2xl md:rounded-3xl p-1.5 md:p-2 shadow-2xl shadow-indigo-500/10 flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar">
        <div className="px-3 md:px-4 py-2 border-r border-white/10 hidden md:block">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest whitespace-nowrap">{t.quickStart}</p>
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-2 px-1 md:px-2 py-0.5 md:py-1">
          {/* Added Food Scanner shortcut */}
          <button
            onClick={() => navigate('/food-scanner')}
            className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl transition-all whitespace-nowrap group bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20"
          >
            <Camera size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight">{t.foodScan}</span>
          </button>

          {MOCK_TESTS.map((test) => {
            const isDone = completedTests.includes(test.id);
            return (
              <button
                key={test.id}
                onClick={() => navigate('/tests')}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl transition-all whitespace-nowrap group ${
                  isDone 
                  ? 'bg-green-500/10 border border-green-500/20 opacity-80' 
                  : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className={`${isDone ? 'text-green-400' : 'text-indigo-400'} group-hover:scale-110 transition-transform`}>
                  {getTestIcon(test.type)}
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight leading-none md:leading-normal">{test.title[lang]}</span>
                  <span className={`text-[8px] md:text-[9px] ${isDone ? 'text-green-500/60' : 'text-white/40'}`}>
                    {isDone ? (lang === 'RU' ? 'Пройдено' : (lang === 'ES' ? 'Completado' : (lang === 'HI' ? 'पूरा हुआ' : 'Completed'))) : `${test.priceTokens} Tokens`}
                  </span>
                </div>
                {!isDone && (
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Rocket size={10} className="text-white md:w-3 md:h-3" />
                  </div>
                )}
                {isDone && <Check size={12} className="text-green-400 md:w-3.5 md:h-3.5" />}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => navigate('/tokens')}
          className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 px-3 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl flex items-center gap-1.5 md:gap-2 hover:brightness-110 transition-all shadow-lg shadow-indigo-500/20 shrink-0 mx-1"
        >
          <Coins size={14} className="text-yellow-400 md:w-4 md:h-4" />
          <span className="text-[10px] md:text-[11px] font-bold uppercase">{t.ctaTokens}</span>
        </button>
      </div>
    </div>
  );
};
/* Footer and other exports remain same */
export const Footer: React.FC = () => {
  const { lang, completedTests, user } = useApp();
  const t = TRANSLATIONS[lang];
  const [mood, setMood] = useState<string | null>(null);

  const recentlyDone = MOCK_TESTS.filter(test => completedTests.includes(test.id));

  return (
    <footer className="mt-20 border-t border-white/10 pt-20 pb-24 bg-black/30 backdrop-blur-sm">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white">N</div>
              <span className="text-xl font-manrope font-extrabold tracking-tight">NOVATEST</span>
            </Link>
            <div className="space-y-4">
              <p className="text-white/40 text-sm leading-relaxed italic">
                "{t.footerCaption}"
              </p>
            </div>
            <div className="flex gap-4">
              <Twitter className="text-white/30 hover:text-indigo-400 cursor-pointer transition-colors" size={20} />
              <Github className="text-white/30 hover:text-indigo-400 cursor-pointer transition-colors" size={20} />
              <MessageCircle className="text-white/30 hover:text-indigo-400 cursor-pointer transition-colors" size={20} />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-indigo-400">{t.recentResults}</h4>
            <div className="space-y-4">
              {!user ? (
                <p className="text-white/20 text-xs italic">{
                  lang === 'RU' ? 'Войдите, чтобы увидеть результаты' : 
                  (lang === 'ES' ? 'Inicia sesión para ver resultados' : 
                  (lang === 'HI' ? 'परिणाम देखने के लिए लॉगिन करें' : 'Login to see results'))
                }</p>
              ) : recentlyDone.length === 0 ? (
                <p className="text-white/20 text-xs italic">{t.noResults}</p>
              ) : (
                recentlyDone.map(test => (
                  <div key={test.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
                    <FileText size={14} className="text-indigo-400" />
                    <span className="text-xs font-medium text-white/80">{test.title[lang]}</span>
                    <Check size={12} className="text-green-500 ml-auto" />
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-indigo-400">{t.quickStart}</h4>
            <ul className="space-y-4">
              {MOCK_TESTS.map(test => (
                <li key={test.id}>
                  <Link to="/tests" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 bg-white/20 group-hover:bg-indigo-500 rounded-full transition-colors" />
                    {test.title[lang]}
                  </Link>
                </li>
              ))}
              <li>
                  <Link to="/food-scanner" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full transition-colors" />
                    {t.foodScan}
                  </Link>
              </li>
            </ul>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full -mr-12 -mt-12"></div>
            <h4 className="font-bold mb-4 text-sm">{
              lang === 'RU' ? 'Мини-тест дня' : 
              (lang === 'ES' ? 'Miniprueba del día' : 
              (lang === 'HI' ? 'दिन का छोटा परीक्षण' : 'Quick Mood Test'))
            }</h4>
            <p className="text-xs text-white/50 mb-6">{
              lang === 'RU' ? 'Как вы чувствуете себя в эту секунду?' : 
              (lang === 'ES' ? '¿Cómo te sientes en este segundo?' : 
              (lang === 'HI' ? 'आप इस समय कैसा महसूस कर रहे हैं?' : 'How are you feeling right this second?'))
            }</p>
            
            {mood ? (
              <div className="text-center animate-in fade-in duration-500">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-indigo-400" size={24} />
                </div>
                <p className="text-sm font-bold text-indigo-400">
                  {lang === 'RU' ? 'Записано!' : (lang === 'ES' ? '¡Registrado!' : (lang === 'HI' ? 'दर्ज किया गया!' : 'Result Logged!'))}
                </p>
                <button onClick={() => setMood(null)} className="text-[10px] text-white/30 underline mt-2 hover:text-white">Redo</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  lang === 'RU' ? '⚡️ Бодро' : (lang === 'ES' ? '⚡️ Enérgico' : (lang === 'HI' ? '⚡️ ऊर्जावान' : '⚡️ Energetic')),
                  lang === 'RU' ? '😴 Устало' : (lang === 'ES' ? '😴 Cansado' : (lang === 'HI' ? '😴 थका हुआ' : '😴 Tired')),
                  lang === 'RU' ? '🤔 Сосредоточенно' : (lang === 'ES' ? '🤔 Enfocado' : (lang === 'HI' ? '🤔 केंद्रित' : '🤔 Focused')),
                  lang === 'RU' ? '🌈 Счастливо' : (lang === 'ES' ? '🌈 Feliz' : (lang === 'HI' ? '🌈 खुश' : '🌈 Happy'))
                ].map((m) => (
                  <button 
                    key={m}
                    onClick={() => setMood(m)}
                    className="text-[10px] glass py-2 rounded-xl hover:bg-white/10 transition-all border-white/5"
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-widest font-bold">
          <p>© 2026 NOVATEST LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export const Container: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`}>
    {children}
  </div>
);

export const GlassCard: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className, onClick }) => (
  <div 
    onClick={onClick}
    className={`glass rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
  >
    {children}
  </div>
);
