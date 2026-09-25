// Creatures of the Mindwilds, in encounter order. `biases` are the tricks a creature
// embodies: most of its battle rounds come from those biases, and defeating it
// discovers one of their cards. Art lives in components/CreatureArt.tsx, keyed by id.

export type Creature = {
  id: string;
  name: string;
  epithet: string;
  biases: string[];
  maxHp: number;
  /** Glow colour used behind the creature and for its projectile hits. */
  aura: string;
};

export const CREATURES: Creature[] = [
  { id: 'anchor-crab', name: 'Anchor Crab', epithet: 'Drags every guess toward its first number.', biases: ['anchoring'], maxHp: 90, aura: '#f5b841' },
  { id: 'memory-moth', name: 'Memory Moth', epithet: 'Feeds on vivid memories until they feel like the whole truth.', biases: ['availability'], maxHp: 90, aura: '#b28cff' },
  { id: 'framing-fox', name: 'Framing Fox', epithet: 'Wraps plain facts in gilded frames.', biases: ['framing', 'halo'], maxHp: 90, aura: '#ff9a52' },
  { id: 'loss-wraith', name: 'Loss Wraith', epithet: 'Clutches every coin it has ever touched.', biases: ['loss-aversion', 'endowment', 'sunk-cost'], maxHp: 90, aura: '#ff6f91' },
  { id: 'pattern-imp', name: 'Pattern Imp', epithet: 'Sees familiar shapes in every stranger and every shuffle.', biases: ['representativeness', 'base-rate'], maxHp: 90, aura: '#3fd5e8' },
  { id: 'oracle-owl', name: 'Oracle Owl', epithet: 'Always certain. Always behind schedule.', biases: ['overconfidence', 'planning-fallacy'], maxHp: 90, aura: '#f5d76e' },
  { id: 'tide-serpent', name: 'Tide Serpent', epithet: 'Rises to wild heights, then sinks back to the middle.', biases: ['regression'], maxHp: 90, aura: '#4fb6ff' },
];

export const CREATURE_BY_ID: Record<string, Creature> = Object.fromEntries(CREATURES.map((c) => [c.id, c]));
