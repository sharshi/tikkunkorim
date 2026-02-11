import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onToggleNikud: () => void;
  onPreviousParsha?: () => void;
  onNextParsha?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = ({
  onPrevious,
  onNext,
  onToggleNikud,
  onPreviousParsha,
  onNextParsha,
  enabled = true
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'h':
          event.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
        case 'l':
          event.preventDefault();
          onNext();
          break;
        case 'ArrowUp':
        case 'k':
          if (onPreviousParsha) {
            event.preventDefault();
            onPreviousParsha();
          }
          break;
        case 'ArrowDown':
        case 'j':
          if (onNextParsha) {
            event.preventDefault();
            onNextParsha();
          }
          break;
        case 'n':
        case 'N':
          event.preventDefault();
          onToggleNikud();
          break;
        case ' ':
          event.preventDefault();
          onToggleNikud();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onPrevious, onNext, onToggleNikud, onPreviousParsha, onNextParsha, enabled]);
};
