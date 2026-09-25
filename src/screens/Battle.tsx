import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BIAS_BY_ID, CATEGORIES } from '../data/biases';
import { HandCard } from '../components/BiasCard';
import { CreatureArt } from '../components/CreatureArt';
import { TopBar } from '../components/TopBar';
import { Reward } from './Reward';
import { dealHand, FOCUS_MAX, HITS_TO_WIN, makeRound, pickCreature, pickReward, type Round } from '../game/encounter';
import { gainXp, getProgress, unlockCard, update, useProgress, XP } from '../game/progress';
import { sfx } from '../game/sound';

let lastCreatureId: string | undefined;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A glowing orb flies across the screen (Web Animations API, transform + opacity only). */
function flyOrb(className: string, color: string, from: DOMRect, to: { x: number; y: number }, endScale: number, ms: number) {
  return new Promise<void>((resolve) => {
    const el = document.createElement('div');
    el.className = className;
    el.style.setProperty('--c', color);
    document.body.appendChild(el);
    const duration = reducedMotion() ? 120 : ms;
    const anim = el.animate(
      [
        { transform: `translate(${from.left + from.width / 2}px, ${from.top + from.height / 2}px) scale(.6)`, opacity: 0.6 },
        { transform: `translate(${to.x}px, ${to.y}px) scale(${endScale})`, opacity: 1 },
      ],
      { duration, easing: 'cubic-bezier(.45,0,.75,.55)' },
    );
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      el.remove();
      resolve();
    };
    anim.onfinish = done;
    setTimeout(done, duration + 120); // onfinish can stall in a backgrounded tab; never block the battle
  });
}

type Phase = 'enemy' | 'choose' | 'busy' | 'won';
type Feedback = { kind: 'hit' | 'miss' | 'break'; title: string; body: string } | null;
type Fx = { n: number; kind: '' | 'charge' | 'hit' | 'block' | 'strike' | 'heal'; amount: number; crit: boolean };

