import { describe, it, expect } from 'vitest';
import { makeDeck } from '../../src/engine/cards/Deck';
import { Rng } from '../../src/engine/rng/Rng';

describe('Deck & RNG', () => {
  it('creates 52 unique cards', () => {
    const deck = makeDeck();
    expect(deck.length).toBe(52);
    const set = new Set(deck.map(c => c.rank*10 + c.suit));
    expect(set.size).toBe(52);
  });
  it('shuffle is deterministic with seed', () => {
    const rng1 = new Rng('abc');
    const rng2 = new Rng('abc');
    const d1 = rng1.shuffle(makeDeck().slice());
    const d2 = rng2.shuffle(makeDeck().slice());
    expect(d1.map(c=>c.rank+":"+c.suit)).toEqual(d2.map(c=>c.rank+":"+c.suit));
  });
});