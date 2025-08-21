import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Amud } from '../../types';
import { TextLine } from '../TextLine/TextLine';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import './InfiniteAmudScroll.css';

interface InfiniteAmudScrollProps {
  currentAmud: number;
  totalAmudim: number;
  showNikud: boolean;
  wordGap: number;
  isLoading: boolean;
  data: Amud[];
  onAmudChange: (amud: number) => void;
}

export const InfiniteAmudScroll: React.FC<InfiniteAmudScrollProps> = ({
  currentAmud,
  totalAmudim,
  showNikud,
  wordGap,
  isLoading,
  data,
  onAmudChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect which amud is currently visible
  useEffect(() => {
    if (!containerRef.current || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const amudNumber = parseInt(entry.target.getAttribute('data-amud') || '0');
            if (amudNumber && amudNumber !== currentAmud) {
              onAmudChange(amudNumber);
            }
          }
        });
      },
      {
        root: null, // Use viewport as root
        rootMargin: '-40% 0px -40% 0px', // Only trigger when amud is well centered
        threshold: [0.6]
      }
    );

    // Observe all amud elements
    const amudElements = containerRef.current.querySelectorAll('[data-amud]');
    amudElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [data, currentAmud, onAmudChange, isLoading]);

  if (isLoading) {
    return (
      <div className="infinite-amud-scroll loading">
        <LoadingSpinner message="טוען עמודים..." size="large" />
      </div>
    );
  }

  // Check if amud 78 is in the data to apply special styling
  const hasAmud78 = data.some(amud => amud.amud === 78);

  return (
    <div className={`infinite-amud-scroll ${hasAmud78 ? 'has-amud-78' : ''}`} ref={containerRef}>
      {data.map((amudData) => (
        <div 
          key={amudData.amud} 
          className={`amud-display ${amudData.amud === currentAmud ? 'current' : ''}`}
          data-amud={amudData.amud}
        >
          <div className="amud-content">
            {amudData.lines.map((line) => (
              <TextLine
                key={line.number}
                line={line}
                showNikud={showNikud}
                wordGap={amudData.amud === 78 ? 0 : wordGap}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
