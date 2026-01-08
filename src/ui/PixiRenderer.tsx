import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Text } from 'pixi.js';
import { useAppState } from '../app/AppState';
import { makeCardView, makeCardBackView } from './CardView';
import { makeChip, makeStack } from './ChipView';

export default function PixiRenderer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const version = useAppState(s => s.version);
  const game = useAppState(s => s.game);
  const heroSeat = useAppState(s => s.heroSeat);

  useEffect(() => {
    let destroyed = false;
    (async () => {
      if (!containerRef.current) return;
      const app = new Application();
      await app.init({
        resizeTo: containerRef.current,
        background: 0x0b3d2e,
        antialias: true
      });
      if (destroyed) {
        app.destroy(true);
        return;
      }
      appRef.current = app;
      containerRef.current.appendChild(app.canvas);

      const table = new Graphics();
      table.circle(0, 0, 250).fill(0x155c48);
      const stage = new Container();
      stage.position.set(app.screen.width / 2, app.screen.height / 2);
      stage.addChild(table);
      // Debug label to verify render path
      const lbl = new Text({ text: 'Table', style: { fill: 0xffffff, fontSize: 14 } });
      lbl.position.set(-18, -140);
      stage.addChild(lbl);
      app.stage.addChild(stage);

      const onResize = () => {
        stage.position.set(app.screen.width / 2, app.screen.height / 2);
      };
      app.renderer.on('resize', onResize);

      // Cleanup
      const cleanup = () => {
        app.renderer.off('resize', onResize);
        app.destroy(true);
      };
      (app as any)._cleanup = cleanup;
    })();
    return () => {
      destroyed = true;
      const app = appRef.current as any;
      if (app && app._cleanup) app._cleanup();
    };
  }, []);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    // Clear previous seats/cards
    app.stage.removeChildren();

    // Compute responsive radius to keep seats in view
    const margin = 90;
    const radius = Math.max(140, Math.min(app.screen.width, app.screen.height) / 2 - margin);
    const table = new Graphics();
    table.circle(0, 0, radius - 50).fill(0x155c48);
    const stage = new Container();
    stage.position.set(app.screen.width / 2, app.screen.height / 2);
    stage.addChild(table);

    // Draw 6 seats around the table
    const seats = 6;
    for (let i = 0; i < seats; i++) {
      const angle = (Math.PI * 2 * i) / seats - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const seat = new Graphics();
      seat.circle(0, 0, 22).fill(0x1f7a63).stroke({ color: 0xffffff, width: 2 });
      seat.position.set(x, y);
      stage.addChild(seat);

      // Highlight ring for the player to act
      if (game && game.betting.toAct === i) {
        const ring = new Graphics();
        ring.circle(0, 0, 26).stroke({ color: 0xffe566, width: 3 });
        ring.position.set(x, y);
        stage.addChild(ring);
      }

      // Render hole cards if dealt; only hero sees faces
      const p = game?.table.players[i];
      if (p?.hole && p.hole.length === 2) {
        const c1 = i === heroSeat ? makeCardView(p.hole[0]) : makeCardBackView();
        const c2 = i === heroSeat ? makeCardView(p.hole[1]) : makeCardBackView();
        c1.position.set(-22, -46);
        c2.position.set(-10, -14);
        seat.addChild(c1);
        seat.addChild(c2);
      }

      // Show stack and contribution chips
      if (p) {
        const stackLabel = new Text({ text: `${p.stack}bb`, style: { fill: 0xffffff, fontSize: 12 } });
        stackLabel.anchor.set(0.5);
        stackLabel.position.set(x, y + 34);
        stage.addChild(stackLabel);
        const contrib = game?.betting.contributionsRound[i] ?? 0;
        if (contrib > 0) {
          const st = makeStack(Math.min(5, Math.ceil(contrib / (game!.betting.bb || 1))));
          st.position.set(x + 24, y);
          stage.addChild(st);
        }
      }
    }

    // Render community cards in the center
    if (game?.table.board?.length) {
      const startX = -100;
      for (let k = 0; k < game.table.board.length; k++) {
        const cv = makeCardView(game.table.board[k]);
        cv.position.set(startX + k * 50, -10);
        stage.addChild(cv);
      }
    }

    // Pot chips and label
    if (game) {
      const pot = game.pots.total();
      const potLabel = new Text({ text: `Pot: ${pot}`, style: { fill: 0xffffcc, fontSize: 14, fontWeight: 'bold' } });
      potLabel.anchor.set(0.5);
      potLabel.position.set(0, Math.min(60, radius - 20));
      stage.addChild(potLabel);
      if (pot > 0) {
        const potChip = makeChip(`${Math.min(99, pot)}`);
        potChip.position.set(0, Math.min(30, radius - 50));
        stage.addChild(potChip);
      }
    }

    app.stage.addChild(stage);
  }, [version, game]);

  return <div ref={containerRef} style={{flex:1}} />;
}