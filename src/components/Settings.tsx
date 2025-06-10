import React from 'react';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => (
  <div className="modal">
    <h2>Settings</h2>
    {/* TODO: Add text size and location controls */}
    <button onClick={onClose}>Close</button>
  </div>
);

export default Settings;
