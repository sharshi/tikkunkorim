import { useEffect, useRef, MutableRefObject } from 'react';
import { ParshaLocation } from '../utils/navigationUtils';

interface UseHashRouterOptions {
  currentAmud: number;
  currentParsha?: ParshaLocation;
  isLoading: boolean;
  navigateAmud: (direction: 'next' | 'prev' | number) => void;
  navigateToParsha: (sefer: string, parsha: string, aliya?: number) => void;
  isExplicitNav: MutableRefObject<boolean>;
}

type ParsedHash =
  | { type: 'amud'; amud: number }
  | { type: 'parsha'; sefer: string; parsha: string; aliya?: number }
  | null;

function parseHash(hash: string): ParsedHash {
  const path = hash.replace(/^#\/?/, '');
  if (!path) return null;

  const segments = path.split('/').map(s => decodeURIComponent(s));

  // /#/amud/42
  if (segments[0] === 'amud' && segments[1]) {
    const amud = parseInt(segments[1], 10);
    if (!isNaN(amud) && amud > 0) {
      return { type: 'amud', amud };
    }
    return null;
  }

  // /#/בראשית/נח  or  /#/בראשית/נח/3
  if (segments.length >= 2) {
    const sefer = segments[0];
    const parsha = segments[1];
    const aliya = segments[2] ? parseInt(segments[2], 10) : undefined;
    if (aliya !== undefined && (isNaN(aliya) || aliya < 1 || aliya > 8)) {
      // Invalid aliya number -- treat as parsha without aliya
      return { type: 'parsha', sefer, parsha };
    }
    return { type: 'parsha', sefer, parsha, aliya };
  }

  return null;
}

function buildAmudHash(amud: number): string {
  return `#/amud/${amud}`;
}

function buildParshaHash(parsha: ParshaLocation): string {
  let hash = `#/${parsha.sefer}/${parsha.parsha}`;
  if (parsha.aliya) {
    hash += `/${parsha.aliya}`;
  }
  return hash;
}

export function useHashRouter({
  currentAmud,
  currentParsha,
  isLoading,
  navigateAmud,
  navigateToParsha,
  isExplicitNav,
}: UseHashRouterOptions) {
  const pendingNavigation = useRef<ParsedHash>(null);
  const skipNextSync = useRef(false);
  const programmaticHashChange = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const initialLoadDone = useRef(false);

  // Parse hash on mount and store as pending navigation
  useEffect(() => {
    const parsed = parseHash(window.location.hash);
    if (parsed) {
      pendingNavigation.current = parsed;
    }
  }, []);

  // Apply pending navigation once data finishes loading
  useEffect(() => {
    if (isLoading || initialLoadDone.current) return;
    initialLoadDone.current = true;

    // Skip the next sync regardless -- either we're about to navigate
    // (and the resulting state already matches the hash) or there's no
    // hash and we don't want the initial parsha-detection to write one.
    skipNextSync.current = true;

    const pending = pendingNavigation.current;
    if (!pending) return;
    pendingNavigation.current = null;

    if (pending.type === 'amud') {
      navigateAmud(pending.amud);
    } else {
      navigateToParsha(pending.sefer, pending.parsha, pending.aliya);
    }
  }, [isLoading, navigateAmud, navigateToParsha]);

  // Listen for hashchange (browser back/forward, manual URL edit)
  useEffect(() => {
    const handleHashChange = () => {
      // Ignore hash changes we triggered ourselves
      if (programmaticHashChange.current) {
        programmaticHashChange.current = false;
        return;
      }

      const parsed = parseHash(window.location.hash);
      if (!parsed) return;

      // Prevent the resulting state change from writing back to the hash
      skipNextSync.current = true;

      if (parsed.type === 'amud') {
        navigateAmud(parsed.amud);
      } else {
        navigateToParsha(parsed.sefer, parsed.parsha, parsed.aliya);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [navigateAmud, navigateToParsha]);

  // Sync state changes -> hash
  useEffect(() => {
    if (isLoading || !initialLoadDone.current) return;

    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }

    // Explicit parsha navigation -> create a real history entry
    if (isExplicitNav.current) {
      isExplicitNav.current = false;

      // Cancel any pending debounced replaceState
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      programmaticHashChange.current = true;
      const hash = currentParsha
        ? buildParshaHash(currentParsha)
        : buildAmudHash(currentAmud);
      window.location.hash = hash;
      return;
    }

    // Scroll-driven / amud-only changes -> replaceState with debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      const hash = buildAmudHash(currentAmud);
      history.replaceState(null, '', hash);
    }, 300);
  }, [currentAmud, currentParsha, isLoading, isExplicitNav]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);
}
