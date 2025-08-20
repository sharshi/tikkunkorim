import React from 'react';
import { Header, AmudDisplay, Footer } from './components';
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
    getCurrentAmudData
  } = useTikkun();

  // Add keyboard navigation
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
      <AmudDisplay
        amud={currentAmudData}
        showNikud={showNikud}
        wordGap={wordGap}
        isLoading={isLoading}
      />
      <Footer />
    </div>
  );
}

export default App;
