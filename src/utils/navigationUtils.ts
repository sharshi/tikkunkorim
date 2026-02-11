import { Amud, Meta } from '../types';
import { aliyos, parshios, seforim } from '../data/parshadata';

export interface ParshaLocation {
  sefer: string;
  parsha: string;
  aliya?: number;
}

export interface AmudLocation {
  amud: number;
  line?: number;
}

/**
 * Parse parsha range string like "16:1 16:17" to get start and end positions
 */
function parseParshaRange(range: string): { start: { perek: number; pasuk: number }, end: { perek: number; pasuk: number } } {
  const [startStr, endStr] = range.split(' ');
  const [startPerek, startPasuk] = startStr.split(':').map(Number);
  const [endPerek, endPasuk] = endStr.split(':').map(Number);
  
  return {
    start: { perek: startPerek, pasuk: startPasuk },
    end: { perek: endPerek, pasuk: endPasuk }
  };
}

/**
 * Convert sefer name to sefer number
 */
function getSeferNumber(seferName: string): number {
  const seferIndex = seforim.indexOf(seferName);
  return seferIndex >= 0 ? seferIndex + 1 : 1;
}

/**
 * Check if a given position (perek/pasuk) falls within a range
 */
function isPositionInRange(
  position: { perek: number; pasuk: number },
  range: { start: { perek: number; pasuk: number }, end: { perek: number; pasuk: number } }
): boolean {
  if (position.perek < range.start.perek || position.perek > range.end.perek) {
    return false;
  }
  
  if (position.perek === range.start.perek && position.pasuk < range.start.pasuk) {
    return false;
  }
  
  if (position.perek === range.end.perek && position.pasuk > range.end.pasuk) {
    return false;
  }
  
  return true;
}

/**
 * Find the amud number that contains the start of a specific parsha/aliya
 */
export function findAmudForParshaAliya(
  data: Amud[], 
  sefer: string, 
  parsha: string, 
  aliya?: number
): AmudLocation | null {
  const seferNumber = getSeferNumber(sefer);
  
  // Get the aliya range if specified
  let targetRange: { start: { perek: number; pasuk: number }, end: { perek: number; pasuk: number } } | null = null;
  
  if (aliya && aliyos[parsha as keyof typeof aliyos]) {
    const aliyaData = aliyos[parsha as keyof typeof aliyos] as any;
    const aliyaKey = aliya.toString();
    if (aliyaData[aliyaKey]) {
      targetRange = parseParshaRange(aliyaData[aliyaKey]);
    }
  } else if (aliyos[parsha as keyof typeof aliyos]) {
    // If no specific aliya requested, use the first aliya of the parsha
    const aliyaData = aliyos[parsha as keyof typeof aliyos] as any;
    if (aliyaData['1']) {
      targetRange = parseParshaRange(aliyaData['1']);
    }
  }

  if (!targetRange) {
    console.log('No range found for', { sefer, parsha, aliya });
    return null;
  }

  // Find the first amud that contains the target position
  for (const amud of data) {
    for (let lineIndex = 0; lineIndex < amud.lines.length; lineIndex++) {
      const line = amud.lines[lineIndex];
      
      // Check if this line has metadata for our target sefer
      for (const meta of line.meta) {
        if (hasCompleteMeta(meta) && meta.sefer === seferNumber) {
          // Check if this position matches our target range start
          if (meta.perek === targetRange.start.perek && meta.pasuk === targetRange.start.pasuk) {
            return { amud: amud.amud, line: lineIndex + 1 };
          }
          
          // Also check if we're close to the start (within the range)
          if (isPositionInRange({ perek: meta.perek, pasuk: meta.pasuk }, targetRange)) {
            return { amud: amud.amud, line: lineIndex + 1 };
          }
        }
      }
    }
  }
  
  console.log('No amud found for parsha/aliya', { sefer, parsha, aliya, targetRange });
  return null;
}

/**
 * Find the current parsha/aliya based on the current amud and position
 */
