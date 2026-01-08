export type Pot = { amount: number; eligible: number[] };
export class PotManager {
  pots: Pot[] = [];
  addToMain(amount: number, eligible: number[]) {
    if (!amount) return;
    if (this.pots.length === 0) this.pots.push({ amount: 0, eligible: [] });
    const main = this.pots[0];
    main.amount += amount;
    main.eligible = Array.from(new Set([...main.eligible, ...eligible])).sort();
  }
  total(): number { return this.pots.reduce((a, p) => a + p.amount, 0); }
}