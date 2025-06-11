# Plan for Importing Functionality from `/old` Folder

## 1. UI & Layout
- Recreate the main layout from `old/index.html`:
  - Sidebar/menu (`#sidebar`, `#menu`)
  - Menubar with navigation buttons and labels (`#menubar`, `#backb`, `#but`, `#parshnm`, `#alinm`, `#prevali`, `#nextali`, `#banner`)
  - Bottombar with about/settings (`#bottombar`, `#about`, `#settings`)
  - About and settings modals/views (`#aboutView`, `#settingsView`)
  - Adapt CSS style result from `old/css/css.css` and `old/css/index.css` into shadcn components as needed. dont actually move the css.

## 2. Data & Logic
- Import and refactor the Torah/parsha/aliya data from:
  - `old/js/newdata5.js` and/or `old/js/parshadata7.js` (choose one canonical source, or merge if needed)
  - `old/js/parshaCal.js` for parsha calendar logic
- Migrate and adapt utility functions from `old/js/tikunfuncsme4.js` (e.g., `getParshios`, `getRange`, navigation, view switching, etc.)

## 3. Functionality
- Implement navigation between seforim, parshios, aliyos, and text display (using the above data and logic).
- Implement next/prev aliya navigation (`nextprevAli`).
- Implement "go back" logic (`goback`) for view transitions.
- Implement About and Settings modals, including:
  - Text size and location controls (see TODO in `Settings.tsx`)
- Add support for showing/hiding nikud (`showNikud`).

## 4. Assets
- Import and use image assets from `old/p/` (e.g., icons, backgrounds).
- Import and use font files from `old/css/` if needed.

## 5. jQuery Removal
- Refactor all jQuery-based code to React and modern JS/TS.

## 6. Miscellaneous
- Remove Cordova/device-specific code if not needed.
- Ensure all Hebrew text and RTL layout is handled correctly.
