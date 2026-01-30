
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { Container, GlassCard } from '../components/Layout';
import { Camera, Upload, AlertCircle, Loader2, Utensils, Zap, Flame, Droplets, CheckCircle2 } from 'lucide-react';
import { analyzeFoodImage } from '../services/gemini';
import { useNavigate } from 'react-router-dom';

export const FoodScanner: React.FC = () => {
  const { lang, user, updateTokens } = useApp();
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error(err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCapturedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!user || user.tokens < 50) {
      alert(t.insufficientTokens);
      return;
    }
    if (!capturedImage) return;

    setAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeFoodImage(capturedImage, lang);
      setResult(analysis);
      updateTokens(-50);
    } catch (err) {
      setError("AI was unable to analyze this image. Please try a clearer photo.");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="pt-32 pb-20">
      <Container className="max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
            <Utensils size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t.foodScan}</h1>
            <p className="text-white/40 text-sm">{lang === 'RU' ? 'Определите состав еды по фото' : 'Estimate calories from photos'}</p>
          </div>
        </div>

        {!result ? (
          <GlassCard className="p-0 overflow-hidden relative border-indigo-500/20">
            {!capturedImage ? (
              <div className="aspect-square md:aspect-video relative bg-black/40 flex flex-col items-center justify-center group overflow-hidden">
                {stream ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                    <button 
                      onClick={capturePhoto}
                      className="absolute bottom-8 w-16 h-16 rounded-full border-4 border-white bg-white/20 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform z-10"
                    >
                      <div className="w-10 h-10 bg-white rounded-full"></div>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-6 p-12 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
                       <Camera size={40} className="text-white/20" />
                    </div>
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                      <button 
                        onClick={startCamera}
                        className="bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                      >
                        <Camera size={20} />
                        {t.takePhoto}
                      </button>
                      <label className="glass py-4 rounded-2xl font-bold cursor-pointer hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <Upload size={20} />
                        {t.uploadImage}
                        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                      </label>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="absolute top-4 left-4 right-4 p-4 glass bg-red-500/10 border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <img src={capturedImage} className="w-full aspect-square md:aspect-video object-cover" alt="Captured food" />
                <div className="p-6 bg-black/60 backdrop-blur-md border-t border-white/10">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {setCapturedImage(null); setStream(null);}}
                      className="flex-1 glass py-4 rounded-2xl font-bold hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
                    >
                      {t.back}
                    </button>
                    <button 
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="flex-[2] bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {analyzing ? <Loader2 className="animate-spin" /> : <Zap size={20} className="text-yellow-400" />}
                      {analyzing ? t.analyzing : t.scanCTA}
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-white/30 uppercase tracking-widest mt-4 font-bold">Costs 50 Tokens</p>
                </div>
              </div>
            )}
          </GlassCard>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <GlassCard className="relative overflow-hidden p-8 border-indigo-500/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                
                <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
                   <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-indigo-500/20 shrink-0">
                      <img src={capturedImage!} className="w-full h-full object-cover" alt="Food" />
                   </div>
                   <div className="text-center md:text-left">
                      <h2 className="text-3xl font-black mb-1 text-white">{result.foodName}</h2>
                      <div className="flex items-center gap-2 justify-center md:justify-start text-indigo-400 font-bold uppercase text-xs tracking-widest">
                         <CheckCircle2 size={14} />
                         {t.analysisResult}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                   <StatBlock icon={<Flame className="text-orange-400" />} label={t.calories} value={result.calories} unit="kcal" />
                   <StatBlock icon={<Zap className="text-indigo-400" />} label={t.protein} value={result.protein} />
                   <StatBlock icon={<Utensils className="text-green-400" />} label={t.carbs} value={result.carbs} />
                   <StatBlock icon={<Droplets className="text-yellow-400" />} label={t.fat} value={result.fat} />
                </div>

                <div className="glass bg-white/5 border-none p-6 rounded-2xl">
                   <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                         <Zap className="text-indigo-400" size={20} />
                      </div>
                      <div>
                         <p className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-1">AI Health Tip</p>
                         <p className="text-sm text-white/70 italic leading-relaxed">"{result.healthTip}"</p>
                      </div>
                   </div>
                </div>
             </GlassCard>

             <div className="flex gap-4">
                <button 
                  onClick={() => {setResult(null); setCapturedImage(null);}}
                  className="flex-1 glass py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                >
                   {lang === 'RU' ? 'Новое фото' : 'Scan Again'}
                </button>
                <button 
                  onClick={() => navigate('/tests')}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20"
                >
                   {t.ctaTests}
                </button>
             </div>
          </div>
        )}
      </Container>
    </div>
  );
};

const StatBlock: React.FC<{ icon: React.ReactNode, label: string, value: string | number, unit?: string }> = ({ icon, label, value, unit }) => (
  <div className="glass bg-white/5 border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-3">
       {icon}
    </div>
    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{label}</span>
    <p className="text-xl font-black text-white">
       {value}{unit && <span className="text-xs font-normal text-white/40 ml-1">{unit}</span>}
    </p>
  </div>
);
