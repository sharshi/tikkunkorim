import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Amud } from '../../types';
import { TextLine } from '../TextLine/TextLine';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { useLanguage } from '../../i18n';
import './InfiniteAmudScroll.css';

// Only render amudim within this many pages of the current view.
// 10 pages in each direction = ~21 amudim mounted at a time vs 248.
const RENDER_BUFFER = 10;

interface InfiniteAmudScrollProps {
  currentAmud: number;
  totalAmudim: number;
  showNikud: boolean;
  wordGap: number;
  isLoading: boolean;
  data: Amud[];
  targetLine?: number;
  onAmudChange: (amud: number) => void;
}

export const InfiniteAmudScroll: React.FC<InfiniteAmudScrollProps> = ({
  currentAmud,
  totalAmudim,
  showNikud,
  wordGap,
  isLoading,
  data,
  targetLine,
  onAmudChange
}) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // --- Render window: only mount amudim close to current ---
  const currentIndex = useMemo(
    () => data.findIndex(a => a.amud === currentAmud),
    [data, currentAmud]
  );

  const renderStart = Math.max(0, currentIndex - RENDER_BUFFER);
  const renderEnd = Math.min(data.length, currentIndex + RENDER_BUFFER + 1);

  // Function to scroll to a specific amud and line
  const scrollToAmudAndLine = useCallback((amudNumber: number, lineNumber?: number) => {
    if (!containerRef.current) return;

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    isScrollingRef.current = true;

    const amudElement = containerRef.current.querySelector(`[data-amud="${amudNumber}"]`);
    if (!amudElement) {
      isScrollingRef.current = false;
      return;
    }

    let targetElement = amudElement;

    if (lineNumber) {
      const lineElement = amudElement.querySelector(`[data-line="${lineNumber}"]`);
      if (lineElement) {
        targetElement = lineElement;
      }
    }

    targetElement.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'nearest'
    });

    scrollTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  }, []);

  // Scroll when currentAmud or targetLine changes
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (currentAmud && data.length > 0) {
      // On the first data load, skip scrolling if we're at the default
      // position (amud 1, no target line). We're already there, and
      // scrollIntoView({ block: 'center' }) would nudge the viewport.
      // If the hash router needs a different position, it will trigger
      // a subsequent state change that scrolls correctly.
      if (isInitialRender.current) {
        isInitialRender.current = false;
        if (currentAmud === 1 && !targetLine) return;
      }
      requestAnimationFrame(() => {
        scrollToAmudAndLine(currentAmud, targetLine);
      });
    }
  }, [currentAmud, targetLine, data.length, scrollToAmudAndLine]);

  // Intersection Observer to detect which amud is currently visible
  useEffect(() => {
    if (!containerRef.current || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

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
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0.6]
      }
    );

    const amudElements = containerRef.current.querySelectorAll('[data-amud]');
    amudElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [data, currentAmud, onAmudChange, isLoading]);

  if (isLoading) {
    return (
      <div className="infinite-amud-scroll loading">
        <LoadingSpinner message={t.loadingPages} size="large" />
      </div>
    );
  }

  const hasAmud78 = data.some(amud => amud.amud === 78);

  return (
    <div className={`infinite-amud-scroll ${hasAmud78 ? 'has-amud-78' : ''}`} ref={containerRef}>
      {data.map((amudData, index) => {
        const isInWindow = index >= renderStart && index < renderEnd;

        if (!isInWindow) {
          // Lightweight placeholder — keeps scroll position stable
          return (
            <div
              key={amudData.amud}
              className="amud-placeholder"
              data-amud={amudData.amud}
            />
          );
        }

        return (
          <div
            key={amudData.amud}
            className={`amud-display ${amudData.amud === currentAmud ? 'current' : ''}`}
            data-amud={amudData.amud}
          >
            <div className="amud-content">
              {amudData.lines.map((line) => (
                <div key={line.number} data-line={line.number}>
                  <TextLine
                    line={line}
                    showNikud={showNikud}
                    wordGap={amudData.amud === 78 ? 0 : wordGap}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
