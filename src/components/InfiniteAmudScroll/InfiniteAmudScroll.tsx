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
  targetLine?: number; // Add target line for precise scrolling
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

  // Function to scroll to a specific amud and line
  const scrollToAmudAndLine = useCallback((amudNumber: number, lineNumber?: number) => {
    if (!containerRef.current) return;

    // Clear any existing scroll timeout
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Set scrolling flag to prevent intersection observer interference
    isScrollingRef.current = true;

    // Find the target amud element
    const amudElement = containerRef.current.querySelector(`[data-amud="${amudNumber}"]`);
    if (!amudElement) {
      console.log('Amud element not found:', amudNumber);
      isScrollingRef.current = false;
      return;
    }

    let targetElement = amudElement;

    // If a specific line is requested, find that line within the amud
    if (lineNumber) {
      const lineElement = amudElement.querySelector(`[data-line="${lineNumber}"]`);
      if (lineElement) {
        targetElement = lineElement;
        console.log('Scrolling to amud', amudNumber, 'line', lineNumber);
      } else {
        console.log('Line not found, scrolling to amud start:', lineNumber);
      }
    }

    // Scroll to the target element immediately for fast navigation
    targetElement.scrollIntoView({
      behavior: 'auto', // Changed from 'smooth' to 'auto' for instant navigation
      block: 'center',
      inline: 'nearest'
    });

    // Reset scrolling flag after a short delay
    scrollTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  }, []);

  // Effect to handle scrolling when currentAmud or targetLine changes
  useEffect(() => {
    if (currentAmud && data.length > 0) {
      // Use requestAnimationFrame for better performance
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
        // Don't trigger amud changes if we're currently scrolling programmatically
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
      ))}
    </div>
  );
};
