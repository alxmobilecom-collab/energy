
import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { Container, GlassCard } from '../components/Layout';
// Added ShieldCheck to the imports below
import { Play, ArrowRight, Star, Shield, Zap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const REVIEWS = [
  { id: 1, name: "Alexei K.", rating: 5, text: { EN: "The most accurate energy test I've taken. The report helped me fix my sleep schedule.", RU: "Самый точный тест на энергию. Отчет помог мне наладить сон." } },
  { id: 2, name: "Maria S.", rating: 5, text: { EN: "Love the community access! Exclusive tips from experts are worth it.", RU: "Обожаю доступ к сообществу! Эксклюзивные советы от экспертов того стоят." } },
];

export const Landing: React.FC = () => {
  const { lang } = useApp();
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-20">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-manrope font-extrabold leading-tight mb-6">
              {t.heroTitle.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? 'gradient-text' : ''}>{word} </span>
              ))}
            </h1>
            <p className="text-xl text-white/60 mb-10 max-w-xl mx-auto lg:mx-0">
              {t.heroSub}
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => navigate('/tests')}
                className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all group"
              >
                {t.ctaTests}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <GlassCard className="aspect-video flex items-center justify-center overflow-hidden relative group">
                <img src="https://picsum.photos/seed/nova/800/450" className="absolute inset-0 object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" alt="Preview" />
                <div className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all">
                  <Play size={32} fill="white" />
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <BenefitCard 
            icon={<Zap className="text-yellow-400" />}
            title={lang === 'RU' ? 'Мгновенный результат' : 'Instant Results'}
            desc={lang === 'RU' ? 'Наши ИИ-алгоритмы анализируют ваши ответы в реальном времени.' : 'Our AI algorithms analyze your responses in real-time.'}
          />
          <BenefitCard 
            icon={<Shield className="text-green-400" />}
            title={lang === 'RU' ? 'Закрытое сообщество' : 'Private Community'}
            desc={lang === 'RU' ? 'Получите доступ к эксклюзивному Telegram-каналу после прохождения.' : 'Get access to an exclusive Telegram channel after completion.'}
          />
          <BenefitCard 
            icon={<ShieldCheck className="text-indigo-400" />}
            title={lang === 'RU' ? 'Токены и агенты' : 'Tokens & Agents'}
            desc={lang === 'RU' ? 'Удобная внутренняя экономика для корпоративных клиентов.' : 'Convenient internal economy for corporate clients.'}
          />
        </div>

        {/* Reviews */}
        <h2 className="text-3xl font-bold text-center mb-12">{t.reviews}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REVIEWS.map(review => (
            <GlassCard key={review.id}>
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" className="text-yellow-400" />)}
              </div>
              <p className="text-lg italic text-white/80 mb-4">"{review.text[lang]}"</p>
              <p className="font-bold text-sm">— {review.name}</p>
            </GlassCard>
          ))}
        </div>
      </Container>
    </div>
  );
};

const BenefitCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <GlassCard>
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
  </GlassCard>
);
