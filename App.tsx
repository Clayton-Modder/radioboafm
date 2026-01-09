
import React, { useState, useEffect } from 'react';
import RadioPlayer from './components/RadioPlayer';
import TVPlayer from './components/TVPlayer';
import Schedule from './components/Schedule';
import CommunityChat from './components/CommunityChat';
import PollSection from './components/PollSection';
import AIAssistant from './components/AIAssistant';
import { SCHEDULE } from './constants';

const App: React.FC = () => {
  const [currentProgram, setCurrentProgram] = useState(SCHEDULE[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    const updateTime = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const found = SCHEDULE.find((p) => {
        const [startH, startM] = p.startTime.split(':').map(Number);
        const [endH, endM] = p.endTime.split(':').map(Number);
        const start = startH * 60 + startM;
        const end = endH * 60 + endM;
        return start < end ? (currentTime >= start && currentTime < end) : (currentTime >= start || currentTime < end);
      });
      if (found) setCurrentProgram(found);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[9999]">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-indigo-400 font-black tracking-[0.2em] uppercase text-sm animate-pulse">BOA FM IRECÊ</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      {/* Header Fixo com Radio Player */}
      <RadioPlayer currentProgramName={currentProgram.name} />

      {/* Conteúdo Principal */}
      <main className="flex-1 animate-in fade-in duration-1000 slide-in-from-bottom-4 pt-4">
        <TVPlayer currentProgramName={currentProgram.name} />
        <Schedule />
        
        {/* Nova Seção de Votação */}
        <PollSection />
      </main>

      {/* Assistente IA Flutuante */}
      <AIAssistant />

      {/* Chat da Comunidade Flutuante */}
      <CommunityChat currentProgram={currentProgram.name} />

      {/* Footer Profissional */}
      <footer className="bg-slate-950 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-black text-white tracking-tighter italic">BOA FM IRECÊ</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                A rádio que conecta você com a melhor música, notícias e entretenimento de Irecê e toda a região.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <a href="#" className="hover:text-indigo-400">Sobre nós</a>
              <a href="#" className="hover:text-indigo-400">Anuncie</a>
              <a href="#" className="hover:text-indigo-400">Contato</a>
              <a href="#" className="hover:text-indigo-400">Privacidade</a>
            </div>

            <div className="text-center md:text-right space-y-2">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Siga-nos</p>
              <div className="flex justify-center md:justify-end gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 transition-colors cursor-pointer">
                  <span className="text-white text-xs font-bold">IG</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-colors cursor-pointer">
                  <span className="text-white text-xs font-bold">FB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em]">
              © 2024 REDE BOA DE COMUNICAÇÃO - IRECÊ/BA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
