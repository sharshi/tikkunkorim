import React from 'react';

interface MenuProps {
  seforim: string[];
  onSeferClick: (sefer: string) => void;
}

const Menu: React.FC<MenuProps> = ({ seforim, onSeferClick }) => (
  <ul>
    {seforim.map(sefer => (
      <li key={sefer} onClick={() => onSeferClick(sefer)}>{sefer}</li>
    ))}
  </ul>
);

export default Menu;
