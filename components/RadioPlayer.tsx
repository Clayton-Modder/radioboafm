
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Activity, Mic2, Settings2, Volume2, VolumeX, Headphones } from 'lucide-react';
import Hls from 'hls.js';
import { RADIO_STREAM_URL } from '../constants';
import LocationBadge from './LocationBadge';

interface RadioPlayerProps {
  currentProgramName: string;
}

type RhythmType = 'studio' | 'podcast' | 'radio-am' | 'crystal';

const RadioPlayer: React.FC<RadioPlayerProps> = ({ currentProgramName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(() => localStorage.getItem('voice_mode_enabled') === 'true');
  const [rhythmType, setRhythmType] = useState<RhythmType>(() => (localStorage.getItem('voice_rhythm_type') as RhythmType) || 'studio');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(8).fill(2));
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('voice_mode_enabled', isVoiceMode.toString());
    localStorage.setItem('voice_rhythm_type', rhythmType);
    applyFilters();
  }, [isVoiceMode, rhythmType]);

  const applyFilters = () => {
    if (!filterRef.current) return;
    
    const filter = filterRef.current;
    if (!isVoiceMode) {
      filter.type = 'allpass';
      return;
    }

    switch (rhythmType) {
      case 'podcast':
        filter.type = 'peaking';
        filter.frequency.value = 250;
        filter.Q.value = 1;
        filter.gain.value = 6;
        break;
      case 'radio-am':
        filter.type = 'bandpass';
        filter.frequency.value = 1800;
        filter.Q.value = 1.0;
        break;
      case 'crystal':
        filter.type = 'highpass';
        filter.frequency.value = 400;
        break;
      case 'studio':
      default:
        filter.type = 'peaking';
        filter.frequency.value = 3200;
        filter.Q.value = 1.5;
        filter.gain.value = 5;
        break;
    }
  };

  const setupAudioAnalysis = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const source = ctx.createMediaElementSource(audioRef.current);
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      
      const filter = ctx.createBiquadFilter();
      const panner = ctx.createStereoPanner();

      source.connect(filter);
      filter.connect(panner);
      panner.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      filterRef.current = filter;
      pannerRef.current = panner;
      
      applyFilters();
    } catch (e) {
      console.error("Audio Context setup failed:", e);
    }
  };

  const updateLevels = () => {
    if (!analyserRef.current || !isPlaying) {
      setAudioLevels(new Array(8).fill(2));
      return;
    }
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const newLevels = [];
    for (let i = 0; i < 8; i++) {
      const val = (dataArray[i * 2] / 255) * 100;
      newLevels.push(Math.max(4, val));
    }
    setAudioLevels(newLevels);
    animationRef.current = requestAnimationFrame(updateLevels);
  };

  useEffect(() => {
    if (isPlaying) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      animationRef.current = requestAnimationFrame(updateLevels);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setAudioLevels(new Array(8).fill(4));
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setupAudioAnalysis();
      const url = RADIO_STREAM_URL;
      if (url.includes('.m3u8') && Hls.isSupported()) {
        if (!hlsRef.current) {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(audio);
          hlsRef.current = hls;
          hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
        } else {
          audio.play();
        }
      } else {
        if (!audio.src || audio.src === '') audio.src = url;
        audio.play().catch(e => console.error("Play error:", e));
      }
      setIsPlaying(true);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Section */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex-shrink-0 overflow-hidden shadow-lg border border-white/10 relative z-10">
            <img 
              src="https://redeboa.com.br/wp-content/uploads/2024/12/logo_boafmirece-1024x1024.png" 
              alt="Logo" 
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-110' : ''}`}
            />
            {isPlaying && <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />}
          </div>
          
          <div className="hidden xs:block">
            <h1 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-none mb-1 flex items-center gap-2 uppercase">
              Boa FM Irecê
            </h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AO VIVO</span>
            </div>
          </div>
        </div>

        {/* Dynamic Center: Visualizer & Voice Mode */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1 px-4 text-center">
          <div className="flex items-center gap-6 mb-1">
            <div className="flex items-end gap-[3px] h-6">
              {audioLevels.map((level, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-full transition-all duration-75 ${isVoiceMode ? 'bg-gradient-to-t from-emerald-600 to-white' : 'bg-gradient-to-t from-indigo-600 to-emerald-400'}`}
                  style={{ height: `${level}%`, opacity: isPlaying ? 0.9 : 0.2 }}
                />
              ))}
            </div>

            <button 
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${isVoiceMode ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}`}
            >
              <Mic2 size={12} />
              {isVoiceMode ? 'Voz Otimizada' : 'Modo Escuta'}
            </button>
          </div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] animate-pulse">
            {currentProgramName}
          </p>
        </div>

        {/* Control Section (Organized) */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {/* Location moved here for organization */}
          <div className="hidden sm:block">
            <LocationBadge />
          </div>

          <div className="relative flex items-center gap-2 sm:gap-3 bg-white/5 rounded-full px-2 py-1.5 sm:px-4 sm:py-2 border border-white/5 ring-1 ring-white/10">
            {isVoiceMode && (
              <button 
                onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                className={`p-1.5 rounded-full transition-colors ${showVoiceSettings ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400 hover:text-white'}`}
              >
                <Settings2 size={16} />
              </button>
            )}

            <button 
              onClick={togglePlay}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/40 active:scale-95"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>

            <div className="hidden md:flex items-center gap-3 ml-1 border-l border-white/10 pl-3">
              <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white transition-colors">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Rhythm Selector Dropdown */}
            {showVoiceSettings && isVoiceMode && (
              <div className="absolute top-full right-0 mt-3 w-48 glass border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest p-2 border-b border-white/5 mb-1">Qualidade da Voz</p>
                {[
                  { id: 'studio', label: 'Estúdio HD', icon: Headphones },
                  { id: 'podcast', label: 'Podcast Calor', icon: Mic2 },
                  { id: 'crystal', label: 'Voz Cristalina', icon: Activity },
                  { id: 'radio-am', label: 'Rádio Retrô', icon: Activity },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setRhythmType(item.id as RhythmType); setShowVoiceSettings(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold transition-all ${rhythmType === item.id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <item.icon size={12} />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile indicator */}
          <div className="xs:hidden">
            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-700'}`} />
          </div>
        </div>
      </div>
      <audio ref={audioRef} crossOrigin="anonymous" style={{ display: 'none' }} />
    </header>
  );
};

export default RadioPlayer;
