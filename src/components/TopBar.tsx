import type { ReactNode } from 'react';
import { levelOf, update, useProgress, XP_PER_LEVEL } from '../game/progress';
import { sfx } from '../game/sound';

export function SoundToggle() {
  const { soundOn } = useProgress();
  return (
    <button
      className="icon-btn"
      aria-label={soundOn ? 'Mute sound' : 'Turn sound on'}
      onClick={() => {
        update((p) => ({ soundOn: !p.soundOn }));
        sfx.tap();
      }}
    >
      {soundOn ? '🔊' : '🔇'}
    </button>
  );
}

export function LevelBadge() {
  const { xp } = useProgress();
  const into = xp % XP_PER_LEVEL;
  return (
    <div className="lvl-badge" aria-label={`Level ${levelOf(xp)}, ${into} of ${XP_PER_LEVEL} XP`}>
      <span className="lvl-num">Lv {levelOf(xp)}</span>
      <span className="xpbar xpbar--mini">
        <span style={{ transform: `scaleX(${into / XP_PER_LEVEL})` }} />
      </span>
    </div>
  );
}

/** Back button, a centre slot (a title, the player's focus…), and the sound toggle. */
export function TopBar({ onBack, children }: { onBack: () => void; children?: ReactNode }) {
  return (
    <header className="topbar">
      <button className="icon-btn" aria-label="Back to home" onClick={onBack}>
        ←
      </button>
      {children ?? <LevelBadge />}
      <SoundToggle />
    </header>
  );
}
