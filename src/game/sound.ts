// All sounds are synthesised with Web Audio — nothing to download. The context starts on
// the first tap (browsers block audio before a user gesture).
import { getProgress } from './progress';

let ctx: AudioContext | null = null;
function ac() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, opts: { type?: OscillatorType; vol?: number; delay?: number; slideTo?: number } = {}) {
  const c = ac();
  if (!c || !getProgress().soundOn) return;
  const t = c.currentTime + (opts.delay ?? 0);
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = opts.type ?? 'sine';
  o.frequency.setValueAtTime(freq, t);
  if (opts.slideTo) o.frequency.exponentialRampToValueAtTime(opts.slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(opts.vol ?? 0.15, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur: number, opts: { vol?: number; delay?: number; from?: number; to?: number } = {}) {
  const c = ac();
  if (!c || !getProgress().soundOn) return;
  const t = c.currentTime + (opts.delay ?? 0);
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(opts.from ?? 600, t);
  f.frequency.exponentialRampToValueAtTime(opts.to ?? 3000, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(opts.vol ?? 0.2, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t);
}

const notes = (freqs: number[], step: number, type: OscillatorType = 'triangle', vol = 0.12) =>
  freqs.forEach((f, i) => tone(f, 0.28, { type, vol, delay: i * step }));

export const sfx = {
  tap: () => tone(660, 0.06, { type: 'triangle', vol: 0.06 }),
  select: () => tone(520, 0.09, { type: 'triangle', vol: 0.1, slideTo: 780 }),
  attack: () => noise(0.32, { vol: 0.22, from: 500, to: 4000 }),
  hit: () => {
    tone(140, 0.22, { type: 'sine', vol: 0.35, slideTo: 60 });
    notes([784, 1175], 0.05, 'triangle', 0.1);
  },
  miss: () => {
    tone(220, 0.18, { type: 'square', vol: 0.05, slideTo: 170 });
    tone(165, 0.22, { type: 'square', vol: 0.04, delay: 0.1, slideTo: 130 });
  },
  /** Monster winds up an attack. */
  roar: () => {
    tone(110, 0.5, { type: 'sawtooth', vol: 0.07, slideTo: 70 });
    tone(116, 0.45, { type: 'sawtooth', vol: 0.05, delay: 0.03, slideTo: 64 });
    noise(0.45, { vol: 0.08, from: 300, to: 900 });
  },
  /** The player's counter bounces off. */
  block: () => {
    tone(880, 0.12, { type: 'triangle', vol: 0.07, slideTo: 620 });
    tone(1320, 0.1, { type: 'sine', vol: 0.04, delay: 0.02 });
  },
  /** Monster's attack flies at the player. */
  strike: () => noise(0.35, { vol: 0.2, from: 1800, to: 250 }),
  /** The attack lands. */
  hurt: () => {
    tone(90, 0.28, { type: 'sine', vol: 0.4, slideTo: 45 });
    tone(180, 0.2, { type: 'square', vol: 0.05, slideTo: 90 });
  },
  /** Monster recovers when the player's focus breaks. */
  heal: () => notes([392, 494, 587], 0.07, 'sine', 0.08),
  defeat: () => {
    tone(300, 0.6, { type: 'sawtooth', vol: 0.06, slideTo: 60 });
    noise(0.5, { vol: 0.12, from: 2000, to: 200, delay: 0.1 });
  },
  unlock: () => notes([523, 659, 784, 1047, 1319], 0.08, 'triangle', 0.11),
  xp: () => tone(1320, 0.08, { type: 'sine', vol: 0.06 }),
  levelUp: () => notes([392, 523, 659, 784, 1047], 0.07, 'square', 0.05),
  flip: () => noise(0.08, { vol: 0.1, from: 1500, to: 3500 }),
  pair: () => notes([659, 988, 1319], 0.07, 'sine', 0.13),
};
