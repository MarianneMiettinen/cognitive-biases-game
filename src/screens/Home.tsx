import { BIASES } from '../data/biases';
import { CREATURES } from '../data/creatures';
import { CreatureArt } from '../components/CreatureArt';
import { SoundToggle } from '../components/TopBar';
import { signInWithGoogle, signOutPlayer, useCloud } from '../game/cloud';
import { CLOUD_ENABLED, levelOf, useProgress, XP_PER_LEVEL } from '../game/progress';

function SaveStatus() {
  const cloud = useCloud();
  if (!CLOUD_ENABLED) return <p>Progress saves automatically in this browser. No account needed.</p>;
  if (cloud.status === 'connecting') return <p>Loading your save…</p>;
  return (
    <>
      {cloud.status === 'offline' && <p>Offline: progress is kept on this device and syncs when you're back online.</p>}
      {cloud.status !== 'offline' && cloud.isAnonymous && <p>Playing as a guest. Progress saves automatically, no account needed.</p>}
      {cloud.isAnonymous ? (
        <button className="link-btn" onClick={() => signInWithGoogle()}>
          Sign in with Google to continue on other devices
        </button>
      ) : (
        <p>
          Signed in as <b>{cloud.name}</b> ·{' '}
          <button className="link-btn link-btn--inline" onClick={() => signOutPlayer()}>
            Sign out
          </button>
        </p>
      )}
      {cloud.error && <p className="save-error">{cloud.error}</p>}
    </>
  );
}

export function Home({ onBattle, onMemory, onCollection }: { onBattle: () => void; onMemory: () => void; onCollection: () => void }) {
  const p = useProgress();
  const into = p.xp % XP_PER_LEVEL;
  const isNew = p.battlesWon === 0 && p.xp === 0;
  const unmet = CREATURES.find((c) => !p.defeatedCreatures.includes(c.id));

  return (
    <div className="screen home">
      <div className="home-top">
        <SoundToggle />
      </div>

      <div className="logo">
        <svg className="logo-sigil" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
          <path d="M8 50q42-38 84 0-42 38-84 0z" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="50" cy="50" r="14" fill="currentColor" />
          <circle cx="45" cy="45" r="4" fill="#fff" />
        </svg>
        <h1>
          Mind <span>Hunters</span>
        </h1>
        <p className="tagline">Master the tricks your mind plays on you.</p>
      </div>

      <div className="home-status">
        <div className="player-panel">
          <div className="player-row">
            <span className="player-level">Level {levelOf(p.xp)}</span>
            <span className="player-xp">
              {into} / {XP_PER_LEVEL} XP
            </span>
          </div>
          <div className="xpbar">
            <span style={{ transform: `scaleX(${into / XP_PER_LEVEL})` }} />
          </div>
          <div className="player-row player-row--sub">
            <span>
              <b>{p.unlockedCards.length}</b> / {BIASES.length} biases discovered
            </span>
            <span>
              {p.battlesWon} {p.battlesWon === 1 ? 'victory' : 'victories'}
            </span>
          </div>
        </div>

        {unmet && (
          <button className="foe-preview" onClick={onBattle}>
            <span className="foe-preview-art">
              <CreatureArt id={unmet.id} />
            </span>
            <span className="foe-preview-text">
              <small>A new monster stirs…</small>
              <b>
                {p.defeatedCreatures.length} / {CREATURES.length} monsters defeated
              </b>
            </span>
          </button>
        )}
      </div>

      <nav className="home-menu">
        <button className="btn btn--primary btn--big" onClick={onBattle}>
          <span className="menu-icon">⚔</span> {isNew ? 'Begin Adventure' : 'Continue Adventure'}
        </button>
        <button className="btn btn--big" onClick={onMemory}>
          <span className="menu-icon">✦</span> Memory Chamber
        </button>
        <button className="btn btn--big" onClick={onCollection}>
          <span className="menu-icon">▦</span> Collection
        </button>
      </nav>

      <footer className="save-status">
        <SaveStatus />
      </footer>
    </div>
  );
}
