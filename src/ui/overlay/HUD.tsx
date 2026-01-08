import { useAppState } from '../../app/AppState';

export default function HUD() {
	const g = useAppState(s => s.game);
	const hero = useAppState(s => s.heroSeat);
	if (!g) return null;
	const isHeroTurn = g.betting.toAct === hero;
	const seatText = isHeroTurn ? 'Your turn' : `Seat ${g.betting.toAct} to act`;
	return (
		<div style={{position:'absolute', top:8, left:8, color:'#fff'}}>
			<div>{seatText} • Street: {g.betting.street}</div>
		</div>
	);
}