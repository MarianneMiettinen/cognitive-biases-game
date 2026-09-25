import { useEffect, useRef, useState } from 'react';
import { FullCard } from '../components/BiasCard';
import { gainXp, XP } from '../game/progress';
import { sfx } from '../game/sound';

export function Reward(props: {
  creatureName: string;
  cardId: string;
  isNew: boolean;
  onNext: () => void;
  onCollection: () => void;
  onHome: () => void;
}) {
  const { creatureName, cardId, isNew, onNext, onCollection, onHome } = props;
  const [revealed, setRevealed] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (revealed) nextRef.current?.focus({ preventScroll: true }); // Enter continues on desktop
  }, [revealed]);

  function reveal() {
    if (revealed) return;
    setRevealed(true);
    sfx.unlock();
    gainXp(isNew ? XP.newCard : XP.duplicateCard, isNew ? 'New bias discovered' : 'Card mastered');
  }

  return (
    <div className="overlay reward" role="dialog" aria-label="Victory reward">
      <div className="rays" aria-hidden="true" />
      <p className="reward-kicker">{creatureName} dissolves!</p>
      <h2 className="reward-title">{isNew ? 'New card discovered' : 'Card mastered'}</h2>

      <button className={`flip ${revealed ? 'is-revealed' : ''}`} onClick={reveal} aria-label="Reveal card" autoFocus>
        <span className="flip-inner">
          <span className="flip-face flip-back">
            <span className="cardback-sigil">✦</span>
            <span className="cardback-text">Tap to reveal</span>
          </span>
          <span className="flip-face flip-front">
            <FullCard id={cardId} />
          </span>
        </span>
      </button>

      <div className={`reward-after ${revealed ? 'is-shown' : ''}`}>
        <p className="reward-added">
          {isNew ? '✦ Added to your Collection · +25 XP' : 'Already in your collection · +25 XP instead'}
        </p>
        <button ref={nextRef} className="btn btn--primary" onClick={onNext} disabled={!revealed}>
          Next creature →
        </button>
        <div className="btn-row">
          <button className="btn" onClick={onCollection} disabled={!revealed}>
            Collection
          </button>
          <button className="btn" onClick={onHome} disabled={!revealed}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
