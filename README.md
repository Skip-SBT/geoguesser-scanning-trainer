# GeoGuessr Scanning Trainer

Train your city-scanning speed on real country maps. Find target cities as fast as possible — with two modes to match how you want to practice.

## Modes

**Training Mode** — No time pressure. Difficulty scales automatically as you improve: starts with major cities only, unlocks smaller ones over time. Countries rotate every 3 correct finds.

**Time Attack** — A countdown ticks down for each city. Every correct answer shortens the next time limit. Survive as long as you can.

## Getting Started

Requires Node.js 22 (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run check:eslint` | Lint TypeScript/TSX files |
| `npm run check:stylelint` | Lint SCSS files |
| `npm run check:spellcheck` | Spellcheck source files |
| `npm run check:all` | Run all checks |
| `npm run format` | Format all files with Prettier |
| `npm run reset` | Delete `dist/` and `node_modules/`, then reinstall |

## Project Structure

```
src/
├── components/scanning-trainer/
│   ├── CityLabel.tsx       # SVG city dot + label with click hit area
│   ├── MapView.tsx         # Zoomable/pannable map with road overlay
│   ├── ResultFeedback.tsx  # Correct/wrong flash overlay
│   ├── RoadLayer.tsx       # Curved road network between visible cities
│   ├── ScorePanel.tsx      # Session stats display
│   └── TargetDisplay.tsx   # Current target city + difficulty + timer
├── data/
│   ├── cities.ts           # City list with coordinates and importance levels
│   └── countries.ts        # Country list with map center/scale
├── hooks/
│   ├── useGameEngine.ts    # Training mode state and logic
│   ├── useTimedGame.ts     # Time attack state and logic
│   └── useStopwatch.ts     # High-resolution elapsed timer
├── pages/
│   ├── HomePage.tsx
│   ├── ScanningTrainerPage.tsx
│   └── TimedGamePage.tsx
├── utils/
│   ├── roads.ts            # Nearest-neighbor road graph computation
│   └── sounds.ts           # Web Audio API sound effects
├── App.tsx
├── main.tsx
└── theme.ts
```

## Deployment

Deploys automatically to GitHub Pages on every published release via GitHub Actions.

**Required GitHub settings:**
- Settings → Pages → Source: **GitHub Actions**
- Settings → Environments → github-pages → Deployment branches and tags: add `v*`
