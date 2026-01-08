import { useEffect } from 'react';
import PixiRenderer from './ui/PixiRenderer';
import { useAppState } from './app/AppState';
import Controls from './ui/overlay/Controls';
import HUD from './ui/overlay/HUD';

export default function App() {
  const initGame = useAppState(s => s.initGame);
  const dealHand = useAppState(s => s.dealHand);
   const auto = useAppState(s => s.autoPlay);
   const toggleAuto = useAppState(s => s.toggleAutoPlay);
  useEffect(() => { initGame(); }, [initGame]);
  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div className="topbar">
        <strong>6-Max Hold’em</strong>
        <div style={{marginLeft:'auto', display:'flex', gap:8}}>
          <button onClick={dealHand}>Deal Hand</button>
           <button onClick={toggleAuto}>{auto ? 'Auto: On' : 'Auto: Off'}</button>
        </div>
      </div>
      <div style={{position:'relative', flex:1}}>
        <PixiRenderer />
        <HUD />
        <Controls />
      </div>
    </div>
  );
}