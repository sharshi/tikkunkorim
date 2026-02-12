import { useEffect, useRef, MutableRefObject } from 'react';
import { ParshaLocation } from '../utils/navigationUtils';
import { parshios } from '../data/parshadata';

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
  | { type: 'parsha'; parsha: string; aliya?: number }
  | null;

// --- Slug maps: Hebrew <-> English for seforim, parshios, aliyos ---

const seferSlugs: [string, string][] = [
  ['בראשית', 'bereishis'],
  ['שמות', 'shemos'],
  ['ויקרא', 'vayikra'],
  ['במדבר', 'bamidbar'],
  ['דברים', 'devarim'],
];

const parshaSlugs: [string, string][] = [
  // Bereishis
  ['בראשית', 'bereishis'],
  ['נח', 'noach'],
  ['לך לך', 'lech-lecha'],
  ['וירא', 'vayeira'],
  ['חיי שרה', 'chayei-sarah'],
  ['תולדות', 'toldos'],
  ['ויצא', 'vayeitzei'],
  ['וישלח', 'vayishlach'],
  ['וישב', 'vayeishev'],
  ['מקץ', 'mikeitz'],
  ['ויגש', 'vayigash'],
  ['ויחי', 'vayechi'],
  // Shemos
  ['שמות', 'shemos'],
  ['וארא', 'vaeira'],
  ['בא', 'bo'],
  ['בשלח', 'beshalach'],
  ['יתרו', 'yisro'],
  ['משפטים', 'mishpatim'],
  ['תרומה', 'terumah'],
  ['תצוה', 'tetzaveh'],
  ['כי תשא', 'ki-sisa'],
  ['ויקהל', 'vayakhel'],
  ['פקודי', 'pekudei'],
  ['ויקהל-פקודי', 'vayakhel-pekudei'],
  // Vayikra
  ['ויקרא', 'vayikra'],
  ['צו', 'tzav'],
  ['שמיני', 'shemini'],
  ['תזריע', 'tazria'],
  ['מצורע', 'metzora'],
  ['תזריע-מצורע', 'tazria-metzora'],
  ['אחרי מות', 'acharei-mos'],
  ['קדושים', 'kedoshim'],
  ['אחרי מות-קדושים', 'acharei-mos-kedoshim'],
  ['אמור', 'emor'],
  ['בהר', 'behar'],
  ['בחקתי', 'bechukosai'],
  ['בהר-בחקתי', 'behar-bechukosai'],
  // Bamidbar
  ['במדבר', 'bamidbar'],
  ['נשא', 'naso'],
  ['בהעלתך', 'behaaloscha'],
  ['שלח', 'shelach'],
  ['קרח', 'korach'],
  ['חקת', 'chukas'],
  ['בלק', 'balak'],
  ['חקת-בלק', 'chukas-balak'],
  ['פנחס', 'pinchas'],
  ['מטות', 'matos'],
  ['מסעי', 'masei'],
  ['מטות-מסעי', 'matos-masei'],
  // Devarim
  ['דברים', 'devarim'],
  ['ואתחנן', 'vaeschanan'],
  ['עקב', 'eikev'],
  ['ראה', 'reeh'],
  ['שופטים', 'shoftim'],
  ['כי תצא', 'ki-seitzei'],
  ['כי תבא', 'ki-savo'],
  ['נצבים', 'nitzavim'],
  ['וילך', 'vayeilech'],
  ['נצבים-וילך', 'nitzavim-vayeilech'],
  ['האזינו', 'haazinu'],
  ['וזאת הברכה', 'vezos-habracha'],
];

const aliyaSlugs: [string, string][] = [
  ['ראשון', 'rishon'],
  ['שני', 'sheini'],
  ['שלישי', 'shlishi'],
  ['רביעי', 'revii'],
  ['חמישי', 'chamishi'],
  ['שישי', 'shishi'],
  ['שביעי', 'shevii'],
  ['מפטיר', 'maftir'],
];

