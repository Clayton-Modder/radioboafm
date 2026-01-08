
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity } from 'lucide-react';
import Hls from 'hls.js';
import { RADIO_STREAM_URL } from '../constants';
import LocationBadge from './LocationBadge';

interface RadioPlayerProps {
  currentProgramName: string;
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({ currentProgramName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(8).fill(2));
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Setup Audio Analysis
  const setupAudioAnalysis = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch (e) {
      console.error("Audio Analysis failed:", e);
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
        
        {/* Logo & Info */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="relative group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex-shrink-0 overflow-hidden shadow-lg border border-white/10 relative z-10">
              <img 
                src="https://redeboa.com.br/wp-content/uploads/2024/12/logo_boafmirece-1024x1024.png" 
                alt="Logo" 
                className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-110' : ''}`}
              />
            </div>
            {isPlaying && (
              <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full animate-pulse z-0" />
            )}
          </div>
          
          <div className="hidden xs:block">
            <h1 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-none mb-1 flex items-center gap-2">
              BOA FM IRECÊ
              {isPlaying && <Activity size={14} className="text-emerald-400 animate-pulse" />}
            </h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AO VIVO</span>
            </div>
          </div>
        </div>

        {/* Visualizer & Current Program (Centralizado) */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1 px-4 text-center overflow-hidden">
          <div className="flex items-end gap-[3px] h-6 mb-2">
            {audioLevels.map((level, i) => (
              <div 
                key={i} 
                className="w-1.5 rounded-full bg-gradient-to-t from-indigo-600 via-indigo-400 to-emerald-400 transition-all duration-75"
                style={{ height: `${level}%`, opacity: isPlaying ? 0.8 + (level/200) : 0.2 }}
              />
            ))}
          </div>
          <p className="text-xs font-black text-white truncate w-full max-w-[300px] uppercase tracking-widest">{currentProgramName}</p>
        </div>

        {/* Controls Area */}
        <div className="flex items-center gap-3 sm:gap-6 ml-auto">
          {/* Localização Badge */}
          <div className="hidden sm:block">
            <LocationBadge />
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded-full px-2 py-1.5 sm:px-4 sm:py-2 border border-white/5 ring-1 ring-white/10">
            <button 
              onClick={togglePlay}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/40 active:scale-90 transition-all"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>

            {/* Volume Desktop */}
            <div className="hidden md:flex items-center gap-3 ml-2 border-l border-white/10 pl-4">
              <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white transition-colors">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input 
                type="range" 
                min="0" max="1" step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
          
          {/* Mobile Status Only */}
          <div className="xs:hidden flex flex-col items-end">
             <div className="bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
               <span className="text-[9px] font-black text-emerald-400 tracking-widest uppercase">ON AIR</span>
            </div>
          </div>
        </div>
      </div>
      <audio 
        ref={audioRef} 
        crossOrigin="anonymous" 
        style={{ display: 'none' }}
      />
    </header>
  );
};

export default RadioPlayer;
