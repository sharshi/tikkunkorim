import React from 'react';

interface SettingsProps {
  onClose: () => void;
  showNikud: boolean;
  setShowNikud: (val: boolean) => void;
  region: 'israel' | 'chul';
  setRegion: (val: 'israel' | 'chul') => void;
  textSize: 'reg' | 'large' | 'xLarge';
  setTextSize: (val: 'reg' | 'large' | 'xLarge') => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, showNikud, setShowNikud, region, setRegion, textSize, setTextSize }) => (
  <div className="modal flex flex-col gap-4">
    <h2>Settings</h2>
    <div>
      <label>
        <input type="checkbox" checked={showNikud} onChange={e => setShowNikud(e.target.checked)} />
        הצג ניקוד
      </label>
    </div>
    <div>
      <label>אזור:</label>
      <select value={region} onChange={e => setRegion(e.target.value as 'israel'|'chul')}>
        <option value="israel">ישראל</option>
        <option value="chul">חו"ל</option>
      </select>
    </div>
    <div>
      <label>גודל טקסט:</label>
      <select value={textSize} onChange={e => setTextSize(e.target.value as 'reg'|'large'|'xLarge')}>
        <option value="reg">רגיל</option>
        <option value="large">גדול</option>
        <option value="xLarge">ענק</option>
      </select>
    </div>
    <button onClick={onClose}>סגור</button>
  </div>
);

export default Settings;
