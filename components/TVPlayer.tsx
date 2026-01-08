
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Maximize, MonitorPlay, Pause, Play, Volume2, VolumeX, Share2 } from 'lucide-react';
import { TV_STREAM_URL } from '../constants';

const TVPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(TV_STREAM_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Option to autoplay but browsers might block it
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = TV_STREAM_URL;
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current?.paused) videoRef.current.play();
    else videoRef.current?.pause();
  };

  const handleInteraction = () => {
    setShowControls(true);
    if (controlsTimeout.current) window.clearTimeout(controlsTimeout.current);
    controlsTimeout.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div 
        ref={containerRef}
        onMouseMove={handleInteraction}
        onTouchStart={handleInteraction}
        className="relative group bg-slate-950 rounded-2xl overflow-hidden shadow-2xl aspect-video w-full border border-white/5 flex items-center justify-center ring-1 ring-white/10"
      >
        <video 
          ref={videoRef} 
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
          playsInline
        />

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 flex items-center gap-2 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-red-600 px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest text-white shadow-lg animate-pulse">
            LIVE
          </div>
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 hidden sm:block">
            <span className="text-white text-xs font-semibold">BOA FM TV</span>
          </div>
        </div>

        {/* Play Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer" onClick={togglePlay}>
            <div className="bg-indigo-600 p-6 rounded-full shadow-2xl transform hover:scale-110 transition-transform active:scale-95">
              <Play fill="white" className="text-white w-10 h-10 ml-1" />
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex items-center justify-between">
            <button onClick={togglePlay} className="text-white bg-white/10 p-2.5 rounded-full hover:bg-white/20">
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <div className="flex items-center gap-2 sm:gap-4">
               <button onClick={() => containerRef.current?.requestFullscreen()} className="text-white bg-white/10 p-2.5 rounded-full hover:bg-white/20">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card - Responsive Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600/20 p-3 rounded-xl border border-indigo-500/20">
            <MonitorPlay className="text-indigo-400" size={28} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Canal Digital</p>
            <h2 className="text-white font-bold text-lg sm:text-xl truncate leading-tight">Assista Agora: Boa FM TV</h2>
          </div>
        </div>
        <div className="flex sm:justify-end gap-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5">
            <Share2 size={16} />
            <span className="hidden xs:inline">Compartilhar</span>
          </button>
          <button className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/20">
            Grade Completa
          </button>
        </div>
      </div>
    </div>
  );
};

export default TVPlayer;
