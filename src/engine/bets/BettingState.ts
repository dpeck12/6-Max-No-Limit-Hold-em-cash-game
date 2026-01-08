export type Street = 'preflop'|'flop'|'turn'|'river'|'showdown';
export type BettingState = {
  street: Street;
  currentBet: number; // amount to match this round
  minRaise: number;   // minimal raise increment
  toAct: number;      // seat index
  lastAggressor?: number; // seat index of last bet/raise
  contributionsRound: number[]; // per-seat contributions in current street
  sb: number;
  bb: number;
  inHand: boolean[];  // seated players who haven't folded
};