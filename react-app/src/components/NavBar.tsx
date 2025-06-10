import React from 'react';

interface NavBarProps {
  onBack: () => void;
  onSettings: () => void;
  onAbout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onBack, onSettings, onAbout }) => (
  <nav>
    <button onClick={onBack}>Back</button>
    <button onClick={onSettings}>Settings</button>
    <button onClick={onAbout}>About</button>
  </nav>
);

export default NavBar;
