import { Container, Graphics, Text } from 'pixi.js';
import type { Card } from '../engine/cards/Deck';
import { toString } from '../engine/cards/Deck';

function suitColor(suit: number): number {
  // 0♣,1♦,2♥,3♠ -> red for ♦/♥
  return suit === 1 || suit === 2 ? 0xcc3333 : 0x111111;
}

export function makeCardView(card: Card): Container {
  const node = new Container();
  const bg = new Graphics();
  bg.roundRect(0, 0, 40, 56, 6).fill(0xffffff).stroke({ color: 0x000000, width: 2 });
  node.addChild(bg);
  const label = new Text({
    text: toString(card),
    style: {
      fill: suitColor(card.suit),
      fontFamily: 'Arial',
      fontSize: 16,
      fontWeight: 'bold'
    }
  });
  label.position.set(6, 6);
  node.addChild(label);
  return node;
}

export function makeCardBackView(): Container {
  const node = new Container();
  const bg = new Graphics();
  bg.roundRect(0, 0, 40, 56, 6).fill(0x1e3a8a).stroke({ color: 0x0b254f, width: 2 });
  const diamond = new Graphics();
  diamond.moveTo(20, 8).lineTo(32, 28).lineTo(20, 48).lineTo(8, 28).lineTo(20, 8).fill(0xffffff).stroke({ color: 0xffffff, width: 1 });
  node.addChild(bg);
  node.addChild(diamond);
  return node;
}
