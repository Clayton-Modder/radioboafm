
import React, { useMemo } from 'react';
import { Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { SCHEDULE } from '../constants';

const Schedule: React.FC = () => {
  const currentProgram = useMemo(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    return SCHEDULE.find((p) => {
      const [startH, startM] = p.startTime.split(':').map(Number);
      const [endH, endM] = p.endTime.split(':').map(Number);
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;
      return start < end ? (currentTime >= start && currentTime < end) : (currentTime >= start || currentTime < end);
    }) || SCHEDULE[0];
  }, []);

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/10 rounded-lg">
            <Calendar className="text-indigo-400" size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">Programação</h2>
        </div>
        <div className="h-px bg-white/10 flex-1 mx-4 hidden md:block"></div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
          Grade Semanal
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {SCHEDULE.map((program) => {
          const isActive = program.id === currentProgram?.id;
          return (
            <div 
              key={program.id}
              className={`flex flex-col rounded-2xl overflow-hidden transition-all duration-300 border ${
                isActive 
                  ? 'bg-indigo-600/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/30' 
                  : 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-900/60'
              }`}
            >
              <div className="relative aspect-[16/10] sm:aspect-video overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.name} 
                  className={`w-full h-full object-cover transform transition-transform duration-700 ${isActive ? 'scale-110' : 'hover:scale-110'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                
                {isActive && (
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-indigo-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-xl ring-2 ring-white/20">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    NO AR
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-indigo-400 text-[11px] font-black uppercase tracking-widest mb-2">
                  <Clock size={12} strokeWidth={3} />
                  <span>{program.startTime} - {program.endTime}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-1 line-clamp-1 leading-tight group-hover:text-indigo-400 transition-colors">
                  {program.name}
                </h3>

                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <User size={12} />
                  <span className="text-xs font-medium truncate">{program.host}</span>
                </div>

                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4 flex-1">
                  {program.description}
                </p>

                <button className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}>
                  {isActive ? 'Ouvindo Agora' : 'Programação'}
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Schedule;
