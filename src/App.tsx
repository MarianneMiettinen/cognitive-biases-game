import { useEffect, useState } from 'react';
import { Home } from './screens/Home';
import { Battle } from './screens/Battle';
import { Collection } from './screens/Collection';
import { Memory } from './screens/Memory';
import { onXp, type XpEvent } from './game/progress';
import { sfx } from './game/sound';

type Screen = 'home' | 'battle' | 'collection' | 'memory';

/** Floating "+10 XP" chips and the LEVEL UP banner, shown above every screen. */
function XpToasts() {
  const [items, setItems] = useState<XpEvent[]>([]);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  useEffect(
    () =>
      onXp((e) => {
        sfx.xp();
        setItems((list) => [...list.slice(-2), e]);
        setTimeout(() => setItems((list) => list.filter((x) => x.id !== e.id)), 1600);
        if (e.levelUp) {
          setTimeout(() => sfx.levelUp(), 250);
          setLevelUp(e.levelUp);
          setTimeout(() => setLevelUp(null), 2200);
        }
      }),
    [],
  );
  return (
    <div className="toasts" aria-live="polite">
      {items.map((e) => (
        <div key={e.id} className="toast">
          <b>+{e.amount} XP</b> {e.label}
        </div>
      ))}
      {levelUp && (
        <div className="levelup">
          <small>Level up!</small>
          <b>Lv {levelUp}</b>
        </div>
      )}
    </div>
  );
}

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [battleKey, setBattleKey] = useState(0);
  const go = (s: Screen) => () => {
    sfx.tap();
    setScreen(s);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <div className="bg" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="mote" style={{ '--m': i } as React.CSSProperties} />
        ))}
      </div>
      <main className="frame">
        {screen === 'home' && <Home onBattle={go('battle')} onMemory={go('memory')} onCollection={go('collection')} />}
        {screen === 'battle' && (
          <Battle key={battleKey} onHome={go('home')} onCollection={go('collection')} onNext={() => setBattleKey((k) => k + 1)} />
        )}
        {screen === 'collection' && <Collection onHome={go('home')} />}
        {screen === 'memory' && <Memory onHome={go('home')} />}
        <XpToasts />
      </main>
    </div>
  );
}
