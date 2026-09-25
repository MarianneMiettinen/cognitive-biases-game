// Which creature you meet, which situations it throws at you, and which card you win.
import { BIASES } from '../data/biases';
import { CREATURES, type Creature } from '../data/creatures';
import { SCENARIOS, type Scenario } from '../data/battleScenarios';
import type { Progress } from './progress';

export const HITS_TO_WIN = 3;
/** Wrong answers the player can absorb before their focus breaks and the creature recovers. */
export const FOCUS_MAX = 4;

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

/** New creatures first (in order); then whoever still guards undiscovered cards; then anyone. */
export function pickCreature(p: Progress, lastId?: string): Creature {
  const unmet = CREATURES.find((c) => !p.defeatedCreatures.includes(c.id));
  if (unmet) return unmet;
  const guarding = CREATURES.filter((c) => c.biases.some((b) => !p.unlockedCards.includes(b)));
  const fresh = guarding.filter((c) => c.id !== lastId);
  if (guarding.length) return pick(fresh.length ? fresh : guarding);
  return pick(CREATURES.filter((c) => c.id !== lastId));
}

export type Round = { scenario: Scenario; isEcho: boolean };

/**
 * Round n (0-based) of a fight: the creature's own tricks, with an "echo" every third round —
 * a bias from elsewhere, preferably one the player already owns (spaced re-exposure).
 * A scenario never repeats within one fight, however long it runs.
 */
export function makeRound(c: Creature, p: Progress, n: number, used: string[]): Round {
  const isOwn = (s: Scenario) => c.biases.includes(s.correctBias);
  const fresh = SCENARIOS.filter((s) => !used.includes(s.id));
  const wantEcho = n % 3 === 1;
  let pool = fresh.filter((s) => isOwn(s) !== wantEcho);
  if (wantEcho) {
    const known = pool.filter((s) => p.unlockedCards.includes(s.correctBias));
    if (known.length) pool = known;
  }
  if (!pool.length) pool = fresh.length ? fresh : [...SCENARIOS];
  const scenario = pick(pool);
  return { scenario, isEcho: !isOwn(scenario) };
}

export const dealHand = (s: Scenario) => shuffle([s.correctBias, ...s.distractors]);

/** The creature's own undiscovered card first, then anything you identified in the fight. */
export function pickReward(c: Creature, rounds: Round[], p: Progress): string | null {
  const candidates = [...c.biases, ...rounds.map((r) => r.scenario.correctBias)];
  return candidates.find((id) => !p.unlockedCards.includes(id)) ?? null;
}

/** Memory Chamber deck: biases you own first (so you practise what you've met), topped up to 6. */
export function memoryBiases(p: Progress, count = 6): string[] {
  const owned = shuffle(p.unlockedCards.filter((id) => BIASES.some((b) => b.id === id)));
  const rest = shuffle(BIASES.map((b) => b.id).filter((id) => !owned.includes(id)));
  return [...owned, ...rest].slice(0, count);
}
