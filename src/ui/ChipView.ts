import { Container, Graphics, Text } from 'pixi.js';

export function makeChip(label: string, color = 0xd97706): Container {
  const node = new Container();
  const chip = new Graphics();
  chip.circle(0, 0, 14).fill(color).stroke({ color: 0x000000, width: 2 });
  const ring = new Graphics();
  ring.circle(0, 0, 10).stroke({ color: 0xffffff, width: 2 });
  const text = new Text({ text: label, style: { fill: 0xffffff, fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold' } });
  text.anchor.set(0.5);
  node.addChild(chip);
  node.addChild(ring);
  node.addChild(text);
  return node;
}

export function makeStack(amount: number, color = 0x15803d): Container {
  const stack = new Container();
  const chips = Math.max(1, Math.min(5, Math.floor(amount))); // compress to 1..5 chips
  for (let i = 0; i < chips; i++) {
    const c = new Graphics();
    c.circle(0, 0, 12).fill(color).stroke({ color: 0x000000, width: 2 });
    c.position.set(0, -i * 6);
    stack.addChild(c);
  }
  return stack;
}
