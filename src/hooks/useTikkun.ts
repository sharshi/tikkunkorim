import { useState, useEffect, useCallback } from 'react';
import { Amud } from '../types';
import { 
  findAmudForParshaAliya, 
  getCurrentParshaFromAmud, 
  getNextParshaAliya,
  ParshaLocation 
} from '../utils/navigationUtils';
// We'll lazy load the data to avoid importing a huge file immediately
// import { tikkunData } from '../data/fullTikkunData';

export interface TikkunState {
  currentAmud: number;
  targetLine?: number; // Add target line for precise scrolling
  showNikud: boolean;
  wordGap: number;
  data: Amud[];
  isLoading: boolean;
  currentParsha?: ParshaLocation;
}

export const useTikkun = () => {
  const [state, setState] = useState<TikkunState>({
    currentAmud: 1,
    targetLine: undefined,
    showNikud: true,
  wordGap: 6, // legacy default maxGap
    data: [],
    isLoading: true,
    currentParsha: undefined
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

  // Update current parsha when data loads or amud changes
  useEffect(() => {
    if (state.data.length > 0 && !state.currentParsha) {
      console.log('Detecting initial parsha for amud:', state.currentAmud);
      const initialParsha = getCurrentParshaFromAmud(state.data, state.currentAmud);
      console.log('Initial parsha detected:', initialParsha);
      if (initialParsha) {
        setState(prev => ({
          ...prev,
          currentParsha: initialParsha
        }));
      }
    }
  }, [state.data, state.currentAmud, state.currentParsha]);

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
      
      // Update current parsha when amud changes
      const newParsha = getCurrentParshaFromAmud(prev.data, newAmud);
      
      return { 
        ...prev, 
        currentAmud: newAmud,
        targetLine: undefined, // Clear target line for regular amud navigation
        currentParsha: newParsha || prev.currentParsha
      };
    });
  }, []);

  const navigateToParsha = useCallback((sefer: string, parsha: string, aliya?: number) => {
    setState(prev => {
      console.log('Attempting to navigate to:', { sefer, parsha, aliya });
      const location = findAmudForParshaAliya(prev.data, sefer, parsha, aliya);
      console.log('Found location:', location);
      
      if (location) {
        const newParsha: ParshaLocation = { sefer, parsha, aliya };
        console.log('Navigating to amud:', location.amud, 'line:', location.line);
        return {
          ...prev,
          currentAmud: location.amud,
          targetLine: location.line,
          currentParsha: newParsha
        };
      }
      console.log('Location not found');
      return prev;
    });
  }, []);

  const navigateParshaDirection = useCallback((direction: 'next' | 'prev') => {
    setState(prev => {
      if (!prev.currentParsha) return prev;
      
      const nextParsha = getNextParshaAliya(
        prev.currentParsha.sefer,
        prev.currentParsha.parsha,
        prev.currentParsha.aliya,
        direction
      );
      
      if (nextParsha) {
        const location = findAmudForParshaAliya(prev.data, nextParsha.sefer, nextParsha.parsha, nextParsha.aliya);
        if (location) {
          return {
            ...prev,
            currentAmud: location.amud,
            currentParsha: nextParsha
          };
        }
      }
      
      return prev;
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
    navigateToParsha,
    navigateParshaDirection,
    toggleNikud,
    adjustWordGap,
    getCurrentAmudData,
    totalAmudim: state.data.length,
    data: state.data // Expose data for infinite scroll
  };
};