export function Battle({ onHome, onNext, onCollection }: { onHome: () => void; onNext: () => void; onCollection: () => void }) {
  const progress = useProgress();
  const [creature] = useState(() => {
    const c = pickCreature(getProgress(), lastCreatureId);
    lastCreatureId = c.id;
    return c;
  });
  const damagePerHit = Math.ceil(creature.maxHp / HITS_TO_WIN);

  const [rounds, setRounds] = useState<Round[]>(() => [makeRound(creature, getProgress(), 0, [])]);
  const round = rounds[rounds.length - 1];
  const [hp, setHp] = useState(creature.maxHp);
  const [focus, setFocus] = useState(FOCUS_MAX);
  const [hand, setHand] = useState(() => dealHand(rounds[0].scenario));
  const [selected, setSelected] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [played, setPlayed] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('enemy');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [fx, setFx] = useState<Fx>({ n: 0, kind: '', amount: 0, crit: false });
  const [orb, setOrb] = useState({ key: 0, gone: false });
  const [hurt, setHurt] = useState(0);
  const [reward, setReward] = useState<{ cardId: string; isNew: boolean } | null>(null);

  const creatureRef = useRef<HTMLDivElement>(null);
  const attacking = useRef(false); // sync guard: rapid taps can beat the `phase` re-render
  const timers = useRef<number[]>([]);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      timers.current.forEach(clearTimeout);
    };
  }, []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  const wait = (ms: number) => new Promise<void>((r) => later(r, ms));
  const fire = (kind: Fx['kind'], amount = 0, crit = false) => setFx((f) => ({ n: f.n + 1, kind, amount, crit }));

  // Every round opens with the monster winding up an attack: a distorted thought.
  useEffect(() => {
    setPhase('enemy');
    fire('charge');
    sfx.roar();
    const t = window.setTimeout(() => setPhase((p) => (p === 'enemy' ? 'choose' : p)), reducedMotion() ? 150 : 800);
    return () => clearTimeout(t);
  }, [rounds.length]);

  function tapCard(id: string) {
    if (phase === 'busy' || phase === 'won' || blocked.includes(id)) return;
    if (selected !== id) {
      setSelected(id);
      sfx.select();
      return;
    }
    attack(id);
  }

  async function attack(id: string) {
    const cardEl = document.querySelector<HTMLElement>(`.card--hand[data-id="${id}"]`);
    const foeEl = creatureRef.current;
    if (!cardEl || !foeEl || attacking.current || phase === 'busy' || phase === 'won') return;
    attacking.current = true;
    const correct = id === round.scenario.correctBias;
    const bias = BIAS_BY_ID[id];
    setPhase('busy');
    setPlayed(id);
    setFeedback(null);
    sfx.attack();
    const fr = foeEl.getBoundingClientRect();
    await flyOrb('projectile', CATEGORIES[bias.category].color, cardEl.getBoundingClientRect(), { x: fr.left + fr.width / 2, y: fr.top + fr.height * (correct ? 0.5 : 0.8) }, 1.3, 360);
    if (!alive.current) return;

    if (correct) {
      const crit = blocked.length === 0;
      const newHp = Math.max(0, hp - damagePerHit);
      sfx.hit();
      setHp(newHp);
      setOrb((o) => ({ ...o, gone: true }));
      fire('hit', damagePerHit, crit);
      setFeedback({ kind: 'hit', title: crit ? 'Critical counter!' : 'Countered!', body: `${bias.name}: ${bias.tagline}` });
      gainXp(XP.correct, 'Correct counter');
      if (newHp <= 0) later(win, 1100);
      else later(nextRound, 1900);
      return;
    }

    // The counter bounces off, and the monster's attack lands on you.
    sfx.block();
    fire('block');
    setBlocked((b) => [...b, id]);
    setSelected(null);
    setPlayed(null);
    setHint(round.scenario.hint);
    await wait(280);
    if (!alive.current) return;
    const orbEl = document.querySelector('.threat');
    if (orbEl) {
      sfx.strike();
      fire('strike');
      const from = orbEl.getBoundingClientRect();
      setOrb((o) => ({ ...o, gone: true }));
      await flyOrb('strike-orb', creature.aura, from, { x: window.innerWidth / 2, y: window.innerHeight * 0.62 }, 9, 380);
      if (!alive.current) return;
    }
    sfx.hurt();
    setHurt((h) => h + 1);
    setOrb((o) => ({ key: o.key + 1, gone: false }));
    const left = focus - 1;
    if (left > 0) {
      setFocus(left);
      setFeedback({ kind: 'miss', title: `Ouch! It wasn't ${bias.name}.`, body: `${bias.name} means: “${bias.tagline}”` });
      setPhase('choose');
      attacking.current = false;
      return;
    }
    // Focus broken: the monster recovers one hit, your focus refills. Mistakes cost time, never the game.
    setFocus(0);
    const heals = hp < creature.maxHp;
    setFeedback({
      kind: 'break',
      title: 'Your focus breaks!',
      body: heals ? `${creature.name} regains strength. Take a breath: your focus returns.` : 'Take a breath: your focus returns.',
    });
    await wait(900);
    if (!alive.current) return;
    if (heals) {
      setHp((h) => Math.min(creature.maxHp, h + damagePerHit));
      fire('heal', damagePerHit);
      sfx.heal();
    }
    setFocus(FOCUS_MAX);
    setPhase('choose');
    attacking.current = false;
  }

  function nextRound() {
    const used = rounds.map((r) => r.scenario.id);
    const next = makeRound(creature, getProgress(), rounds.length, used);
    setRounds((rs) => [...rs, next]);
    setHand(dealHand(next.scenario));
    setBlocked([]);
    setSelected(null);
    setPlayed(null);
    setHint(null);
    setFeedback(null);
    setOrb((o) => ({ key: o.key + 1, gone: false }));
    attacking.current = false;
  }

  function win() {
    setPhase('won');
    sfx.defeat();
    later(() => {
      const p = getProgress();
      update((q) => ({
        battlesWon: q.battlesWon + 1,
        defeatedCreatures: q.defeatedCreatures.includes(creature.id) ? q.defeatedCreatures : [...q.defeatedCreatures, creature.id],
      }));
      gainXp(XP.defeat, `${creature.name} defeated`);
      const fresh = pickReward(creature, rounds, p);
      if (fresh) unlockCard(fresh);
      setReward({ cardId: fresh ?? creature.biases[0], isNew: !!fresh });
    }, 900);
  }

  // Desktop: 1–5 picks a card (press it again to counter), Enter counters with the selected card.
  const keys = useRef<(e: KeyboardEvent) => void>();
  keys.current = (e) => {
    if (reward || e.metaKey || e.ctrlKey || e.altKey) return;
    const n = Number(e.key);
    if (n >= 1 && n <= hand.length) {
      e.preventDefault();
      tapCard(hand[n - 1]);
    } else if (e.key === 'Enter' && selected && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      attack(selected);
    }
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => keys.current?.(e);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const selBias = selected ? BIAS_BY_ID[selected] : null;
  const hpPct = (hp / creature.maxHp) * 100;
  const defeated = phase === 'won';

  return (
    <div className={`screen battle ${hurt ? `hurt-${hurt % 2}` : ''}`}>
      <TopBar onBack={onHome}>
        <div className="focus" role="img" aria-label={`Your focus: ${focus} of ${FOCUS_MAX}`}>
          <span className="focus-label">Focus</span>
          {Array.from({ length: FOCUS_MAX }, (_, i) => (
            <span key={i} className={`heart ${i < focus ? 'is-full' : ''}`}>
              ♥
            </span>
          ))}
        </div>
      </TopBar>

      <section className="arena" style={{ '--aura': creature.aura } as CSSProperties}>
        <div className={`foe-plate ${fx.kind === 'heal' ? 'is-healing' : ''}`} key={fx.kind === 'heal' ? `heal${fx.n}` : 'plate'}>
          <div className="foe-name">
            <span>{creature.name}</span>
            <span className="foe-lv">Lv {progress.battlesWon + 1}</span>
          </div>
          <div className="hpbar" role="progressbar" aria-valuenow={hp} aria-valuemax={creature.maxHp} aria-label="Monster health">
            <div className="hpbar-lag" style={{ transform: `scaleX(${hpPct / 100})` }} />
            <div className={`hpbar-fill ${hpPct <= 34 ? 'is-low' : ''}`} style={{ transform: `scaleX(${hpPct / 100})` }} />
            <span className="hpbar-text">
              {hp} / {creature.maxHp}
            </span>
          </div>
        </div>
        <div className="stage" ref={creatureRef}>
          <div className="aura" />
          <div key={fx.n} className={`creature ${fx.kind ? `fx-${fx.kind}` : ''} ${defeated ? 'is-defeated' : ''}`}>
            <div className="creature-idle">
              <CreatureArt id={creature.id} />
            </div>
          </div>
          {!defeated && <div key={`o${orb.key}`} className={`threat ${orb.gone ? 'is-gone' : ''}`} />}
          {fx.kind === 'hit' && (
            <div key={`d${fx.n}`} className={`damage ${fx.crit ? 'is-crit' : ''}`}>
              {fx.crit && <small>CRIT</small>}-{fx.amount}
            </div>
          )}
          {fx.kind === 'heal' && (
            <div key={`h${fx.n}`} className="damage is-heal">
              +{fx.amount}
            </div>
          )}
          {fx.kind === 'hit' && <div key={`s${fx.n}`} className="slash" />}
          {fx.kind === 'block' && <div key={`b${fx.n}`} className="shield" />}
        </div>
      </section>

      <section className={`scenario ${round.isEcho ? 'is-echo' : ''}`} key={rounds.length}>
        <p className="scenario-kicker">{round.isEcho ? 'An echo of another trick…' : `${creature.name} attacks!`}</p>
        <p className="scenario-text">{round.scenario.prompt}</p>
        {hint && <p className="scenario-hint">💡 {hint}</p>}
      </section>

      <div className={`strip ${feedback ? `strip--${feedback.kind}` : phase === 'enemy' ? 'strip--warn' : ''}`} aria-live="polite">
        {selBias && phase === 'choose' ? (
          <>
            <div className="strip-text">
              <b>{selBias.name}</b>
              <span>{selBias.tagline}</span>
            </div>
            <button className="btn btn--attack" onClick={() => attack(selBias.id)}>
              Counter ⚔
            </button>
          </>
        ) : feedback ? (
          <div className="strip-text">
            <b>{feedback.title}</b>
            <span>{feedback.body}</span>
          </div>
        ) : phase === 'enemy' ? (
          <div className="strip-text strip-text--center">
            <b>⚠ Brace yourself…</b>
          </div>
        ) : (
          <div className="strip-text strip-text--center">
            <b>Counter it: which bias is this?</b>
            <span>
              Tap a card to read it, tap again to counter<span className="kbd-hint"> · or press 1–5</span>
            </span>
          </div>
        )}
      </div>

      <div className={`hand ${feedback?.kind === 'hit' ? 'is-resolved' : ''}`} key={`h${rounds.length}`}>
        {hand.map((id, i) => (
          <HandCard
            key={id}
            id={id}
            index={i}
            owned={progress.unlockedCards.includes(id)}
            selected={selected === id || played === id}
            blocked={blocked.includes(id)}
            onClick={() => tapCard(id)}
          />
        ))}
      </div>

      {hurt > 0 && <div key={`hurt${hurt}`} className="hurt-flash" aria-hidden="true" />}

      {reward && (
        <Reward
          creatureName={creature.name}
          cardId={reward.cardId}
          isNew={reward.isNew}
          onNext={onNext}
          onCollection={onCollection}
          onHome={onHome}
        />
      )}
    </div>
  );
}
