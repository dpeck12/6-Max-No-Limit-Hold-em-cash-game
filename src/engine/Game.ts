import { makeDeck, Card } from './cards/Deck';
import { Rng } from './rng/Rng';
import type { BettingState, Street } from './bets/BettingState';
import { PotManager } from './bets/PotManager';
import type { Action } from './types/Action';

export type Player = { id: number; stack: number; folded: boolean; hole?: Card[] };
export type Table = { players: Player[]; board: Card[]; dealer: number };

export class Game {
  table: Table;
  rng: Rng;
  deck: Card[] = [];
  betting!: BettingState;
  pots = new PotManager();
  constructor(players: Player[], seed?: string, stakes: { sb: number; bb: number } = { sb: 1, bb: 2 }) {
    this.table = { players, board: [], dealer: 0 };
    this.rng = new Rng(seed);
    this.betting = {
      street: 'preflop',
      currentBet: 0,
      minRaise: stakes.bb,
      toAct: 0,
      contributionsRound: Array(players.length).fill(0),
      sb: stakes.sb,
      bb: stakes.bb,
      inHand: Array(players.length).fill(true)
    };
  }

  rotateDealer() {
    this.table.dealer = (this.table.dealer + 1) % this.table.players.length;
  }

  startHand() {
    this.rotateDealer();
    this.deck = this.rng.shuffle(makeDeck().slice());
    this.table.board = [];
    for (const p of this.table.players) {
      p.folded = false;
      p.hole = [this.deck.pop()!, this.deck.pop()!];
    }
    this.startStreet('preflop');
    this.postBlinds();
  }

  startStreet(street: Street) {
    this.betting.street = street;
    this.betting.currentBet = 0;
    this.betting.minRaise = this.betting.bb;
    this.betting.contributionsRound = Array(this.table.players.length).fill(0);
    this.betting.lastAggressor = undefined;
    // UTG is next after big blind
    const seats = this.table.players.length;
    const sbSeat = (this.table.dealer + 1) % seats;
    const bbSeat = (this.table.dealer + 2) % seats;
    this.betting.toAct = street === 'preflop' ? (this.table.dealer + 3) % seats : (this.table.dealer + 1) % seats;
  }

  postBlinds() {
    const seats = this.table.players.length;
    const sbSeat = (this.table.dealer + 1) % seats;
    const bbSeat = (this.table.dealer + 2) % seats;
    this.forceContribute(sbSeat, Math.min(this.table.players[sbSeat].stack, this.betting.sb));
    this.forceContribute(bbSeat, Math.min(this.table.players[bbSeat].stack, this.betting.bb));
    this.betting.currentBet = this.betting.bb;
    this.betting.lastAggressor = bbSeat;
  }

  forceContribute(seat: number, amount: number) {
    const p = this.table.players[seat];
    if (amount <= 0) return;
    const pay = Math.min(p.stack, amount);
    p.stack -= pay;
    this.betting.contributionsRound[seat] += pay;
    this.pots.addToMain(pay, this.activeEligible());
  }

  activeEligible(): number[] {
    const res: number[] = [];
    for (let i = 0; i < this.table.players.length; i++) if (this.betting.inHand[i]) res.push(i);
    return res;
  }

  playerAct(action: Action) {
    const seat = this.betting.toAct;
    const p = this.table.players[seat];
    if (!this.betting.inHand[seat]) return; // folded or all-in
    const contrib = this.betting.contributionsRound[seat];
    switch (action.type) {
      case 'fold':
        p.folded = true;
        this.betting.inHand[seat] = false;
        break;
      case 'check': {
        const toMatch = this.betting.currentBet - contrib;
        if (toMatch > 0) return; // cannot check when facing bet
        break;
      }
      case 'call': {
        const toMatch = this.betting.currentBet - contrib;
        const pay = Math.min(p.stack, toMatch);
        this.forceContribute(seat, pay);
        break;
      }
      case 'bet': {
        if (this.betting.currentBet > 0) return; // cannot bet if bet exists; should raise
        const amount = Math.max(action.amount, this.betting.bb);
        this.forceContribute(seat, amount);
        this.betting.currentBet = amount;
        this.betting.minRaise = amount;
        this.betting.lastAggressor = seat;
        break;
      }
      case 'raise': {
        const amount = Math.max(action.amount, this.betting.minRaise);
        const target = this.betting.currentBet + amount;
        const toPay = target - contrib;
        this.forceContribute(seat, toPay);
        this.betting.currentBet = target;
        this.betting.minRaise = amount;
        this.betting.lastAggressor = seat;
        break;
      }
      case 'allIn': {
        const toPay = p.stack;
        this.forceContribute(seat, toPay);
        this.betting.lastAggressor = seat;
        break;
      }
    }
    this.advanceActionCursor();
    this.checkRoundEnd();
  }

  advanceActionCursor() {
    const seats = this.table.players.length;
    let next = (this.betting.toAct + 1) % seats;
    while (!this.betting.inHand[next]) {
      next = (next + 1) % seats;
    }
    this.betting.toAct = next;
  }

  checkRoundEnd() {
    // End when last aggressor is reached and everyone else has matched or folded
    const la = this.betting.lastAggressor;
    if (la === undefined) return;
    if (this.betting.toAct !== la) return;
    const target = this.betting.currentBet;
    for (let i = 0; i < this.table.players.length; i++) {
      if (!this.betting.inHand[i]) continue;
      if (this.betting.contributionsRound[i] < target) return;
    }
    this.endStreet();
  }

  endStreet() {
    // Move to next street and deal community cards
    if (this.betting.street === 'preflop') {
      this.dealFlop();
      this.startStreet('flop');
    } else if (this.betting.street === 'flop') {
      this.dealTurn();
      this.startStreet('turn');
    } else if (this.betting.street === 'turn') {
      this.dealRiver();
      this.startStreet('river');
    } else if (this.betting.street === 'river') {
      this.betting.street = 'showdown';
      // TODO: showdown evaluation
    }
  }

  dealFlop() {
    this.table.board.push(this.deck.pop()!, this.deck.pop()!, this.deck.pop()!);
  }
  dealTurn() {
    this.table.board.push(this.deck.pop()!);
  }
  dealRiver() {
    this.table.board.push(this.deck.pop()!);
  }
}