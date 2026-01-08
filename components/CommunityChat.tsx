
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Users, Smile, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { MODELS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
  isMe: boolean;
  isStaff?: boolean;
}

interface CommunityChatProps {
  currentProgram: string;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ currentProgram }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState(() => localStorage.getItem('chat_nickname') || '');
  const [isEntering, setIsEntering] = useState(!nickname);
  const [tempNick, setTempNick] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'Moderador Boa', text: 'Bem-vindos ao Chat da Boa FM! 👋', time: 'Agora', isMe: false, isStaff: true },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Simulação de outros ouvintes usando Gemini
  useEffect(() => {
    if (!isOpen) return;

    const simulateListener = async () => {
      try {
        setIsTyping(true);
        const response = await ai.models.generateContent({
          model: MODELS.FAST,
          contents: `Aja como um ouvinte da rádio Boa FM de Irecê, Bahia. 
          O programa atual é "${currentProgram}". 
          Gere uma mensagem curta (máximo 15 palavras) para o chat, sendo muito amigável e entusiasmado. 
          Use gírias leves da Bahia se apropriado. 
          Responda no formato JSON: {"nome": "Nome do Ouvinte", "mensagem": "texto da mensagem"}.`,
          config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text || '{"nome": "Ouvinte", "mensagem": "Bora Boa!"}');
        
        const newMessage: Message = {
          id: Date.now().toString(),
          user: data.nome,
          text: data.mensagem,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false
        };

        setMessages(prev => [...prev.slice(-49), newMessage]);
      } catch (error) {
        console.error("Erro ao simular ouvinte:", error);
      } finally {
        setIsTyping(false);
      }
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.4) simulateListener();
    }, 25000); // Simula uma nova mensagem a cada 25s aprox.

    return () => clearInterval(interval);
  }, [isOpen, currentProgram]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempNick.trim()) {
      setNickname(tempNick.trim());
      localStorage.setItem('chat_nickname', tempNick.trim());
      setIsEntering(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: nickname,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[110] w-14 h-14 bg-indigo-600 text-white rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <MessageCircle className="group-hover:rotate-12" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-[#020617] rounded-full text-[10px] font-black flex items-center justify-center animate-bounce">
          3
        </span>
      </button>

      {/* Painel do Chat */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[350px] z-[1000] glass border-l border-white/10 transition-transform duration-500 shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-indigo-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Chat da Galera</h3>
              <p className="text-[10px] text-indigo-100 font-bold opacity-80">Ao vivo na Boa FM</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {isEntering ? (
          /* Tela de Entrada (Nickname) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-2">
              <User size={40} className="text-indigo-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-2">Como quer ser chamado?</h4>
              <p className="text-slate-400 text-xs">Participe da nossa comunidade e peça sua música favorita!</p>
            </div>
            <form onSubmit={handleJoin} className="w-full space-y-3">
              <input
                autoFocus
                type="text"
                maxLength={15}
                value={tempNick}
                onChange={(e) => setTempNick(e.target.value)}
                placeholder="Seu apelido..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
              >
                Entrar no Chat
              </button>
            </form>
          </div>
        ) : (
          /* Área de Mensagens */
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/20">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${m.isStaff ? 'text-red-400' : m.isMe ? 'text-indigo-400' : 'text-slate-500'}`}>
                      {m.user} {m.isStaff && '✓'}
                    </span>
                    <span className="text-[9px] text-slate-600">{m.time}</span>
                  </div>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    m.isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : m.isStaff 
                        ? 'bg-red-500/10 border border-red-500/30 text-red-100 rounded-tl-none'
                        : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold animate-pulse">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  Alguém está digitando...
                </div>
              )}
            </div>

            {/* Input de Mensagem */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-slate-900/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 text-slate-500 hover:text-indigo-400 transition-colors">
                  <Smile size={20} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Envie um recado..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 active:scale-90 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default CommunityChat;
