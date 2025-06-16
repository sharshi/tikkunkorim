import React, { useState } from 'react';
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Card, CardContent } from "./components/ui/card";
import Menu from './components/Menu';
import TextView from './components/TextView';
import Settings from './components/Settings';
import About from './components/About';
import { parshios } from './data/parshios';
import { aliyos } from './data/aliyos';
import { getParshaForDate } from './data/parshaCal';
import './index.css';
import { Info, Settings as SettingsIcon, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const seforim = Object.keys(parshios);
const aliyanames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שביעי", "מפטיר"];

function App() {
  const [view, setView] = useState<'seforim'|'parshios'|'aliyos'|'text'>('seforim');
  const [selectedSefer, setSelectedSefer] = useState<string|null>(null);
  const [selectedParsha, setSelectedParsha] = useState<string|null>(null);
  const [selectedAliya, setSelectedAliya] = useState<number|null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showNikud, setShowNikud] = useState(true);
  const [region, setRegion] = useState<'israel'|'chul'>('israel');
  const [textSize, setTextSize] = useState<'reg'|'large'|'xLarge'>('reg');

  // Navigation logic
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
  };
  const handleNextAliya = () => {
    if (selectedAliya && selectedParsha && aliyos[selectedParsha][selectedAliya + 1]) {
      setSelectedAliya(selectedAliya + 1);
    }
  };
  const handlePrevAliya = () => {
    if (selectedAliya && selectedAliya > 1) {
      setSelectedAliya(selectedAliya - 1);
    }
  };

  // Renderers
  const renderParshios = () => (
    <ul className="space-y-2 text-right">
      {selectedSefer && parshios[selectedSefer].map(parsha => (
        <li key={parsha}>
          <Button variant="ghost" className="w-full justify-start" onClick={() => handleParshaClick(parsha)}>{parsha}</Button>
        </li>
      ))}
    </ul>
  );
  const renderAliyos = () => (
    <ul className="space-y-2 text-right">
      {selectedParsha && aliyos[selectedParsha]
        ? Object.entries(aliyos[selectedParsha]).map(([num]) => (
            <li key={num}>
              <Button variant="ghost" className="w-full justify-start" onClick={() => handleAliyaClick(Number(num))}>{aliyanames[Number(num)-1] || `עליה ${num}`}</Button>
            </li>
          ))
        : aliyanames.map((name, idx) => (
            <li key={name}>
              <Button variant="ghost" className="w-full justify-start" onClick={() => handleAliyaClick(idx+1)}>{name}</Button>
            </li>
          ))}
    </ul>
  );

  // Get today's parsha for banner
  const todayParsha = getParshaForDate(new Date(), region);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav bar / menubar */}
      <div className="flex items-center justify-between p-2 border-b bg-white/80 sticky top-0 z-10">
              <div className="mr-2" style={{ width: 40, height: 40 }} aria-hidden />

        
        <span className="font-bold text-lg">תיקון קוראים</span>
{view !== 'seforim' ? (
          <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack} aria-label="חזור">
            <ArrowRight />
          </Button>
        ) : (
          <div className="mr-2" style={{ width: 40, height: 40 }} aria-hidden />
        )}

      </div>
      {/* Banner for today's parsha */}
      <div className="text-center py-2 text-xl font-bold">פרשת השבוע: {todayParsha || '—'}</div>
      {/* Main content / sidebar + menu */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 max-w-md w-full mx-auto">
        <Card className="w-full mt-4">
          <CardContent className="p-4">
            {view === 'seforim' && (
              <Menu seforim={seforim} onSeferClick={handleSeferClick} />
            )}
            {view === 'parshios' && renderParshios()}
            {view === 'aliyos' && renderAliyos()}
            {view === 'text' && selectedParsha && selectedAliya && (
              <div>
                <div className="flex justify-between mb-2">
                  <Button variant="ghost" size="icon" onClick={handlePrevAliya} disabled={selectedAliya === 1} aria-label="הקודם">
                    <ChevronLeft />
                  </Button>
                  <span className="font-bold">{selectedParsha} - {aliyanames[selectedAliya-1]}</span>
                  <Button variant="ghost" size="icon" onClick={handleNextAliya} disabled={!aliyos[selectedParsha][selectedAliya+1]} aria-label="הבא">
                    <ChevronRight />
                  </Button>
                </div>
                <TextView parsha={selectedParsha} aliya={selectedAliya} onBack={handleBack} showNikud={showNikud} setShowNikud={setShowNikud} textSize={textSize} />
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      {/* Bottombar */}
      <div className="flex items-center justify-between p-2 border-t bg-white/80 sticky bottom-0 z-10">
        <Button variant="ghost" onClick={() => setShowAbout(true)} aria-label="About">
          <Info />
        </Button>
        <Button variant="ghost" onClick={() => setShowSettings(true)} aria-label="Settings">
          <SettingsIcon />
        </Button>
      </div>
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הגדרות</DialogTitle>
          </DialogHeader>
          <Settings 
            onClose={() => setShowSettings(false)} 
            showNikud={showNikud}
            setShowNikud={setShowNikud}
            region={region}
            setRegion={setRegion}
            textSize={textSize}
            setTextSize={setTextSize}
          />
        </DialogContent>
      </Dialog>
      {/* About Dialog */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>אודות</DialogTitle>
          </DialogHeader>
          <About onClose={() => setShowAbout(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
