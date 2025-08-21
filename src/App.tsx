import React from 'react';
import { Header, InfiniteAmudScroll, Footer } from './components';
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

  // Add keyboard navigation - simple navigation without auto-scroll
  useKeyboardNavigation({
    onPrevious: () => navigateAmud('prev'),
    onNext: () => navigateAmud('next'),
    onToggleNikud: toggleNikud,
    enabled: !isLoading
  });

  const currentAmudData = getCurrentAmudData();

  return (
    <div className="App rtl">
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
