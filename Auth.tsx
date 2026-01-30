
import React from 'react';
import { useApp } from '../context/AppContext';
import { Container, GlassCard } from '../components/Layout';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageCircle, Github, ArrowLeft } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login, lang } = useApp();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <Container className="max-w-md">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8"
        >
          <ArrowLeft size={18} />
          {lang === 'RU' ? 'Назад на главную' : 'Back to Home'}
        </button>

        <GlassCard className="text-center p-10">
          <h1 className="text-3xl font-bold mb-2">Welcome</h1>
          <p className="text-white/50 mb-10">Sign in to start your journey</p>

          <div className="space-y-4">
            <button onClick={() => handleLogin(UserRole.CLIENT)} className="w-full glass py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all border-white/20">
              <MessageCircle size={20} fill="#24A1DE" className="text-[#24A1DE]" />
              Login with Telegram
            </button>
            <button onClick={() => handleLogin(UserRole.AGENT)} className="w-full glass py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all border-white/20">
              <Mail size={20} className="text-red-400" />
              Login with Email (Agent)
            </button>
            <button onClick={() => handleLogin(UserRole.ADMIN)} className="w-full glass py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all border-white/20">
              <Github size={20} />
              Login with Admin Account
            </button>
          </div>

          <p className="mt-8 text-xs text-white/30 leading-relaxed px-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </GlassCard>
      </Container>
    </div>
  );
};
