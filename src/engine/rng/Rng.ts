import seedrandom from 'seedrandom';

export class Rng {
  private rng: seedrandom.PRNG;
  constructor(seed?: string) {
    this.rng = seedrandom(seed || undefined);
  }
  next(): number { return this.rng.quick(); }
  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}