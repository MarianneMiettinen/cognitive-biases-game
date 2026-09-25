// Memory Chamber: match each bias name with its meaning. Meaning cards stay sealed until
// you answer "What does X mean?" — so a pair is claimed through recall, not luck.
import { useEffect, useRef, useState } from 'react';
import { BIAS_BY_ID } from '../data/biases';
import { BiasIcon } from '../components/BiasIcon';
import { TopBar } from '../components/TopBar';
import { memoryBiases, shuffle } from '../game/encounter';
import { gainXp, getProgress, update, XP } from '../game/progress';
import { sfx } from '../game/sound';

type MCard = { key: string; biasId: string; kind: 'name' | 'meaning' };
type Quiz = { nameId: string; options: string[] };
type Outcome = { good: boolean; title: string; body: string };

function newDeck() {
  const ids = memoryBiases(getProgress());
  return { ids, cards: shuffle(ids.flatMap((id): MCard[] => [{ key: `n-${id}`, biasId: id, kind: 'name' }, { key: `m-${id}`, biasId: id, kind: 'meaning' }])) };
}

export function Memory({ onHome }: { onHome: () => void }) {
  const [deck, setDeck] = useState(newDeck);
  const [up, setUp] = useState<MCard[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [tries, setTries] = useState(0);
  const timer = useRef<number>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const done = claimed.length === deck.ids.length;

  function tap(c: MCard) {
    if (quiz || outcome || claimed.includes(c.biasId) || up.some((u) => u.key === c.key) || up.length >= 2) return;
    sfx.flip();
    const next = [...up, c];
    setUp(next);
    if (next.length < 2) return;
    setTries((t) => t + 1);
    const name = next.find((x) => x.kind === 'name');
    const meaning = next.find((x) => x.kind === 'meaning');
    if (!name || !meaning) {
      setRevealed(true);
      setOutcome({ good: false, title: 'Not a pair', body: 'A pair is one name and one meaning.' });
      return;
    }
    // Two options: the true meaning, and either the meaning you flipped or another from the board.
    const decoy = meaning.biasId !== name.biasId ? meaning.biasId : shuffle(deck.ids.filter((id) => id !== name.biasId))[0];
    setQuiz({ nameId: name.biasId, options: shuffle([name.biasId, decoy]) });
  }

  function answer(choice: string) {
    if (!quiz) return;
    const name = up.find((x) => x.kind === 'name')!;
    const meaning = up.find((x) => x.kind === 'meaning')!;
    const knew = choice === quiz.nameId;
    const isPair = meaning.biasId === name.biasId;
    const b = BIAS_BY_ID[name.biasId];
    setQuiz(null);
    setRevealed(true);
    if (knew && isPair) {
      sfx.pair();
      setOutcome({ good: true, title: 'Pair claimed!', body: `${b.name}: ${b.tagline}` });
      gainXp(XP.memoryPair, 'Memory pair');
      update((p) => ({ memoryProgress: { ...p.memoryProgress, pairsClaimed: p.memoryProgress.pairsClaimed + 1 } }));
      const nowClaimed = [...claimed, b.id];
      timer.current = window.setTimeout(() => {
        setClaimed(nowClaimed);
        setUp([]);
        setRevealed(false);
        setOutcome(null);
        if (nowClaimed.length === deck.ids.length) {
          update((p) => ({ memoryProgress: { ...p.memoryProgress, roundsCompleted: p.memoryProgress.roundsCompleted + 1 } }));
        }
      }, 1100);
    } else if (knew) {
      sfx.miss();
      setOutcome({ good: false, title: 'Right meaning, wrong card', body: `That card belongs to ${BIAS_BY_ID[meaning.biasId].name}. Remember where it is.` });
    } else {
      sfx.miss();
      setOutcome({ good: false, title: 'Not quite', body: `${b.name} means: ${b.shortDefinition}` });
    }
  }

  function flipBack() {
    setUp([]);
    setRevealed(false);
    setOutcome(null);
  }

  function restart() {
    setDeck(newDeck());
    setClaimed([]);
    setTries(0);
    flipBack();
  }

  return (
    <div className="screen memory">
      <TopBar onBack={onHome}>
        <h2 className="topbar-title">Memory Chamber</h2>
      </TopBar>
      <p className="memory-sub">
        Match each bias with its meaning · {claimed.length}/{deck.ids.length} pairs · {tries} tries
      </p>

      <div className="mem-grid">
        {deck.cards.map((c) => {
          const isUp = up.some((u) => u.key === c.key);
          const isClaimed = claimed.includes(c.biasId);
          const b = BIAS_BY_ID[c.biasId];
          const sealed = c.kind === 'meaning' && !revealed && !isClaimed;
          return (
            <button
              key={c.key}
              className={`mem-card ${isUp || isClaimed ? 'is-up' : ''} ${isClaimed ? 'is-claimed' : ''}`}
              onClick={() => tap(c)}
              aria-label={isUp || isClaimed ? (c.kind === 'name' ? b.name : sealed ? 'Sealed meaning' : b.tagline) : 'Face-down card'}
            >
              <span className="mem-inner">
                <span className="mem-face mem-back">✦</span>
                <span className={`mem-face mem-front mem-front--${c.kind}`}>
                  {c.kind === 'name' ? (
                    <>
                      <BiasIcon id={c.biasId} size={34} />
                      <b>{b.cardLabel ?? b.name}</b>
                    </>
                  ) : sealed ? (
                    <span className="mem-sealed">
                      <span>?</span>
                      Meaning sealed
                    </span>
                  ) : (
                    <span className="mem-meaning">{b.tagline}</span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {quiz && (
        <div className="sheet" role="dialog" aria-label="Recall question">
          <p className="sheet-q">
            What does <b>{BIAS_BY_ID[quiz.nameId].name}</b> mean?
          </p>
          {quiz.options.map((id, i) => (
            <button key={id} className="btn btn--option" onClick={() => answer(id)}>
              <span className="opt-letter">{'AB'[i]}</span>
              {BIAS_BY_ID[id].shortDefinition}
            </button>
          ))}
        </div>
      )}

      {outcome && (
        <div className={`sheet sheet--${outcome.good ? 'good' : 'bad'}`} aria-live="polite">
          <p className="sheet-q">
            <b>{outcome.title}</b>
          </p>
          <p className="sheet-body">{outcome.body}</p>
          {!outcome.good && (
            <button className="btn btn--primary" onClick={flipBack}>
              Flip back
            </button>
          )}
        </div>
      )}

      {done && !outcome && (
        <div className="overlay reward">
          <div className="rays" aria-hidden="true" />
          <p className="reward-kicker">The chamber falls silent</p>
          <h2 className="reward-title">All {deck.ids.length} pairs claimed</h2>
          <p className="reward-added">
            in {tries} tries · +{deck.ids.length * XP.memoryPair} XP earned
          </p>
          <button className="btn btn--primary" onClick={restart}>
            New chamber
          </button>
          <button className="btn" onClick={onHome}>
            Home
          </button>
        </div>
      )}
    </div>
  );
}
