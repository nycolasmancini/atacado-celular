"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface TrackingData {
  sessionId: string;
  whatsapp?: string;
  timeOnSite: number;
  pagesVisited: string[];
  productsViewed: number[];
  searches: string[];
  kitInterest?: string;
}

interface TrackingContextType {
  trackingData: TrackingData;
  trackEvent: (type: string, data?: any) => void;
  trackCustomEvent: (name: string, data?: any) => void;
  updateTrackingData: (updates: Partial<TrackingData>) => void;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [trackingData, setTrackingData] = useState<TrackingData>({
    sessionId: "",
    timeOnSite: 0,
    pagesVisited: [],
    productsViewed: [],
    searches: [],
  });

  const [sessionStart] = useState(Date.now());

  // Inicializar sessionId
  useEffect(() => {
    let sessionId = localStorage.getItem('session_id');
    
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('session_id', sessionId);
    }

    setTrackingData(prev => ({
      ...prev,
      sessionId,
    }));

    // Recuperar WhatsApp se disponível
    const whatsapp = localStorage.getItem('whatsapp');
    if (whatsapp) {
      setTrackingData(prev => ({
        ...prev,
        whatsapp,
      }));
    }
  }, []);

  // Atualizar tempo no site a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const timeOnSite = Date.now() - sessionStart;
      setTrackingData(prev => ({
        ...prev,
        timeOnSite,
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [sessionStart]);

  // Track page views automaticamente
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    setTrackingData(prev => ({
      ...prev,
      pagesVisited: [...new Set([...prev.pagesVisited, currentPath])],
    }));

    // Log para desenvolvimento (substitui Meta Pixel por enquanto)
    console.log('Page View:', currentPath);
  }, []);

  const trackEvent = (type: string, data?: any) => {
    try {
      // Log para desenvolvimento (substitui Meta Pixel por enquanto)
      console.log('Track Event:', type, {
        ...data,
        session_id: trackingData.sessionId,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Erro ao disparar evento:', error);
    }
  };

  const trackCustomEvent = (name: string, data?: any) => {
    try {
      // Log para desenvolvimento (substitui Meta Pixel por enquanto)
      console.log('Track Custom Event:', name, {
        ...data,
        session_id: trackingData.sessionId,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Erro ao disparar evento customizado:', error);
    }
  };

  const updateTrackingData = (updates: Partial<TrackingData>) => {
    setTrackingData(prev => ({
      ...prev,
      ...updates,
    }));

    // Salvar WhatsApp no localStorage se fornecido
    if (updates.whatsapp) {
      localStorage.setItem('whatsapp', updates.whatsapp);
    }
  };

  // Salvar dados importantes no localStorage antes do usuário sair
  useEffect(() => {
    const handleBeforeUnload = () => {
      const finalTimeOnSite = Date.now() - sessionStart;
      
      // Evento de tempo no site
      trackCustomEvent('TimeOnSite', {
        duration_ms: finalTimeOnSite,
        duration_seconds: Math.floor(finalTimeOnSite / 1000),
        pages_visited: trackingData.pagesVisited.length,
        products_viewed: trackingData.productsViewed.length,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionStart, trackingData]);

  const value: TrackingContextType = {
    trackingData,
    trackEvent,
    trackCustomEvent,
    updateTrackingData,
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  
  return context;
}