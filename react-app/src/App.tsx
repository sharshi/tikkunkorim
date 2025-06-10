import React, { useState } from 'react';
import './App.css';
import Menu from './components/Menu';
import NavBar from './components/NavBar';
import TextView from './components/TextView';
import Settings from './components/Settings';
import About from './components/About';

// Placeholder types for future data
// TODO: Replace with real data and logic as we migrate
const seforim = ["בראשית", "שמות", "ויקרא", "במדבר", "דברים"];
const aliyanames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שביעי", "מפטיר"];

function App() {
  // State for navigation and overlays
  const [view, setView] = useState<'seforim'|'parshios'|'aliyos'|'text'|'settings'|'about'|'os'|'abt'>('seforim');
  const [selectedSefer, setSelectedSefer] = useState<string|null>(null);
  const [selectedParsha, setSelectedParsha] = useState<string|null>(null);
  const [selectedAliya, setSelectedAliya] = useState<number|null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Navigation logic (to be expanded as we port logic)
  const handleSeferClick = (sefer: string) => {
    setSelectedSefer(sefer);
    setView('parshios');
  };
  const handleParshaClick = (parsha: string) => {
    setSelectedParsha(parsha);
    setView('aliyos');
  };
  const handleAliyaClick = (aliyaIdx: number) => {
    setSelectedAliya(aliyaIdx);
    setView('text');
  };
  const handleBack = () => {
    if (view === 'text') setView('aliyos');
    else if (view === 'aliyos') setView('parshios');
    else if (view === 'parshios') setView('seforim');
    else if (view === 'settings' || view === 'about') setView('seforim');
  };

  // Renderers for each view
  const renderParshios = () => (
    <ul>
      {/* TODO: Replace with real parsha list for selectedSefer */}
      {["פרשה א", "פרשה ב", "פרשה ג"].map(parsha => (
        <li key={parsha} onClick={() => handleParshaClick(parsha)}>{parsha}</li>
      ))}
    </ul>
  );
  const renderAliyos = () => (
    <ul>
      {aliyanames.map((name, idx) => (
        <li key={name} onClick={() => handleAliyaClick(idx+1)}>{name}</li>
      ))}
    </ul>
  );

  return (
    <div className="App">
      {/* Sidebar/Menu */}
      <aside style={{display: view === 'seforim' ? 'block' : 'none'}}>
        <Menu seforim={seforim} onSeferClick={handleSeferClick} />
      </aside>
      <main>
        <NavBar onBack={handleBack} onSettings={() => setShowSettings(true)} onAbout={() => setShowAbout(true)} />

        {view === 'seforim' && <div>Select a Sefer</div>}
        {view === 'parshios' && renderParshios()}
        {view === 'aliyos' && renderAliyos()}
        {view === 'text' && (
          <TextView parsha={selectedParsha} aliya={selectedAliya} onBack={handleBack} />
        )}
      </main>
      {/* Overlays */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </div>
  );
}

export default App;
