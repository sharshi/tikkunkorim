# Tikkun Korim - React Application

A modern React application for Torah reading practice (Tikkun Korim) with TypeScript support.

## Features

- **Modern React Architecture**: Clean component structure with TypeScript
- **Hebrew Text Display**: Proper rendering of Hebrew text with nikud (vowel points)
- **Interactive Controls**: Toggle nikud display and adjust word spacing
- **Navigation**: Easy navigation between amudim (pages)
- **Responsive Design**: Works on desktop and mobile devices
- **Font Support**: Custom Hebrew font (Shlomo Semi-Stam) for authentic Torah text display

## Project Structure

```
src/
├── components/           # React components
│   ├── Header/          # Navigation and controls
│   ├── AmudDisplay/     # Main text display
│   └── TextLine/        # Individual line rendering
├── hooks/               # Custom React hooks
│   └── useTikkun.ts    # Main state management hook
├── types/               # TypeScript type definitions
├── data/                # Torah text data and constants
├── utils/               # Utility functions for Hebrew text processing
└── assets/              # Static assets (fonts, etc.)
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app

### Building for Production

```bash
npm run build
```

## Usage

- **Navigation**: Use the << and >> buttons to navigate between amudim
- **Nikud Toggle**: Click "Nikud ON/OFF" to show/hide vowel points
- **Word Spacing**: When nikud is off, use [-] and [+] to adjust word spacing
- **Responsive**: The app adapts to different screen sizes for mobile use

## Technology Stack

- **React 18** with **TypeScript**
- **CSS Modules** for styling
- **Custom Hooks** for state management
- **Modern ES6+** features

## Features in Development

- Full Torah data loading (currently using sample data)
- Aliyah markers and navigation
- Search functionality
- Bookmarking and favorites
- Print-friendly layouts

## Data Structure

The app uses a structured JSON format for Torah text data:

```typescript
interface Amud {
  amud: number;
  lines: Line[];
}

interface Line {
  number: number;
  fragments: string[];
  meta: Meta[];
  aliyot: number[];
  layout: 'satum' | 'patuch' | string;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or feedback about the Tikkun Korim application:
- Email: [tikkun-repo@shafeh.org](mailto:tikkun-repo@shafeh.org)

---

**Perfect for Torah reading practice - anytime, anywhere!**
