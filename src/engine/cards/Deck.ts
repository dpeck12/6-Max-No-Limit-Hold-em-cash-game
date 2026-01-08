export type Card = { rank: number; suit: number };
const RANKS = Array.from({ length: 13 }, (_, i) => i + 2); // 2..14 (Ace)
const SUITS = [0, 1, 2, 3];

export function makeDeck(): Card[] {
  const deck: Card[] = [];
  for (const s of SUITS) for (const r of RANKS) deck.push({ rank: r, suit: s });
  return deck;
}

export function toString(card: Card): string {
  const rankSymbols = ['','', '2','3','4','5','6','7','8','9','T','J','Q','K','A'];
  const suitSymbols = ['♣','♦','♥','♠'];
  return rankSymbols[card.rank] + suitSymbols[card.suit];
}