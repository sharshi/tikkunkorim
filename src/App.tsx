import React, { useState } from 'react';
import { Header, InfiniteAmudScroll, Footer, ParshaNavigation } from './components';
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
    navigateAmud,
    toggleNikud,
    adjustWordGap,
    getCurrentAmudData,
    data
  } = useTikkun();

  const [isNavOpen, setIsNavOpen] = useState(false);

  // Add keyboard navigation - simple navigation without auto-scroll
  useKeyboardNavigation({
    onPrevious: () => navigateAmud('prev'),
    onNext: () => navigateAmud('next'),
    onToggleNikud: toggleNikud,
    enabled: !isLoading
  });

  const currentAmudData = getCurrentAmudData();

  const handleParshaSelect = (sefer: string, parsha: string, aliya?: number) => {
    // This is where you would implement the logic to navigate to a specific parsha/aliya
    // For now, we'll just log the selection
    console.log('Selected:', { sefer, parsha, aliya });
    
    // You could extend the useTikkun hook to support parsha navigation
    // For example: navigateToParsha(sefer, parsha, aliya);
  };

  return (
    <div className="App rtl">
      <ParshaNavigation
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
        onParshaSelect={handleParshaSelect}
        currentSefer="בראשית" // You could track this in your state
        currentParsha="בראשית" // You could track this in your state
        currentAliya={1} // You could track this in your state
      />
      <Header
        currentAmud={currentAmud}
        totalAmudim={totalAmudim}
        showNikud={showNikud}
        wordGap={wordGap}
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
        onAmudChange={(amud) => navigateAmud(amud)}
      />
      <Footer />
    </div>
  );
}

export default App;
