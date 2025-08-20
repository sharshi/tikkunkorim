import React from 'react';
import { Amud } from '../../types';
import { TextLine } from '../TextLine/TextLine';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import './AmudDisplay.css';

interface AmudDisplayProps {
  amud: Amud | null;
  showNikud: boolean;
  wordGap: number;
  isLoading: boolean;
}

export const AmudDisplay: React.FC<AmudDisplayProps> = ({
  amud,
  showNikud,
  wordGap,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="amud-display loading">
        <LoadingSpinner message="טוען עמוד..." size="large" />
      </div>
    );
  }

  if (!amud) {
    return (
      <div className="amud-display error">
        <div className="error-message">לא נמצא עמוד זה</div>
      </div>
    );
  }

  return (
    <div className="amud-display" data-amud={amud.amud}>
      <div className="amud-content">
        {amud.lines.map((line) => (
          <TextLine
            key={line.number}
            line={line}
            showNikud={showNikud}
            wordGap={amud.amud === 78 ? 0 : wordGap}
          />
        ))}
      </div>
    </div>
  );
};
