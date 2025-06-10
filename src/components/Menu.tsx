import React from 'react';
import { Button } from "./ui/button";

interface MenuProps {
  seforim: string[];
  onSeferClick: (sefer: string) => void;
}

const Menu: React.FC<MenuProps> = ({ seforim, onSeferClick }) => (
  <ul className="space-y-2 text-right">
    {seforim.map(sefer => (
      <li key={sefer}>
        <Button variant="ghost" className="w-full justify-start" onClick={() => onSeferClick(sefer)}>{sefer}</Button>
      </li>
    ))}
  </ul>
);

export default Menu;
