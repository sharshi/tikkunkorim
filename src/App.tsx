import React, { useState, useEffect, useRef } from 'react';
import { Header, InfiniteAmudScroll, ParshaNavigation, Toast } from './components';
import { useTikkun } from './hooks/useTikkun';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useHashRouter } from './hooks/useHashRouter';
import { useLanguage, interpolate } from './i18n';
import './App.css';

function App() {
  const { t, dir } = useLanguage();

  const {
    currentAmud,
    showNikud,
    wordGap,
    isLoading,
    totalAmudim,
    currentParsha,
    targetLine,
    navigateAmud,
    navigateToParsha,
    navigateParshaDirection,
    toggleNikud,
    adjustWordGap,
    getCurrentAmudData,
    data
  } = useTikkun();

  const isExplicitNav = useRef(false);

  useHashRouter({
    currentAmud,
    currentParsha,
    isLoading,
    navigateAmud,
    navigateToParsha,
    isExplicitNav,
  });

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  const showNavigationFeedback = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Add keyboard navigation - simple navigation without auto-scroll
  useKeyboardNavigation({
    onPrevious: () => navigateAmud('prev'),
    onNext: () => navigateAmud('next'),
    onPreviousParsha: () => {
      isExplicitNav.current = true;
      navigateParshaDirection('prev');
      showNavigationFeedback(t.previousParsha);
    },
    onNextParsha: () => {
      isExplicitNav.current = true;
      navigateParshaDirection('next');
      showNavigationFeedback(t.nextParsha);
    },
    onToggleNikud: toggleNikud,
    enabled: !isLoading
  });

  const currentAmudData = getCurrentAmudData();

  // Expose navigation functions to window for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).tikkunNav = {
        navigateToParsha,
        navigateAmud,
        navigateParshaDirection,
        currentParsha,
        currentAmud,
        testNavigation: () => {
          console.log('=== Testing Navigation ===');
          console.log('Current state:', { currentAmud, currentParsha });
          console.log('Available functions: navigateToParsha(sefer, parsha, aliya), navigateAmud(amudNumber), navigateParshaDirection("next"|"prev")');
        }
      };
    }
  }, [navigateToParsha, navigateAmud, navigateParshaDirection, currentParsha, currentAmud]);

  const handleParshaSelect = (sefer: string, parsha: string, aliya?: number) => {
    console.log('Navigating to:', { sefer, parsha, aliya });
    isExplicitNav.current = true;
    navigateToParsha(sefer, parsha, aliya);
    setIsNavOpen(false);

    const message = interpolate(t.navigatedTo, { parsha });
    const aliyaText = aliya ? ` ${interpolate(t.aliya, { n: aliya })}` : '';
    showNavigationFeedback(`${message}${aliyaText}`);
  };

  return (
    <div className="App">
      <ParshaNavigation
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
        onParshaSelect={handleParshaSelect}
        currentSefer={currentParsha?.sefer}
        currentParsha={currentParsha?.parsha}
        currentAliya={currentParsha?.aliya}
        showNikud={showNikud}
        wordGap={wordGap}
        onToggleNikud={toggleNikud}
        onAdjustWordGap={adjustWordGap}
      />
      <Header
        currentAmud={currentAmud}
        totalAmudim={totalAmudim}
        showNikud={showNikud}
        wordGap={wordGap}
        currentParsha={currentParsha}
        onNavigateAmud={navigateAmud}
        onToggleNikud={toggleNikud}
        onAdjustWordGap={adjustWordGap}
      />
      <InfiniteAmudScroll
        currentAmud={currentAmud}
        totalAmudim={totalAmudim}
        showNikud={showNikud}
        wordGap={wordGap}
        isLoading={isLoading}
        data={data}
        targetLine={targetLine}
        onAmudChange={(amud) => navigateAmud(amud)}
      />
      <Toast
        message={toastMessage}
        type="success"
        show={showToast}
        onHide={() => setShowToast(false)}
      />
    </div>
  );
}

export default App;
