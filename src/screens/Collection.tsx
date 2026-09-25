import { useState } from 'react';
import { BIASES, CATEGORIES, type Category } from '../data/biases';
import { CREATURES } from '../data/creatures';
import { FullCard, MiniCard } from '../components/BiasCard';
import { TopBar } from '../components/TopBar';
import { useProgress } from '../game/progress';
import { sfx } from '../game/sound';

export function Collection({ onHome }: { onHome: () => void }) {
  const p = useProgress();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [open, setOpen] = useState<string | null>(null);
  const [lockedMsg, setLockedMsg] = useState<string | null>(null);

  const shown = BIASES.filter((b) => filter === 'all' || b.category === filter);
  const owned = p.unlockedCards.length;

  function tap(id: string) {
    if (p.unlockedCards.includes(id)) {
      sfx.select();
      setOpen(id);
      setLockedMsg(null);
    } else {
      sfx.miss();
      const guard = CREATURES.find((c) => c.biases.includes(id));
      setLockedMsg(guard && p.defeatedCreatures.includes(guard.id) ? `Guarded by the ${guard.name}. Face it again.` : 'Undiscovered. Defeat more creatures to find it.');
    }
  }

  return (
    <div className="screen collection">
      <TopBar onBack={onHome}>
        <h2 className="topbar-title">Collection</h2>
      </TopBar>
      <div className="collection-count">
        <span>
          <b>{owned}</b> / {BIASES.length} discovered
        </span>
        <div className="xpbar xpbar--gold">
          <span style={{ transform: `scaleX(${owned / BIASES.length})` }} />
        </div>
      </div>

      <div className="chips" role="tablist">
        {(['all', ...Object.keys(CATEGORIES)] as (Category | 'all')[]).map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={filter === c}
            className={`chip ${filter === c ? 'is-on' : ''}`}
            style={c === 'all' ? undefined : ({ '--cat': CATEGORIES[c].color } as React.CSSProperties)}
            onClick={() => {
              setFilter(c);
              sfx.tap();
            }}
          >
            {c === 'all' ? 'All' : `${CATEGORIES[c].glyph} ${CATEGORIES[c].label}`}
          </button>
        ))}
      </div>

      <p className={`locked-msg ${lockedMsg ? 'is-shown' : ''}`} aria-live="polite">
        {lockedMsg ?? ' '}
      </p>

      <div className="card-grid">
        {shown.map((b) => (
          <MiniCard key={b.id} id={b.id} locked={!p.unlockedCards.includes(b.id)} onClick={() => tap(b.id)} />
        ))}
      </div>

      {open && (
        <div className="overlay detail" role="dialog" aria-label="Card detail" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FullCard id={open} />
          </div>
          <button className="btn" onClick={() => setOpen(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
