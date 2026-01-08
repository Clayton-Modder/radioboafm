
import React, { useState, useEffect } from 'react';
import RadioPlayer from './components/RadioPlayer.tsx';
import TVPlayer from './components/TVPlayer.tsx';
import Schedule from './components/Schedule.tsx';
import { SCHEDULE } from './constants.ts';

const App: React.FC = () => {
  const [currentProgram, setCurrentProgram] = useState(SCHEDULE[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregador inicial
    const timer = setTimeout(() => setLoading(false), 1500);

    // Atualiza programa atual baseado no horário
    const updateTime = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const found = SCHEDULE.find((p) => {
        const [startH, startM] = p.startTime.split(':').map(Number);
        const [endH, endM] = p.endTime.split(':').map(Number);
        const start = startH * 60 + startM;
        const end = endH * 60 + endM;
        
        if (start < end) {
          return currentTime >= start && currentTime < end;
        } else {
          return currentTime >= start || currentTime < end;
        }
      });

      if (found) setCurrentProgram(found);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Verifica a cada minuto

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[9999]">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(79,70,229,0.5)]"></div>
        <h1 className="text-indigo-400 font-bold tracking-widest uppercase text-sm animate-pulse">BOA FM IRECÊ</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500 selection:text-white">
      {/* Header Fixo com Player de Rádio */}
      <RadioPlayer currentProgramName={currentProgram.name} />

      {/* Conteúdo Principal */}
      <main className="animate-in fade-in duration-700">
        {/* Seção TV */}
        <TVPlayer />

        {/* Seção Programação */}
        <Schedule />
      </main>

      {/* Rodapé */}
      <footer className="bg-slate-900 border-t border-white/5 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">BOA FM IRECÊ</h2>
            <p className="text-slate-400 text-sm max-w-xs">Sua dose diária de informação, entretenimento e música de qualidade em qualquer lugar.</p>
          </div>
          
          <div className="flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">POLÍTICA</a>
            <a href="#" className="hover:text-white transition-colors">TERMOS</a>
            <a href="#" className="hover:text-white transition-colors">CONTATO</a>
            <a href="#" className="hover:text-white transition-colors">ANUNCIE</a>
          </div>

          <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
            © 2024 BOA FM IRECÊ - TODOS OS DIREITOS RESERVADOS
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
