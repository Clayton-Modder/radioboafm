
import React, { useMemo } from 'react';
import { Calendar, User, Clock } from 'lucide-react';
import { SCHEDULE } from '../constants.ts';
import { Program } from '../types.ts';

const Schedule: React.FC = () => {
  const currentProgram = useMemo(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return SCHEDULE.find((p) => {
      const [startH, startM] = p.startTime.split(':').map(Number);
      const [endH, endM] = p.endTime.split(':').map(Number);
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;

      if (start < end) {
        return currentTime >= start && currentTime < end;
      } else {
        return currentTime >= start || currentTime < end;
      }
    }) || SCHEDULE[0];
  }, []);

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-indigo-400" />
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Programação Rádio</h2>
        </div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest hidden sm:block">
          Grade Semanal
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SCHEDULE.map((program) => {
          const isActive = program.id === currentProgram?.id;

          return (
            <div 
              key={program.id}
              className={`relative rounded-2xl overflow-hidden transition-all duration-500 group border flex flex-col ${
                isActive 
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-indigo-500/20 shadow-2xl scale-[1.02]' 
                  : 'bg-slate-800/40 border-white/5 hover:border-white/10 hover:bg-slate-800/60'
              }`}
            >
              {isActive && (
                <div className="absolute top-3 left-3 z-10 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  NO AR
                </div>
              )}

              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.name} 
                  className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <Clock size={14} />
                  <span className="text-xs font-bold">{program.startTime} - {program.endTime}</span>
                </div>

                <h3 className={`text-lg font-bold mb-1 leading-tight ${isActive ? 'text-white' : 'text-slate-100'}`}>
                  {program.name}
                </h3>

                <div className="flex items-center gap-2 text-slate-400 mb-4">
                  <User size={14} />
                  <span className="text-xs font-medium">{program.host}</span>
                </div>

                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  {program.description}
                </p>

                <div className="mt-auto pt-4 border-t border-white/5">
                  <button className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}>
                    {isActive ? 'ESTOU OUVINDO' : 'LEMBRE-ME'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Schedule;
