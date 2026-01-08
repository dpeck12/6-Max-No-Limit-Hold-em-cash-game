import { create } from 'zustand';
import { Game, Player } from '../engine/Game';
import { RuleBasedPolicy } from '../ai/policies/RuleBasedPolicy';

type AppState = {
  seed: string;
  game?: Game;
  version: number;
  heroSeat: number;
  autoPlay: boolean;
  setSeed: (seed: string) => void;
  initGame: () => void;
  dealHand: () => void;
  act: (a: Parameters<Game['playerAct']>[0]) => void;
  toggleAutoPlay: () => void;
};

export const useAppState = create<AppState>((set, get) => ({
  seed: 'auto',
  game: undefined,
  version: 0,
  heroSeat: 0,
  autoPlay: false,
  setSeed: (seed) => set({ seed }),
  initGame: () => {
    const players: Player[] = Array.from({ length: 6 }, (_, i) => ({ id: i, stack: 100, folded: false }));
    const g = new Game(players, get().seed === 'auto' ? undefined : get().seed);
    set({ game: g, version: get().version + 1 });
  },
  dealHand: () => {
    const g = get().game;
    if (!g) return;
    g.startHand();
    set({ version: get().version + 1 });
    // Let bots auto-play if not hero turn
    runBots(set, get);
  },
  act: (a) => {
    const g = get().game;
    if (!g) return;
    if (g.betting.toAct !== get().heroSeat) return; // not hero's turn
    g.playerAct(a);
    set({ version: get().version + 1 });
    runBots(set, get);
  },
  toggleAutoPlay: () => set({ autoPlay: !get().autoPlay })
}));

function runBots(set: (s: Partial<AppState>) => void, get: () => AppState) {
  const g = get().game;
  if (!g) return;
  const policy = new RuleBasedPolicy();
  let safety = 100;
  while (safety-- > 0 && g.betting.street !== 'showdown') {
    const seat = g.betting.toAct;
    if (seat === get().heroSeat) {
      if (!get().autoPlay) break;
      // Auto-play hero: simple check/call baseline
      const contribHero = g.betting.contributionsRound[seat];
      const actionHero = policy.decide({ currentBet: g.betting.currentBet, contribution: contribHero });
      g.playerAct(actionHero);
    } else {
      const contrib = g.betting.contributionsRound[seat];
      const action = policy.decide({ currentBet: g.betting.currentBet, contribution: contrib });
      g.playerAct(action);
    }
  }
  set({ version: get().version + 1 });
}