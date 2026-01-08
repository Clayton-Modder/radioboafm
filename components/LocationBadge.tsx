
import React, { useState, useEffect } from 'react';
import { MapPin as MapPinIcon, Loader2 as LoaderIcon } from 'lucide-react';
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
        setLocationName("Ouvinte Web");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await ai.models.generateContent({
            model: MODELS.MAPS,
            contents: "Onde eu estou? Responda apenas o nome da Cidade e o Estado de forma curta, por exemplo: Irecê, BA.",
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
          
          const text = response.text || "Irecê, BA";
          setLocationName(text.replace(/Cidade e Estado:|Localização:/gi, '').trim());
        } catch (err) {
          console.error("Maps error details:", err);
          setLocationName("Irecê, BA");
        } finally {
          setLoading(false);
        }
      }, (error) => {
        console.warn("Geolocation permission denied or error:", error);
        setLoading(false);
        setLocationName("Ouvinte Online");
      }, { timeout: 10000 });
    };

    getLocation();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
      <LoaderIcon size={10} className="animate-spin text-indigo-400" />
      <span className="text-[10px] font-bold text-slate-500 uppercase">Detectando...</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
      <MapPinIcon size={12} className="text-indigo-500" />
      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate max-w-[120px]">
        {locationName || "Localização"}
      </span>
    </div>
  );
};

export default LocationBadge;
