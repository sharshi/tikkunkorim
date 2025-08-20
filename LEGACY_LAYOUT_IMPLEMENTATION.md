# Legacy Layout Implementation

This document outlines the implementation of the legacy Tikkun layout logic in the React application.

## Changes Made

### 1. Hebrew Text Processing (`utils/hebrewUtils.ts`)
- **Kri/Ksiv Processing**: Implemented `processKriKsiv()` function that handles the traditional Kri (spoken) and Ksiv (written) text formatting
  - When nikud is OFF: Removes `<...>` content (KSIV), converts maqaf `־` to spaces, keeps only Hebrew letters (Alef-Tav)
  - When nikud is ON: Removes `[...]` content (KRI) and strips `<>` delimiters

- **Stretching Support**: Added legacy "lehaderes" character stretching functionality
  - Special Unicode glyphs for letters ל, ה, ד, ר, ת
  - Stretching bar character and helper functions
  - Arrays for verse numbers (`misparim`) and aliyah markers (`aliyot`)

### 2. TextLine Component (`components/TextLine/TextLine.tsx`)
- **Word-Based Rendering**: For satum lines without nikud, text is split into individual words
- **Gap Calculation**: Measures available space and calculates gaps between words
- **Dynamic Stretching**: When gaps exceed `maxGap` threshold, stretches eligible letters using special glyphs
- **Line Labels**: Displays pasuk (verse) numbers on the right and aliyah markers on the left

### 3. State Management (`hooks/useTikkun.ts`)
- **Legacy Defaults**: Changed default `wordGap` to 6 (legacy `maxGap`)
- **Proper Bounds**: Min gap = 1, max gap = 6 to match legacy behavior

### 4. UI Controls (`components/Header/Header.tsx`)
- **Updated Labels**: Changed "word gap" to "max gap" for clarity
- **Correct Bounds**: Adjusted min/max values to match new defaults

### 5. Styling (`components/TextLine/TextLine.css`)
- **Label Positioning**: Added styles for `.labelright` and `.labelleft` containers
- **Word Measurement**: Added `.text-fragment.word` with `display: inline-block` for width measurement

## Key Legacy Features Implemented

1. **Text Processing**: Faithful reproduction of the original `nikudKriKsiv()` function
2. **Word Layout**: Single-fragment satum lines split into individual words for justification
3. **Gap Measurement**: Calculates pixel gaps between words and compares to threshold
4. **Letter Stretching**: Uses special Unicode glyphs to visually stretch specific Hebrew letters
5. **Line Labels**: Displays verse numbers (red) and aliyah markers (blue) positioned outside the text

## Usage

- **Nikud Toggle**: Switch between full text with vowel points and consonant-only view
- **Gap Control**: Adjust the maximum gap threshold (1-6) - affects when stretching activates
- **Automatic Stretching**: When gaps exceed threshold, eligible letters are automatically stretched

## Technical Notes

- Uses `useLayoutEffect` for DOM measurements to avoid flickering
- Preserves original text intact when stretching is not needed
- Maintains React patterns while implementing legacy DOM manipulation logic
- Builds successfully with TypeScript strict mode
