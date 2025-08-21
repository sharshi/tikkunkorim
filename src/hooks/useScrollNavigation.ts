import { useState, useCallback } from 'react';

export const useScrollNavigation = () => {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  const navigateWithAutoScroll = useCallback((direction: 'next' | 'prev' | number, navigateAmud: (direction: 'next' | 'prev' | number) => void) => {
    setShouldAutoScroll(true);
    navigateAmud(direction);
    
    // Reset auto-scroll flag after a short delay
    setTimeout(() => {
      setShouldAutoScroll(false);
    }, 100);
  }, []);

  return {
    shouldAutoScroll,
    navigateWithAutoScroll
  };
};
