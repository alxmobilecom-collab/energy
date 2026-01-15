
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { Container, GlassCard } from '../components/Layout';
import { Coins, Check, Zap, Rocket, Crown, CreditCard, Bitcoin, Globe, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Currency, PaymentMethod } from '../types';

const PACKAGES = [
  {
    id: 'starter',
    tokens: 250,
    basePrice: 10,
    icon: <Zap className="text-indigo-400" />,
    color: 'border-indigo-500/20'
  },
  {
    id: 'pro',
    tokens: 750,
    basePrice: 25,
    icon: <Rocket className="text-purple-400" />,
    color: 'border-purple-500/40 bg-purple-500/5',
    popular: true
  },
  {
    id: 'elite',
    tokens: 2000,
    basePrice: 60,
    icon: <Crown className="text-yellow-400" />,
    color: 'border-yellow-500/20'
  }
];

const CURRENCY_CONFIG = {
  [Currency.USD]: { symbol: '$', rate: 1 },
  [Currency.EUR]: { symbol: '€', rate: 0.92 },
  [Currency.RUB]: { symbol: '₽', rate: 92 },
  [Currency.TRY]: { symbol: '₺', rate: 34.5 },
};

export const Tokens: React.FC = () => {
  const { lang, user, updateTokens } = useApp();
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | 'CRYPTO'>(
    lang === 'RU' ? Currency.RUB : Currency.USD
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CARD);
  const [showCheckout, setShowCheckout] = useState<{pkgId: string, tokens: number} | null>(null);

  const formatPrice = (basePrice: number) => {
    if (selectedCurrency === 'CRYPTO') {
      return `${(basePrice * 1.05).toFixed(2)} USDT`; // Simulating crypto pricing with slight markup
    }
    const config = CURRENCY_CONFIG[selectedCurrency as Currency];
    const finalPrice = Math.round(basePrice * config.rate);
    return `${config.symbol}${finalPrice}`;
  };

  const handlePurchase = (tokens: number) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Simulate payment processing
    updateTokens(tokens);
    alert(`Success! You received ${tokens} tokens via ${paymentMethod === PaymentMethod.CRYPTO ? 'Crypto' : 'Card'}.`);
    navigate('/profile');
  };

  const openCheckout = (pkgId: string, tokens: number) => {
    if (selectedCurrency === 'CRYPTO') {
      setPaymentMethod(PaymentMethod.CRYPTO);
    } else {
      setPaymentMethod(PaymentMethod.CARD);
    }
    setShowCheckout({ pkgId, tokens });
  };

  if (showCheckout) {
    const pkg = PACKAGES.find(p => p.id === showCheckout.pkgId)!;
    return (
      <div className="pt-32 pb-20">
        <Container className="max-w-2xl">
          <GlassCard className="p-8 md:p-12">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <CheckCircle2 className="text-green-500" />
              {t.confirmPayment}
            </h2>
            
            <div className="bg-white/5 p-6 rounded-2xl mb-8 flex items-center justify-between border border-white/10">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Package</p>
                <p className="text-xl font-bold">{showCheckout.tokens} {t.tokensCount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Amount</p>
                <p className="text-2xl font-black text-indigo-400">
                  {paymentMethod === PaymentMethod.CRYPTO 
                    ? `${(pkg.basePrice * 1.05).toFixed(2)} USDT` 
                    : formatPrice(pkg.basePrice)}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <p className="text-sm text-white/50">{lang === 'RU' ? 'Платежный метод:' : 'Payment Method:'}</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod(PaymentMethod.CARD)}
                  className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${paymentMethod === PaymentMethod.CARD ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'}`}
                >
                  <CreditCard className={paymentMethod === PaymentMethod.CARD ? 'text-indigo-400' : 'text-white/40'} />
                  <div className="text-left">
                    <p className="text-sm font-bold">{t.payWithCard}</p>
                    <p className="text-[10px] text-white/40">{t.cardSubtitle}</p>
                  </div>
                </button>
                <button 
                  onClick={() => setPaymentMethod(PaymentMethod.CRYPTO)}
                  className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${paymentMethod === PaymentMethod.CRYPTO ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 hover:border-white/20'}`}
                >
                  <Bitcoin className={paymentMethod === PaymentMethod.CRYPTO ? 'text-yellow-400' : 'text-white/40'} />
                  <div className="text-left">
                    <p className="text-sm font-bold">{t.payWithCrypto}</p>
                    <p className="text-[10px] text-white/40">{t.cryptoSubtitle}</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowCheckout(null)}
                className="flex-1 glass py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
              >
                {t.back}
              </button>
              <button 
                onClick={() => handlePurchase(showCheckout.tokens)}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/30 transition-all"
              >
                {t.buyNow}
              </button>
            </div>
          </GlassCard>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">{t.buyTokens}</h1>
          <p className="text-white/50 max-w-xl mx-auto mb-8">
            {lang === 'RU' 
              ? 'Выберите подходящий пакет токенов для прохождения новых тестов и доступа к эксклюзивным функциям.' 
              : 'Choose the right token package to unlock new tests and access exclusive features.'}
          </p>

          {/* Currency Switcher */}
          <div className="inline-flex glass p-1 rounded-2xl border border-white/10 flex-wrap justify-center gap-1">
            {Object.keys(CURRENCY_CONFIG).map((cur) => (
              <button
                key={cur}
                onClick={() => setSelectedCurrency(cur as Currency)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${selectedCurrency === cur ? 'bg-indigo-600 shadow-lg' : 'hover:bg-white/5 text-white/40'}`}
              >
                {cur}
              </button>
            ))}
            <button
              onClick={() => setSelectedCurrency('CRYPTO')}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${selectedCurrency === 'CRYPTO' ? 'bg-yellow-600 shadow-lg' : 'hover:bg-white/5 text-white/40'}`}
            >
              <Bitcoin size={14} className={selectedCurrency === 'CRYPTO' ? 'text-white' : 'text-yellow-500'} />
              CRYPTO
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PACKAGES.map((pkg) => (
            <GlassCard 
              key={pkg.id} 
              className={`flex flex-col relative transition-transform hover:scale-[1.02] ${pkg.color}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/40">
                  {lang === 'RU' ? 'Популярный' : 'Best Value'}
                </div>
              )}
              
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                {pkg.icon}
              </div>

              <h3 className="text-xl font-bold mb-1">
                {pkg.id === 'starter' ? t.packageStarter : pkg.id === 'pro' ? t.packagePro : t.packageElite}
              </h3>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-black">{pkg.tokens}</span>
                <span className="text-white/40 font-bold uppercase text-xs mb-1.5 tracking-widest">{t.tokensCount}</span>
              </div>

              <div className="space-y-4 mb-8 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>{lang === 'RU' ? 'Мгновенное начисление' : 'Instant Activation'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>{lang === 'RU' ? 'Без срока действия' : 'No Expiry Date'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>{lang === 'RU' ? 'Доступ ко всем тестам' : 'All Modules Unlocked'}</span>
                </div>
              </div>

              <div className="mt-auto">
                <div className="text-2xl font-bold mb-4">{formatPrice(pkg.basePrice)}</div>
                <button 
                  onClick={() => openCheckout(pkg.id, pkg.tokens)}
                  className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl ${
                    pkg.popular 
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20' 
                    : 'glass hover:bg-white/10'
                  }`}
                >
                  {t.buyNow}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <GlassCard className="bg-yellow-500/5 border-yellow-500/20 flex gap-6 items-center p-8">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center shrink-0">
                 <Bitcoin className="text-yellow-400" size={32} />
              </div>
              <div>
                 <h4 className="text-xl font-bold mb-2">{t.payWithCrypto}</h4>
                 <p className="text-sm text-white/50">{lang === 'RU' ? 'Мы принимаем BTC, ETH, USDT и другие популярные криптовалюты.' : 'We accept BTC, ETH, USDT and other popular cryptocurrencies.'}</p>
              </div>
           </GlassCard>
           
           <GlassCard className="bg-indigo-500/5 border-indigo-500/20 flex gap-6 items-center p-8">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
                 <Globe className="text-indigo-400" size={32} />
              </div>
              <div>
                 <h4 className="text-xl font-bold mb-2">{lang === 'RU' ? 'Региональная поддержка' : 'Regional Support'}</h4>
                 <p className="text-sm text-white/50">{lang === 'RU' ? 'Оплата картами доступна в большинстве стран СНГ, Европы и Америки.' : 'Card payments are available in most CIS, European, and American countries.'}</p>
              </div>
           </GlassCard>
        </div>
      </Container>
    </div>
  );
};
