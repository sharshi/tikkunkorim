import React from 'react';
import { Amud } from '../../types';
import { TextLine } from '../TextLine/TextLine';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { useLanguage } from '../../i18n';
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
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="amud-display loading">
        <LoadingSpinner message={t.loadingPage} size="large" />
      </div>
    );
  }

  if (!amud) {
    return (
      <div className="amud-display error">
        <div className="error-message">{t.pageNotFound}</div>
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
