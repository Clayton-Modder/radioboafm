
import React, { useState, useEffect } from 'react';
import { Trophy, User, Radio, CheckCircle2, Heart } from 'lucide-react';
import { HOSTS, SCHEDULE } from '../constants';

const PollSection: React.FC = () => {
  const [votedHost, setVotedHost] = useState<string | null>(() => localStorage.getItem('voted_host'));
  const [votedProgram, setVotedProgram] = useState<string | null>(() => localStorage.getItem('voted_program'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVoteHost = (id: string) => {
    if (votedHost) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setVotedHost(id);
      localStorage.setItem('voted_host', id);
      setIsSubmitting(false);
    }, 800);
  };

  const handleVoteProgram = (id: string) => {
    if (votedProgram) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setVotedProgram(id);
      localStorage.setItem('voted_program', id);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30">
          <Trophy className="text-amber-500" size={32} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Troféu Boa FM</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Vote e ajude a escolher os melhores da rede</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Votação Locutor */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <User className="text-indigo-400" size={20} />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Melhor Locutor</h3>
          </div>
          
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-4">
            {HOSTS.map((host) => {
              const selected = votedHost === host.id;
              return (
                <button
                  key={host.id}
                  disabled={votedHost !== null || isSubmitting}
                  onClick={() => handleVoteHost(host.id)}
                  className={`group relative flex flex-col items-center p-4 rounded-3xl border transition-all duration-300 ${
                    selected 
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-lg ring-1 ring-emerald-500/20' 
                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                  } ${votedHost && !selected ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-indigo-500/50 transition-colors">
                    <img src={host.avatar} alt={host.name} className="w-full h-full object-cover" />
                    {selected && (
                      <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center animate-in fade-in duration-300">
                        <CheckCircle2 size={32} className="text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-center text-white line-clamp-1">{host.name}</span>
                  {selected && <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1">Seu Voto</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Votação Programa */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Radio className="text-emerald-400" size={20} />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Melhor Programa</h3>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {SCHEDULE.filter(p => p.host !== 'Governo Federal').map((program) => {
              const selected = votedProgram === program.id;
              return (
                <button
                  key={program.id}
                  disabled={votedProgram !== null || isSubmitting}
                  onClick={() => handleVoteProgram(program.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                    selected 
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-lg' 
                      : 'bg-white/5 border-white/5 hover:border-white/10'
                  } ${votedProgram && !selected ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={program.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white line-clamp-1">{program.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">com {program.host}</p>
                    </div>
                  </div>
                  {selected ? (
                    <div className="flex items-center gap-2 bg-indigo-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                      <Heart size={10} fill="currentColor" />
                      Votado
                    </div>
                  ) : !votedProgram && (
                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                      <div className="w-2 h-2 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PollSection;
