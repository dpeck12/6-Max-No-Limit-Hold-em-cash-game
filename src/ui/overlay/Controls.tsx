import { useAppState } from '../../app/AppState';

export default function Controls() {
	const act = useAppState(s => s.act);
	const g = useAppState(s => s.game);
	const hero = useAppState(s => s.heroSeat);
	const isHeroTurn = g && g.betting.toAct === hero;
	const toMatch = g ? g.betting.currentBet - g.betting.contributionsRound[hero] : 0;
	if (!g) return null;
	return (
		<div style={{position:'absolute', bottom:16, left:16, display:'flex', gap:8}}>
			{isHeroTurn ? (
				<>
					<button onClick={() => act({ type: 'fold' })}>Fold</button>
					{toMatch > 0 ? (
						<button onClick={() => act({ type: 'call' })}>Call {toMatch}</button>
					) : (
						<button onClick={() => act({ type: 'check' })}>Check</button>
					)}
					{g.betting.currentBet === 0 ? (
						<button onClick={() => act({ type: 'bet', amount: g.betting.bb * 2 })}>Bet {g.betting.bb * 2}</button>
					) : (
						<button onClick={() => act({ type: 'raise', amount: g.betting.minRaise })}>Raise {g.betting.minRaise}</button>
					)}
				</>
			) : (
				<div>Waiting for opponents…</div>
			)}
		</div>
	);
}