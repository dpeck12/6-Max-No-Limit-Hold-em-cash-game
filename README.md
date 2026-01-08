# 6-Max No-Limit Hold’em (Browser)

Free, browser-based single-player poker (you vs 5 bots). Built with React + TypeScript + PixiJS and Vite. Runs locally in Chrome/Edge as a PWA.

## Quick Start

Prerequisites: Node.js 18+ and npm.

```bash
cd 6-Max-No-Limit-Hold-em-cash-game
npm install
npm run dev
```

Open the printed local URL in your browser. Use `npm run build` to produce a production build, `npm run preview` to serve it, and `npm test` to run unit tests.

## Tech Stack
- React 18, TypeScript 5, Vite 5
- PixiJS 8 (WebGL2 with Canvas fallback)
- Zustand (app state), idb (IndexedDB), seedrandom (RNG), howler (audio)
- Vitest (tests), vite-plugin-pwa (offline/PWA)

## Project Structure
- src/engine: pure logic (`Game`, `Deck`, `Rng`, bets, eval)
- src/ai: bot interfaces and rule-based policy
- src/ui: Pixi renderer and animations
- src/app: state, persistence, replay, settings
- public/assets: textures/audio; `manifest.json`

## License & Assets
Code is MIT. Use CC0/MIT assets (e.g., Kenney). Verify any third-party asset licenses before adding.
# 6-Max-No-Limit-Hold-em-cash-game