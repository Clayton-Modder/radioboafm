
import React, { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { MODELS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const LocationBadge: React.FC = () => {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      if (!navigator.geolocation) {
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await ai.models.generateContent({
            model: MODELS.MAPS,
            contents: "Onde eu estou? Me diga apenas o nome da Cidade e Estado.",
            config: {
              tools: [{ googleMaps: {} }],
              toolConfig: {
                retrievalConfig: {
                  latLng: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                  }
                }
              }
            }
          });
          
          setLocationName(response.text?.replace('Cidade e Estado:', '').trim() || "Localização desconhecida");
        } catch (err) {
          console.error("Maps error:", err);
          setLocationName("Região de Irecê");
        } finally {
          setLoading(false);
        }
      }, () => {
        setLoading(false);
        setLocationName("Ouvinte Online");
      });
    };

    getLocation();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
      <Loader2 size={10} className="animate-spin text-indigo-400" />
      <span className="text-[10px] font-bold text-slate-500 uppercase">Detectando...</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
      <MapPin size={12} className="text-indigo-500" />
      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate max-w-[120px]">
        {locationName || "Localização"}
      </span>
    </div>
  );
};

export default LocationBadge;
