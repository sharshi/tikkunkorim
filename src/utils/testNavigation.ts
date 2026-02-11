import { Amud } from '../types';
import { 
  findAmudForParshaAliya, 
  getCurrentParshaFromAmud, 
  getNextParshaAliya,
  ParshaLocation 
} from '../utils/navigationUtils';

/**
 * Test utility to verify navigation functionality
 */
export function testNavigation(data: Amud[]) {
  console.log('=== Testing Navigation Functionality ===');
  
  // Test 1: Check if we can detect current parsha from amud 1
  console.log('\n--- Test 1: Current parsha detection ---');
  const parsha1 = getCurrentParshaFromAmud(data, 1);
  console.log('Amud 1 parsha:', parsha1);
  
  // Test 2: Check a few more amudim
  console.log('\n--- Test 2: Multiple amudim ---');
  for (let i = 1; i <= Math.min(5, data.length); i++) {
    const parsha = getCurrentParshaFromAmud(data, i);
    console.log(`Amud ${i}:`, parsha);
  }
  
  // Test 3: Test navigation to specific parsha
  console.log('\n--- Test 3: Navigate to parsha ---');
  const location = findAmudForParshaAliya(data, 'בראשית', 'בראשית', 1);
  console.log('בראשית פרשת בראשית עליה א found at:', location);
  
  // Test 4: Test next/prev navigation
  if (parsha1) {
    console.log('\n--- Test 4: Next/Previous navigation ---');
    const nextParsha = getNextParshaAliya(parsha1.sefer, parsha1.parsha, parsha1.aliya, 'next');
    console.log('Next parsha from', parsha1, ':', nextParsha);
    
    const prevParsha = getNextParshaAliya(parsha1.sefer, parsha1.parsha, parsha1.aliya, 'prev');
    console.log('Previous parsha from', parsha1, ':', prevParsha);
  }
  
  // Test 5: Check data structure
  console.log('\n--- Test 5: Data structure validation ---');
  console.log('Total amudim:', data.length);
  if (data.length > 0) {
    console.log('First amud lines:', data[0].lines.length);
    console.log('First line meta:', data[0].lines[0]?.meta);
    console.log('First line aliyot:', data[0].lines[0]?.aliyot);
  }
  
  console.log('=== End Navigation Tests ===');
}