export function getCurrentParshaFromAmud(
  data: Amud[],
  currentAmud: number,
  lineNumber?: number
): ParshaLocation | null {
  const amud = data.find(a => a.amud === currentAmud);
  if (!amud) return null;
  
  // Try to find a line with complete meta data
  let targetLine = null;
  if (lineNumber && lineNumber <= amud.lines.length) {
    targetLine = amud.lines[lineNumber - 1];
  }
  
  // If the specified line doesn't have good meta, search for the first line with complete meta
  if (!targetLine || !targetLine.meta.length || !hasCompleteMeta(targetLine.meta[0])) {
    targetLine = amud.lines.find(line => 
      line.meta.length > 0 && hasCompleteMeta(line.meta[0])
    );
  }
  
  if (!targetLine || !targetLine.meta.length) return null;
  
  const meta = targetLine.meta[0];
  const seferName = seforim[meta.sefer - 1];
  if (!seferName) return null;
  
  // Find which parsha this position belongs to
  const parshaSefaram = parshios[seferName as keyof typeof parshios];
  if (!parshaSefaram) return null;
  
  // Check each parsha to see if our position falls within it
  for (const parsha of parshaSefaram) {
    const aliyaData = aliyos[parsha as keyof typeof aliyos] as any;
    if (!aliyaData) continue;
    
    // Check all aliyot in this parsha
    for (let aliyaNum = 1; aliyaNum <= 8; aliyaNum++) {
      const aliyaKey = aliyaNum.toString();
      if (aliyaData[aliyaKey]) {
        const range = parseParshaRange(aliyaData[aliyaKey]);
        if (isPositionInRange({ perek: meta.perek, pasuk: meta.pasuk }, range)) {
          return {
            sefer: seferName,
            parsha: parsha,
            aliya: aliyaNum
          };
        }
      }
    }
  }
  
  // If we couldn't find a specific aliya, return the first parsha of the sefer as fallback
  return {
    sefer: seferName,
    parsha: parshaSefaram[0],
    aliya: undefined
  };
}

/**
 * Check if meta data is complete (has all required fields)
 */
function hasCompleteMeta(meta: any): boolean {
  return meta && meta.sefer && meta.perek !== null && meta.pasuk !== null;
}

/**
 * Get the next/previous parsha/aliya
 */
export function getNextParshaAliya(
  currentSefer: string,
  currentParsha: string,
  currentAliya?: number,
  direction: 'next' | 'prev' = 'next'
): ParshaLocation | null {
  const seferParshaList = parshios[currentSefer as keyof typeof parshios];
  if (!seferParshaList) return null;
  
  const currentParshaIndex = seferParshaList.indexOf(currentParsha);
  if (currentParshaIndex === -1) return null;
  
  // If we have an aliya, try to navigate within the same parsha first
  if (currentAliya) {
    const aliyaData = aliyos[currentParsha as keyof typeof aliyos] as any;
    if (aliyaData) {
      const nextAliya = direction === 'next' ? currentAliya + 1 : currentAliya - 1;
      const nextAliyaKey = nextAliya.toString();
      
      if (nextAliya >= 1 && nextAliya <= 8 && aliyaData[nextAliyaKey]) {
        return {
          sefer: currentSefer,
          parsha: currentParsha,
          aliya: nextAliya
        };
      }
    }
  }
  
  // Navigate to next/previous parsha
  const nextParshaIndex = direction === 'next' ? currentParshaIndex + 1 : currentParshaIndex - 1;
  
  if (nextParshaIndex >= 0 && nextParshaIndex < seferParshaList.length) {
    const nextParsha = seferParshaList[nextParshaIndex];
    return {
      sefer: currentSefer,
      parsha: nextParsha,
      aliya: direction === 'next' ? 1 : undefined // Start at first aliya for next parsha
    };
  }
  
  // Navigate to next/previous sefer
  const currentSeferIndex = seforim.indexOf(currentSefer);
  const nextSeferIndex = direction === 'next' ? currentSeferIndex + 1 : currentSeferIndex - 1;
  
  if (nextSeferIndex >= 0 && nextSeferIndex < seforim.length) {
    const nextSefer = seforim[nextSeferIndex];
    const nextSeferParshaList = parshios[nextSefer as keyof typeof parshios];
    if (nextSeferParshaList && nextSeferParshaList.length > 0) {
      const nextParsha = direction === 'next' ? nextSeferParshaList[0] : nextSeferParshaList[nextSeferParshaList.length - 1];
      return {
        sefer: nextSefer,
        parsha: nextParsha,
        aliya: direction === 'next' ? 1 : undefined
      };
    }
  }
  
  return null;
}

/**
 * Get all aliyot for a specific parsha
 */
export function getAliyotForParsha(parsha: string): Array<{ number: number; name: string; range: string }> {
  const aliyaData = aliyos[parsha as keyof typeof aliyos] as any;
  if (!aliyaData) return [];
  
  const result = [];
  for (let i = 1; i <= 8; i++) {
    const aliyaKey = i.toString();
    if (aliyaData[aliyaKey]) {
      result.push({
        number: i,
        name: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי', 'מפטיר'][i - 1],
        range: aliyaData[aliyaKey]
      });
    }
  }
  
  return result;
}
