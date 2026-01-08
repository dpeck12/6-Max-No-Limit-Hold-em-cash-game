// Thin wrapper to allow swapping evaluators later
import { Card } from '../cards/Deck';
// Placeholder: wire to 'pokersolver' when installed
export type HandRank = { rank: number; name: string };
export function evaluateSeven(cards: Card[]): HandRank {
  // TODO: integrate pokersolver; return dummy for now
  return { rank: 0, name: 'unknown' };
}