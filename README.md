# OWW UIKit

Modern, scalable Design System & UI Kit built with Sass (SCSS) and Figma design tokens.

## Features

- **Design Tokens**: Complete tokens for typography, palettes, spacing, sizing, border radiuses, and semantic colors mapped from Figma.
- **Dart Sass Architecture**: Clean 7-1 pattern (`abstract`, `base`, `components`, `layout`).
- **Official Icons**: 55 Figma icons with 2 styles (`Outline` & `Fill`, total 110 SVGs) with standard 20px grid and `currentColor` support in `src/assets/icons/`.
- **Components**: Includes Figma-spec components like `alert` (variants: success, warning, danger, info, with icons, titles, descriptions, and close buttons).
- **Interactive Documentation**: `index.html` live preview with responsive sidebar, navbar, token indexing, and live searchable Icon Gallery.

## Quick Start

### Installation

```bash
npm install
```

### Development & Live Preview

```bash
# Auto-compile SCSS + Auto-reload browser secara realtime (Rekomendasi)
npm run dev

# Atau hanya auto-compile SCSS saat save (tanpa live reload server)
npm run watch
```

### Production Build

```bash
# Compile expanded CSS & sync assets
npm run build

# Compile minified production CSS
npm run build:min
```

## Structure

```
oww-uikit/
├── index.html              # Live documentation & preview page
├── package.json
├── AGENT.md                # Design system rules & AI development guidelines
├── src/
│   ├── assets/
│   │   └── icons/          # SVG UI icons
│   └── scss/
│       ├── abstract/       # Variables, functions, mixins
│       ├── base/           # Reset, typography, global layout (container, section)
│       ├── components/     # UI components (alert, etc.)
│       ├── layout/         # Layout & documentation styling
│       └── uikit.scss      # Master entry point
└── dist/
    ├── uikit.css           # Compiled CSS
    └── uikit.min.css       # Minified CSS
```

## License

[MIT](LICENSE)