// Build lookup maps in both directions
const hebToSlug = new Map<string, string>();
const slugToHeb = new Map<string, string>();

for (const list of [seferSlugs, parshaSlugs, aliyaSlugs]) {
  for (const [heb, en] of list) {
    hebToSlug.set(heb, en);
    slugToHeb.set(en, heb);
  }
}

// Aliya slug -> 1-based index
const aliyaSlugToIndex = new Map(aliyaSlugs.map(([, en], i) => [en, i + 1]));
// 1-based index -> aliya slug
const aliyaIndexToSlug = new Map(aliyaSlugs.map(([, en], i) => [i + 1, en]));

/** Reverse-lookup: given a parsha name, find which sefer it belongs to. */
function findSeferForParsha(parsha: string): string | null {
  for (const [sefer, list] of Object.entries(parshios)) {
    if ((list as string[]).includes(parsha)) return sefer;
  }
  return null;
}

function parseHash(hash: string): ParsedHash {
  const path = hash.replace(/^#\/?/, '');
  if (!path) return null;

  const segments = path.split('/').map(s => decodeURIComponent(s).toLowerCase());

  // /#/amud/42
  if (segments[0] === 'amud' && segments[1]) {
    const amud = parseInt(segments[1], 10);
    if (!isNaN(amud) && amud > 0) {
      return { type: 'amud', amud };
    }
    return null;
  }

  // /#/shemos/bo/rishon
  // Format: sefer-slug / parsha-slug / aliya-slug
  if (segments.length >= 2) {
    const seferHeb = slugToHeb.get(segments[0]);
    if (!seferHeb) return null;
    // Verify it's actually a sefer name
    if (!parshios[seferHeb as keyof typeof parshios]) return null;

    const parshaHeb = slugToHeb.get(segments[1]);
    if (!parshaHeb || !findSeferForParsha(parshaHeb)) return null;

    let aliya: number | undefined;
    if (segments[2]) {
      aliya = aliyaSlugToIndex.get(segments[2]);
      if (!aliya) return { type: 'parsha', parsha: parshaHeb };
    }
    return { type: 'parsha', parsha: parshaHeb, aliya };
  }

  return null;
}

function buildAmudHash(amud: number): string {
  return `#/amud/${amud}`;
}

function buildParshaHash(loc: ParshaLocation): string {
  const seferSlug = hebToSlug.get(loc.sefer) || loc.sefer;
  const parshaSlug = hebToSlug.get(loc.parsha) || loc.parsha;
  let hash = `#/${seferSlug}/${parshaSlug}`;
  if (loc.aliya) {
    const aliyaSlug = aliyaIndexToSlug.get(loc.aliya);
    if (aliyaSlug) hash += `/${aliyaSlug}`;
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
      const sefer = findSeferForParsha(pending.parsha);
      if (sefer) navigateToParsha(sefer, pending.parsha, pending.aliya);
    }
  }, [isLoading, navigateAmud, navigateToParsha]);

  // Listen for back/forward navigation and manual URL edits.
  // pushState/replaceState don't fire hashchange, so this only triggers
  // from genuine user actions (browser back/forward, editing the URL bar).
  useEffect(() => {
    const handleNavigation = () => {
      const parsed = parseHash(window.location.hash);
      if (!parsed) return;

      // Prevent the resulting state change from writing back to the hash
      skipNextSync.current = true;

      if (parsed.type === 'amud') {
        navigateAmud(parsed.amud);
      } else {
        const sefer = findSeferForParsha(parsed.parsha);
        if (sefer) navigateToParsha(sefer, parsed.parsha, parsed.aliya);
      }
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
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

      const hash = currentParsha
        ? buildParshaHash(currentParsha)
        : buildAmudHash(currentAmud);
      history.pushState(null, '', hash);
      return;
    }

    // Scroll-driven / amud-only changes -> replaceState with debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      const hash = currentParsha
        ? buildParshaHash(currentParsha)
        : buildAmudHash(currentAmud);
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
