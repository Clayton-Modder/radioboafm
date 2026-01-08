
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Hls from 'hls.js';
import { RADIO_STREAM_URL } from '../constants';

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

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

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
      audio.load();
      setIsPlaying(false);
    } else {
      const url = RADIO_STREAM_URL;
      
      if (url.includes('.m3u8') && Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy();
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(audio);
        hlsRef.current = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          audio.play().catch(e => console.error("HLS Play error:", e));
        });
      } else {
        audio.src = url;
        audio.load();
        audio.play().catch(err => {
          console.error("Direct Play error:", err);
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(audio);
            hlsRef.current = hls;
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              audio.play().catch(e => console.error("HLS Fallback Play error:", e));
            });
          }
        });
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 shadow-lg px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-lg overflow-hidden flex items-center justify-center shadow-indigo-500/20 shadow-lg">
            <img 
              src="https://redeboa.com.br/wp-content/uploads/2024/12/logo_boafmirece-1024x1024.png" 
              alt="Rede Boa FM" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white leading-tight">BOA FM IRECÊ</h1>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <p className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wider">AO VIVO</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block flex-1 px-12 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">No Ar na Rádio</p>
          <p className="text-sm text-white font-medium truncate max-w-xs mx-auto">{currentProgramName}</p>
        </div>

        <div className="flex items-center gap-4 md:gap-6 bg-slate-900/50 rounded-full px-4 py-2 border border-white/5">
          <button 
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause Radio" : "Play Radio"}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
          >
            {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
          </button>

          <div className="flex items-center gap-3">
            <button onClick={toggleMute} className="text-slate-300 hover:text-white transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 md:w-28 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>
      <audio ref={audioRef} crossOrigin="anonymous" preload="none" />
    </header>
  );
};

export default RadioPlayer;
