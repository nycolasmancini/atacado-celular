"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUserJourneyTracking } from "../hooks/useUserJourneyTracking";

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
  sessionId: string;
  trackEvent: (type: string, data?: any) => void;
  trackCustomEvent: (name: string, data?: any) => void;
  updateTrackingData: (updates: Partial<TrackingData>) => void;
  // Funções do novo sistema de tracking de jornada
  trackProductView: (product: { id: number, name: string, price: number }) => { onLeave: () => void };
  trackSearch: (query: string) => void;
  trackCartAction: (action: 'add' | 'remove' | 'update', item: any) => void;
  trackWhatsAppProvided: (phoneNumber: string) => void;
  trackOrderCompleted: () => void;
  getJourneyData: () => any;
  getCurrentScore: () => number;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData>({
    sessionId: "",
    timeOnSite: 0,
    pagesVisited: [],
    productsViewed: [],
    searches: [],
  });

  const [sessionStart] = useState(Date.now());
  
  // Integração com o novo sistema de tracking de jornada - temporariamente desabilitado
  // const journeyTracking = useUserJourneyTracking();

  // Inicializar sessionId
  useEffect(() => {
    // Only run on client side to avoid hydration issues
    if (typeof window === 'undefined') return;
    
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

    setIsInitialized(true);
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
    // Only run on client side and when initialized
    if (typeof window === 'undefined' || !isInitialized) return;
    
    const currentPath = window.location.pathname;
    
    setTrackingData(prev => ({
      ...prev,
      pagesVisited: [...new Set([...prev.pagesVisited, currentPath])],
    }));

    // Integrar com o novo sistema de tracking - temporariamente desabilitado
    // journeyTracking.trackPageView(currentPath);

    // Log para desenvolvimento (substitui Meta Pixel por enquanto)
    console.log('Page View:', currentPath);
  }, [isInitialized]); // Removido journeyTracking das dependências

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
    sessionId: trackingData.sessionId,
    trackEvent,
    trackCustomEvent,
    updateTrackingData,
    // Integração com o novo sistema de tracking de jornada - temporariamente desabilitado
    trackProductView: () => ({ onLeave: () => {} }),
    trackSearch: () => {},
    trackCartAction: () => {},
    trackWhatsAppProvided: () => {},
    trackOrderCompleted: () => {},
    getJourneyData: () => ({}),
    getCurrentScore: () => 0,
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
    // Only show warning on client side to avoid hydration issues
    if (typeof window !== 'undefined') {
      console.warn('useTracking called outside TrackingProvider - tracking will be disabled');
    }
    // Return a mock implementation for compatibility
    return {
      trackingData: {
        sessionId: "",
        timeOnSite: 0,
        pagesVisited: [],
        productsViewed: [],
        searches: [],
      },
      sessionId: "",
      trackEvent: () => {},
      trackCustomEvent: () => {},
      updateTrackingData: () => {},
      trackProductView: () => ({ onLeave: () => {} }),
      trackSearch: () => {},
      trackCartAction: () => {},
      trackWhatsAppProvided: () => {},
      trackOrderCompleted: () => {},
      getJourneyData: () => ({}),
      getCurrentScore: () => 0,
    };
  }
  
  return context;
}