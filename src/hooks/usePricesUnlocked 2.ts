"use client";

import { useState, useEffect, useCallback } from "react";
import { event, MetaEvents } from "@/lib/meta-pixel";

export function usePricesUnlocked() {
  const [pricesUnlocked, setPricesUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar status dos preços no localStorage
  const checkPricesUnlocked = useCallback(() => {
    const unlocked = localStorage.getItem('prices_unlocked');
    const expires = localStorage.getItem('unlock_expires');
    
    if (!unlocked || !expires) {
      return false;
    }
    
    // Verificar se expirou (7 dias)
    if (Date.now() > parseInt(expires)) {
      localStorage.removeItem('prices_unlocked');
      localStorage.removeItem('unlock_expires');
      return false;
    }
    
    return true;
  }, []);

  // Liberar preços
  const unlockPrices = useCallback((whatsapp: string) => {
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 dias
    
    localStorage.setItem('prices_unlocked', 'true');
    localStorage.setItem('unlock_expires', expiresAt.toString());
    localStorage.setItem('whatsapp', whatsapp);
    
    setPricesUnlocked(true);
    
    // Disparar evento Meta Pixel
    event(MetaEvents.COMPLETE_REGISTRATION, {
      content_name: 'Prices Unlocked',
      status: true,
      value: 0.0,
      currency: 'BRL'
    });
  }, []);

  // Verificar status inicial e configurar listener
  useEffect(() => {
    const checkStatus = () => {
      const status = checkPricesUnlocked();
      setPricesUnlocked(status);
      setIsLoading(false);
    };

    checkStatus();

    // Listener para mudanças no localStorage (entre abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'prices_unlocked' || e.key === 'unlock_expires') {
        checkStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkPricesUnlocked]);

  return {
    pricesUnlocked,
    isLoading,
    unlockPrices,
    checkPricesUnlocked,
  };
}