
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Brain, Zap, MapPin, Image as ImageIcon, X, MessageSquare, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { MODELS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'fast' | 'thinking'>('fast');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string; image?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = { role: 'user' as const, content: input, image: selectedImage || undefined };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';
      let generatedImage = '';

      if (selectedImage && (input.toLowerCase().includes('filtro') || input.toLowerCase().includes('remover') || input.toLowerCase().includes('adicionar') || input.toLowerCase().includes('editar'))) {
        // Nano Banana powered image editing
        const response = await ai.models.generateContent({
          model: MODELS.IMAGE,
          contents: {
            parts: [
              { inlineData: { data: selectedImage.split(',')[1], mimeType: 'image/png' } },
              { text: input }
            ]
          }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            generatedImage = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            responseText += part.text;
          }
        }
        setSelectedImage(null);
      } else {
        // Text/Maps response
        const coords = await new Promise<GeolocationCoordinates | null>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            () => resolve(null),
            { timeout: 5000 }
          );
        });

        const isThinking = mode === 'thinking';
        const modelName = isThinking ? MODELS.THINKING : MODELS.MAPS;
        
        const config: any = {
          systemInstruction: "Você é o assistente virtual da Boa FM Irecê. Seja amigável e prestativo. Se perguntarem sobre locais, use o Maps.",
        };

        if (isThinking) {
          config.thinkingConfig = { thinkingBudget: 32768 };
        } else {
          config.tools = [{ googleMaps: {} }];
          if (coords) {
            config.toolConfig = {
              retrievalConfig: {
                latLng: { latitude: coords.latitude, longitude: coords.longitude }
              }
            };
          }
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: input,
          config
        });

        responseText = response.text || "Desculpe, não consegui processar sua mensagem agora.";
      }

      setMessages(prev => [...prev, { role: 'bot', content: responseText, image: generatedImage || undefined }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', content: "Ocorreu um erro ao processar sua solicitação. Tente novamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[110] w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <Sparkles className="group-hover:animate-spin-slow" />
      </button>

      {/* Assistant Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 z-[120] glass border-l border-white/10 transition-transform duration-500 shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <MessageSquare size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Boa AI Assistant</h3>
              <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Inteligência Artificial</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-2 bg-slate-950/50 flex gap-2">
          <button 
            onClick={() => setMode('fast')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${mode === 'fast' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}
          >
            <Zap size={12} /> Rápido
          </button>
          <button 
            onClick={() => setMode('thinking')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${mode === 'thinking' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}
          >
            <Brain size={12} /> Pensar
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="mx-auto text-indigo-500/50 mb-4" size={40} />
              <p className="text-xs text-slate-400 px-8">
                Olá! Eu sou o assistente da Boa FM. Me pergunte sobre locais próximos, notícias ou me envie uma foto para aplicar filtros inteligentes!
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'}`}>
                {m.image && (
                  <img src={m.image} alt="Upload" className="rounded-lg mb-2 max-w-full border border-white/10" />
                )}
                <p>{m.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-2">
                <Loader2 className="animate-spin text-indigo-400" size={14} />
                <span className="text-[10px] text-slate-400 font-bold uppercase animate-pulse">
                  {mode === 'thinking' ? 'Pensando profundamente...' : 'Gerando resposta...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 space-y-3 bg-slate-900/50">
          {selectedImage && (
            <div className="relative inline-block">
              <img src={selectedImage} className="w-16 h-16 object-cover rounded-lg border border-indigo-500" alt="Selected" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5">
                <X size={12} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer p-2 text-slate-400 hover:text-indigo-400 transition-colors">
              <ImageIcon size={20} />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
