import { useState, useEffect, useCallback } from 'react';
import { Amud } from '../types';
// We'll lazy load the data to avoid importing a huge file immediately
// import { tikkunData } from '../data/fullTikkunData';

export interface TikkunState {
  currentAmud: number;
  showNikud: boolean;
  wordGap: number;
  data: Amud[];
  isLoading: boolean;
}

export const useTikkun = () => {
  const [state, setState] = useState<TikkunState>({
    currentAmud: 1,
    showNikud: true,
  wordGap: 6, // legacy default maxGap
    data: [],
    isLoading: true
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load the sample data
        const { tikkunData } = await import('../data/tikkunData');
        setState(prev => ({ 
          ...prev, 
          data: tikkunData, 
          isLoading: false 
        }));
      } catch (error) {
        console.error('Failed to load Tikkun data:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, []);

  const navigateAmud = useCallback((direction: 'next' | 'prev' | number) => {
    setState(prev => {
      let newAmud = prev.currentAmud;
      
      if (direction === 'next') {
        newAmud = Math.min(prev.currentAmud + 1, prev.data.length);
      } else if (direction === 'prev') {
        newAmud = Math.max(prev.currentAmud - 1, 1);
      } else if (typeof direction === 'number') {
        newAmud = Math.max(1, Math.min(direction, prev.data.length));
      }
      
      return { ...prev, currentAmud: newAmud };
    });
  }, []);

  const toggleNikud = useCallback(() => {
    setState(prev => ({ ...prev, showNikud: !prev.showNikud }));
  }, []);

  const adjustWordGap = useCallback((change: number) => {
    setState(prev => ({
      ...prev,
  wordGap: Math.max(1, Math.min(6, prev.wordGap + change)) // legacy min = 1
    }));
  }, []);

  const getCurrentAmudData = useCallback((): Amud | null => {
    const amudData = state.data.find(amud => amud.amud === state.currentAmud);
    return amudData || null;
  }, [state.data, state.currentAmud]);

  return {
    ...state,
    navigateAmud,
    toggleNikud,
    adjustWordGap,
    getCurrentAmudData,
    totalAmudim: state.data.length,
    data: state.data // Expose data for infinite scroll
  };
};
