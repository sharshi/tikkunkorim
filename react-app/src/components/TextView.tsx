import React from 'react';

interface TextViewProps {
  parsha: string | null;
  aliya: number | null;
  onBack: () => void;
}

const TextView: React.FC<TextViewProps> = ({ parsha, aliya, onBack }) => (
  <div>
    <h2>Text View</h2>
    {/* TODO: Render actual text for selectedParsha and selectedAliya */}
    <p>Parsha: {parsha}, Aliya: {aliya}</p>
    <button onClick={onBack}>Back</button>
  </div>
);

export default TextView;
