
import React, { useMemo, useState, useEffect } from 'react';
import { Calendar, User, Clock, Bell, BellOff, ChevronRight } from 'lucide-react';
import { SCHEDULE } from '../constants';

const Schedule: React.FC = () => {
  const [reminders, setReminders] = useState<string[]>(() => {
    const saved = localStorage.getItem('program_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('program_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

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
          <div className="p-2.5 bg-indigo-600/10 rounded-xl border border-indigo-500/20 shadow-inner">
            <Calendar className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">Programação</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Fique por dentro do que rola na Boa</p>
          </div>
        </div>
        <div className="h-px bg-white/5 flex-1 mx-4 hidden md:block"></div>
        <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-2xl border border-white/5 ring-1 ring-white/5">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">
            {reminders.length} {reminders.length === 1 ? 'Lembrete Ativo' : 'Lembretes Ativos'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {SCHEDULE.map((program) => {
          const isActive = program.id === currentProgram?.id;
          const isReminded = reminders.includes(program.id);
          
          return (
            <div 
              key={program.id}
              className={`flex flex-col rounded-3xl overflow-hidden transition-all duration-500 border relative group ${
                isActive 
                  ? 'bg-indigo-600/10 border-indigo-500/40 shadow-2xl ring-1 ring-indigo-500/20 scale-[1.02] z-10' 
                  : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/60'
              }`}
            >
              {/* Reminder Toggle Button */}
              <button 
                onClick={() => toggleReminder(program.id)}
                className={`absolute top-4 right-4 z-20 p-2.5 rounded-full transition-all active:scale-90 ${
                  isReminded 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-black/40 text-white/60 hover:text-white hover:bg-black/60'
                }`}
                title={isReminded ? "Remover lembrete" : "Me lembrar desta programação"}
              >
                {isReminded ? <Bell size={14} fill="white" /> : <BellOff size={14} />}
              </button>

              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.name} 
                  className={`w-full h-full object-cover transform transition-transform duration-1000 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                
                {isActive && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-indigo-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl ring-2 ring-white/10 animate-in fade-in slide-in-from-left-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    NO AR AGORA
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-3">
                  <Clock size={12} strokeWidth={3} />
                  <span>{program.startTime} - {program.endTime}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 leading-tight group-hover:text-indigo-400 transition-colors">
                  {program.name}
                </h3>

                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <User size={12} />
                  <span className="text-xs font-semibold truncate">{program.host}</span>
                </div>

                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-6 flex-1 italic">
                  "{program.description}"
                </p>

                <button 
                  onClick={() => !isActive && toggleReminder(program.id)}
                  className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-indigo-600/30' 
                      : isReminded
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {isActive ? 'Ouvindo Agora' : isReminded ? 'Lembrete Ativo' : 'Me Lembrar'}
                  <ChevronRight size={14} className={isActive ? 'animate-bounce-x' : ''} />
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
