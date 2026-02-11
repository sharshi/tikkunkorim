import React, { useMemo, useRef } from 'react';
import { Line } from '../../types';
import { processHebrewText, misparim, aliyot } from '../../utils/hebrewUtils';
import './TextLine.css';

interface TextLineProps {
  line: Line;
  showNikud: boolean;
  wordGap: number;
}

export const TextLine: React.FC<TextLineProps> = React.memo(({ line, showNikud, wordGap }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const processedFragments = useMemo(() => {
    return processHebrewText(line.fragments, showNikud, wordGap, line.layout);
  }, [line.fragments, showNikud, wordGap, line.layout]);

  return (
    <div
      ref={containerRef}
      className={`text-line hebrew-text ${line.layout}`}
      data-line-number={line.number}
      style={wordGap > 0 ? { wordSpacing: `${wordGap * 2}px` } : undefined}
    >
      {processedFragments.map((fragment, index) => (
        <span
          key={index}
          className="text-fragment"
          dangerouslySetInnerHTML={{ __html: fragment }}
        />
      ))}
      
      {/* Right-side pasuk labels (red Hebrew letters) */}
      {line.meta.length > 0 && (
        <div className="labelright">
          {line.meta.map((metaItem, idx) => 
            metaItem.pasuk ? (
              <div key={idx} className="pasuk">
                {misparim[metaItem.pasuk - 1] || metaItem.pasuk.toString()}
              </div>
            ) : null
          )}
        </div>
      )}
      
      {/* Left-side aliyah labels */}
      {line.aliyot.length > 0 && (
        <div className="labelleft">
          {line.aliyot.map((aliyahNum, idx) => (
            <div key={idx} className="aliya">
              {aliyot[aliyahNum - 1] || aliyahNum.toString()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
