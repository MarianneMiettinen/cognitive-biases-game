// Every Bias Card in the game. To add a bias: add an entry here, give it an icon in
// components/BiasIcon.tsx (optional — a fallback glyph is used), and write scenarios for it
// in battleScenarios.ts. Nothing else needs to change.

export type Category = 'judgment' | 'probability' | 'memory' | 'decisions' | 'social';

export const CATEGORIES: Record<Category, { label: string; color: string; glyph: string }> = {
  judgment: { label: 'Judgment', color: '#f5b841', glyph: '◆' },
  probability: { label: 'Probability', color: '#3fd5e8', glyph: '●' },
  memory: { label: 'Memory', color: '#b28cff', glyph: '✦' },
  decisions: { label: 'Decisions', color: '#ff6f91', glyph: '▲' },
  social: { label: 'Social', color: '#4fe0a0', glyph: '♥' },
};

export type Bias = {
  id: string;
  name: string;
  /** Optional name for the small hand card, with soft hyphens (­) where long words may break. */
  cardLabel?: string;
  /** Tagline printed on the card in your hand — the "very short hint". */
  tagline: string;
  category: Category;
  shortDefinition: string;
  example: string;
};

export const BIASES: Bias[] = [
  {
    id: 'anchoring',
    name: 'Anchoring',
    tagline: 'The first number drags the rest.',
    category: 'judgment',
    shortDefinition: 'A number or idea you meet first pulls your later estimates toward it — even when it is irrelevant.',
    example: 'Seeing a €900 jacket first can make a €500 one feel cheap.',
  },
  {
    id: 'availability',
    name: 'Availability Heuristic',
    cardLabel: 'Avail­ability Heuristic',
    tagline: 'Easy to recall feels more likely.',
    category: 'memory',
    shortDefinition: 'We judge how common or likely something is by how easily examples pop into mind.',
    example: 'After a week of break-in stories on the news, your quiet street suddenly feels unsafe.',
  },
  {
    id: 'representativeness',
    name: 'Representativeness',
    cardLabel: 'Repre­sent­a­tive­ness',
    tagline: 'Looks like it, so it must be it.',
    category: 'probability',
    shortDefinition: 'Judging probability by how much something resembles our mental picture of a category, instead of by the actual odds.',
    example: 'A coin landing H-T-T-H-T-H "feels" more random than H-H-H-H-H-H, though both are equally likely.',
  },
  {
    id: 'loss-aversion',
    name: 'Loss Aversion',
    tagline: 'Losing hurts more than winning pleases.',
    category: 'decisions',
    shortDefinition: 'A loss feels roughly twice as strong as a gain of the same size, so we work hard to avoid losing.',
    example: 'Losing €20 ruins your afternoon; finding €20 only makes you smile for a minute.',
  },
  {
    id: 'framing',
    name: 'Framing Effect',
    tagline: 'Same facts, different wrapping.',
    category: 'decisions',
    shortDefinition: 'The same information leads to different choices depending on how it is worded or presented.',
    example: '"80% lean" mince sounds healthier than "20% fat" mince — it is the same meat.',
  },
  {
    id: 'endowment',
    name: 'Endowment Effect',
    tagline: "It's mine, so it's worth more.",
    category: 'decisions',
    shortDefinition: 'We value things more highly simply because we own them.',
    example: 'You would not pay €30 for a mug, but you would not sell your own mug for €30 either.',
  },
  {
    id: 'planning-fallacy',
    name: 'Planning Fallacy',
    tagline: "This time it'll be quick.",
    category: 'judgment',
    shortDefinition: 'We underestimate how long and how much our own plans will take, even when similar past projects ran late.',
    example: 'You plan to pack for a move in one evening. It takes the whole weekend — again.',
  },
  {
    id: 'sunk-cost',
    name: 'Sunk Cost Effect',
    tagline: "I've come too far to quit.",
    category: 'decisions',
    shortDefinition: 'Continuing something because of what we have already spent on it, rather than what it will bring from now on.',
    example: 'Finishing a meal you dislike because you paid for it.',
  },
  {
    id: 'regression',
    name: 'Regression to the Mean',
    cardLabel: 'Regres­sion to the Mean',
    tagline: 'Extremes drift back to normal.',
    category: 'probability',
    shortDefinition: 'An unusually high or low result is usually followed by a more average one — no special cause needed.',
    example: 'A student who aced one test by luck scores closer to their usual level on the next.',
  },
  {
    id: 'overconfidence',
    name: 'Overconfidence',
    cardLabel: 'Over­confi­dence',
    tagline: "I'm surer than I should be.",
    category: 'judgment',
    shortDefinition: 'Our confidence in what we know or can do runs ahead of how accurate we actually are.',
    example: 'You are "100% sure" of a quiz answer — and it is wrong.',
  },
  {
    id: 'base-rate',
    name: 'Base-Rate Neglect',
    tagline: 'Forgetting how common it is overall.',
    category: 'probability',
    shortDefinition: 'Ignoring how common something is in general and focusing only on the specific details in front of us.',
    example: 'A positive result on a rare-disease test feels like certainty, even when most positives are false alarms.',
  },
  {
    id: 'halo',
    name: 'Halo Effect',
    tagline: 'One shiny trait lights up the rest.',
    category: 'social',
    shortDefinition: 'One good impression of a person or thing spills over into how we judge its unrelated qualities.',
    example: 'Assuming a charming speaker must also be honest and competent.',
  },
];

export const BIAS_BY_ID: Record<string, Bias> = Object.fromEntries(BIASES.map((b) => [b.id, b]));
