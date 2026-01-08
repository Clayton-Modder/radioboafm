
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Share2 } from 'lucide-react';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

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
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      audio.src = '';
      setIsPlaying(false);
    } else {
      const url = RADIO_STREAM_URL;
      if (url.includes('.m3u8') && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(audio);
        hlsRef.current = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
      } else {
        audio.src = url;
        audio.play().catch(() => {
           // Fallback silent fail
        });
      }
      setIsPlaying(true);
    }
  };

  const handleShare = async () => {
    // Garante uma URL válida, especialmente em ambientes de preview/iframe
    const currentUrl = window.location.href.startsWith('http') 
      ? window.location.href 
      : 'https://redeboa.com.br';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Boa FM Irecê',
          text: `Ouvindo agora: ${currentProgramName} na Boa FM Irecê!`,
          url: currentUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(currentUrl);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        
        {/* Logo & Info */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex-shrink-0 overflow-hidden shadow-lg border border-white/10">
            <img 
              src="https://redeboa.com.br/wp-content/uploads/2024/12/logo_boafmirece-1024x1024.png" 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden xs:block">
            <h1 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-none mb-1">BOA FM IRECÊ</h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mr-2">AO VIVO</span>
              <LocationBadge />
            </div>
          </div>
        </div>

        {/* Current Program - Desktop Only */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1 px-4 text-center overflow-hidden">
          <div className="flex items-center gap-2 text-indigo-400 mb-0.5">
            <Radio size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">No Ar</span>
          </div>
          <p className="text-sm font-medium text-white truncate w-full max-w-[300px]">{currentProgramName}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 sm:gap-6 ml-auto">
          <div className="flex items-center gap-3 bg-white/5 rounded-full px-2 py-1.5 sm:px-4 sm:py-2 border border-white/5">
            <button 
              onClick={togglePlay}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-90"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>

            {/* Volume Desktop */}
            <div className="hidden md:flex items-center gap-3 ml-2 border-l border-white/10 pl-4">
              <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input 
                type="range" 
                min="0" max="1" step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          <button 
            onClick={handleShare}
            className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            title="Compartilhar"
          >
            <Share2 size={20} />
          </button>
          
          <div className="xs:hidden flex flex-col items-end">
            <span className="text-[10px] font-bold text-red-500 animate-pulse">LIVE</span>
          </div>
        </div>
      </div>
      <audio ref={audioRef} crossOrigin="anonymous" />
    </header>
  );
};

export default RadioPlayer;
