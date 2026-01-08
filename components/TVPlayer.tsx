
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Maximize, MonitorPlay, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { TV_STREAM_URL } from '../constants';

const TVPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const controlsTimeoutRef = useRef<number | null>(null);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  }, []);

  const adjustVolume = useCallback((delta: number) => {
    setVolume(prev => {
      const newVol = Math.min(1, Math.max(0, prev + delta));
      if (videoRef.current) videoRef.current.volume = newVol;
      if (newVol > 0) setIsMuted(false);
      return newVol;
    });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newState = !prev;
      if (videoRef.current) videoRef.current.muted = newState;
      return newState;
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(TV_STREAM_URL);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = TV_STREAM_URL;
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Keyboard Navigation for Smart TV and Desktop
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger controls visibility on any key press
      handleMouseMove();

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay, toggleFullscreen, toggleMute, adjustVolume]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div className="pt-28 md:pt-36 pb-8 px-4 md:px-8 max-w-7xl mx-auto">
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onClick={handleMouseMove}
        className="relative group bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-2xl aspect-video border border-white/5"
      >
        <video 
          ref={videoRef} 
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
          playsInline
        />

        {/* Top Overlay: Title and Live Badge - Adjusted for mobile */}
        <div className={`absolute top-3 left-3 md:top-6 md:left-6 flex items-center gap-2 md:gap-3 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-red-600 px-2 py-0.5 md:px-3 md:py-1 rounded text-[8px] md:text-[10px] font-bold tracking-widest text-white shadow-lg animate-pulse whitespace-nowrap">
            AO VIVO
          </div>
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/10 max-w-[150px] md:max-w-none">
            <h3 className="text-white text-xs md:text-base font-semibold truncate">BOA FM TV</h3>
          </div>
        </div>

        {/* Center Play/Pause - Accessible and responsive */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20"
            onClick={togglePlay}
          >
            <div className="bg-white/20 backdrop-blur-md p-4 md:p-6 rounded-full border border-white/30 scale-90 md:scale-100 hover:scale-110 transition-transform">
              <Play fill="white" className="text-white w-8 h-8 md:w-12 md:h-12 ml-1" />
            </div>
          </div>
        )}

        {/* Bottom Controls Bar - Larger hit areas for TV/Mobile */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 md:gap-6">
              <button 
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause TV" : "Play TV"}
                className="text-white hover:text-indigo-400 transition-colors bg-white/10 p-2 md:p-3 rounded-full border border-white/10"
              >
                {isPlaying ? <Pause size={24} className="md:w-7 md:h-7" /> : <Play size={24} className="md:w-7 md:h-7" />}
              </button>
              
              <div className="hidden sm:block">
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-0.5">TV Online</p>
                <h4 className="text-white font-bold text-sm md:text-lg truncate max-w-[200px] lg:max-w-md">Assista a Boa FM Irecê</h4>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                <button 
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute TV" : "Mute TV"}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  {isMuted || volume === 0 ? <VolumeX size={20} className="md:w-6 md:h-6" /> : <Volume2 size={20} className="md:w-6 md:h-6" />}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (videoRef.current) videoRef.current.volume = val;
                    setIsMuted(val === 0);
                  }}
                  className="hidden md:block w-16 lg:w-24 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <button 
                onClick={toggleFullscreen}
                aria-label="Toggle Fullscreen TV"
                className="text-white/80 hover:text-white transition-colors bg-white/10 p-2 md:p-3 rounded-full border border-white/10"
              >
                <Maximize size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Title Card (Moved outside video for small screens to avoid clutter) */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/30 p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2 rounded-lg">
            <MonitorPlay className="text-indigo-400" size={24} />
          </div>
          <div>
            <span className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase tracking-widest">TV Digital</span>
            <h2 className="text-white font-bold text-base md:text-xl leading-tight">Canal Boa FM TV</h2>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="flex-1 md:flex-none px-4 md:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-xs md:text-sm uppercase tracking-wider">
             Compartilhar
           </button>
           <button className="flex-1 md:flex-none px-4 md:px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors text-xs md:text-sm uppercase tracking-wider">
             Grade
           </button>
        </div>
      </div>
      
      {/* Visual Keyboard Guide (Subtle) */}
      <div className="mt-4 hidden lg:flex justify-center gap-6 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
        <span>[ESPAÇO] Play/Pause</span>
        <span>[F] Tela Cheia</span>
        <span>[M] Mudo</span>
        <span>[setas] Volume</span>
      </div>
    </div>
  );
};

export default TVPlayer;
