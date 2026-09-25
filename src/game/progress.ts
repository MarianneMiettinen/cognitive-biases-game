// Player progress: one small object per player. It is cached in localStorage on every change
// (so the game works offline and without Firebase) and mirrored to Firestore users/{uid} when
// Firebase is configured (see cloud.ts). Each player's cache has its own key, so two people
// signing in on one device never see or overwrite each other's progress.
import { useSyncExternalStore } from 'react';

export type Progress = {
  xp: number;
  unlockedCards: string[];
  defeatedCreatures: string[];
  battlesWon: number;
  memoryProgress: { roundsCompleted: number; pairsClaimed: number };
  soundOn: boolean;
  updatedAt: number;
};

/** Device save, used before the device knows who is playing (or when Firebase isn't set up). */
const DEVICE_KEY = 'mind-hunters-save-v1';
const PLAYER_KEY = 'mind-hunters-player';
const keyFor = (uid: string) => `${DEVICE_KEY}:${uid}`;

export const CLOUD_ENABLED = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);
export const XP_PER_LEVEL = 100;
export const XP = { correct: 10, defeat: 30, newCard: 25, duplicateCard: 25, memoryPair: 10 };

const fresh = (): Progress => ({
  xp: 0,
  unlockedCards: [],
  defeatedCreatures: [],
  battlesWon: 0,
  memoryProgress: { roundsCompleted: 0, pairsClaimed: 0 },
  soundOn: true,
  updatedAt: 0,
});

export function normalize(raw: Partial<Progress> | null | undefined): Progress {
  const base = fresh();
  if (!raw) return base;
  return {
    xp: Number(raw.xp) || 0,
    unlockedCards: Array.isArray(raw.unlockedCards) ? raw.unlockedCards : [],
    defeatedCreatures: Array.isArray(raw.defeatedCreatures) ? raw.defeatedCreatures : [],
    battlesWon: Number(raw.battlesWon) || 0,
    memoryProgress: { ...base.memoryProgress, ...(raw.memoryProgress || {}) },
    soundOn: raw.soundOn ?? true,
    updatedAt: Number(raw.updatedAt) || 0,
  };
}

// localStorage can throw (private mode, blocked storage); progress then just lives in memory.
const ls = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* ignore */
    }
  },
  remove: (k: string) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  },
};

function read(key: string): Progress | null {
  try {
    const raw = ls.get(key);
    return raw ? normalize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

// Start with the last player seen on this device so returning players see their progress
// instantly, before Firebase has finished restoring their sign-in.
let activeKey = DEVICE_KEY;
const lastPlayer = CLOUD_ENABLED ? ls.get(PLAYER_KEY) : null;
if (lastPlayer) activeKey = keyFor(lastPlayer);
let state = read(activeKey) ?? fresh();

const listeners = new Set<() => void>();
let cloudSaver: ((p: Progress) => void) | null = null;

function commit(next: Progress) {
  state = next;
  ls.set(activeKey, JSON.stringify(state));
  cloudSaver?.(state);
  listeners.forEach((l) => l());
}

export const getProgress = () => state;
export const levelOf = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

export function useProgress() {
  return useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), getProgress);
}

export function update(fn: (p: Progress) => Partial<Progress>) {
  commit({ ...state, ...fn(state), updatedAt: Date.now() });
}

// --- XP with a tiny event feed so the HUD can pop "+10 XP" and "LEVEL UP" ---
export type XpEvent = { id: number; amount: number; label: string; levelUp: number | null };
const xpListeners = new Set<(e: XpEvent) => void>();
let xpEventId = 0;
export const onXp = (fn: (e: XpEvent) => void) => (xpListeners.add(fn), () => void xpListeners.delete(fn));

export function gainXp(amount: number, label: string) {
  const before = levelOf(state.xp);
  update((p) => ({ xp: p.xp + amount }));
  const after = levelOf(state.xp);
  const e = { id: ++xpEventId, amount, label, levelUp: after > before ? after : null };
  xpListeners.forEach((l) => l(e));
  return e;
}

export function unlockCard(id: string) {
  update((p) => ({ unlockedCards: p.unlockedCards.includes(id) ? p.unlockedCards : [...p.unlockedCards, id] }));
}

// --- Players ---

/** Union of what was earned anywhere: merging never loses progress. */
export function merge(a: Progress, b: Progress): Progress {
  const newer = a.updatedAt >= b.updatedAt ? a : b;
  return {
    xp: Math.max(a.xp, b.xp),
    unlockedCards: [...new Set([...a.unlockedCards, ...b.unlockedCards])],
    defeatedCreatures: [...new Set([...a.defeatedCreatures, ...b.defeatedCreatures])],
    battlesWon: Math.max(a.battlesWon, b.battlesWon),
    memoryProgress: {
      roundsCompleted: Math.max(a.memoryProgress.roundsCompleted, b.memoryProgress.roundsCompleted),
      pairsClaimed: Math.max(a.memoryProgress.pairsClaimed, b.memoryProgress.pairsClaimed),
    },
    soundOn: newer.soundOn,
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
  };
}

/**
 * Called by cloud.ts whenever Firebase reports who is signed in. The player's progress is
 * their cloud save + their cache on this device + what is on screen right now (a guest's
 * progress carries into the account they sign in to; after a sign-out the screen is blank).
 */
export function setPlayer(uid: string, remote: Partial<Progress> | null, saver: (p: Progress) => void) {
  let next = merge(read(keyFor(uid)) ?? fresh(), state);
  if (remote) next = merge(next, normalize(remote));
  const device = read(DEVICE_KEY); // played before this device knew who was playing
  if (device) {
    next = merge(next, device);
    ls.remove(DEVICE_KEY);
  }
  activeKey = keyFor(uid);
  ls.set(PLAYER_KEY, uid);
  cloudSaver = saver;
  commit(next);
}

/** Signing out: stop syncing and give the next person on this device a clean slate. */
export function clearPlayer() {
  cloudSaver = null;
  activeKey = DEVICE_KEY;
  ls.remove(PLAYER_KEY);
  commit(fresh());
}
