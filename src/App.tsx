import React, { useState, useEffect } from 'react';
import { Header, InfiniteAmudScroll, Footer, ParshaNavigation, Toast } from './components';
import { useTikkun } from './hooks/useTikkun';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import './App.css';

function App() {
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
      navigateParshaDirection('prev');
      showNavigationFeedback('פרשה קודמת');
    },
    onNextParsha: () => {
      navigateParshaDirection('next');
      showNavigationFeedback('פרשה הבאה');
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
          console.log('Example: tikkunNav.navigateToParsha("בראשית", "בראשית", 1)');
        }
      };
    }
  }, [navigateToParsha, navigateAmud, navigateParshaDirection, currentParsha, currentAmud]);

  const handleParshaSelect = (sefer: string, parsha: string, aliya?: number) => {
    console.log('Navigating to:', { sefer, parsha, aliya });
    navigateToParsha(sefer, parsha, aliya);
    setIsNavOpen(false); // Close navigation after selection
    
    // Show feedback
    const aliyaText = aliya ? ` עליה ${aliya}` : '';
    showNavigationFeedback(`נווט ל${parsha}${aliyaText}`);
  };

  return (
    <div className="App rtl">
      <ParshaNavigation
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
        onParshaSelect={handleParshaSelect}
        currentSefer={currentParsha?.sefer}
        currentParsha={currentParsha?.parsha}
        currentAliya={currentParsha?.aliya}
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
      <Footer />
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
