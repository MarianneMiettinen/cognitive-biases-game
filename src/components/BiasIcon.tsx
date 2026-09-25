// Line-art glyph for each bias, drawn in the card's category colour.
// A new bias without an entry here falls back to its category glyph.
import { BIAS_BY_ID, CATEGORIES } from '../data/biases';

const GLYPHS: Record<string, JSX.Element> = {
  anchoring: (
    <>
      <circle cx="24" cy="8" r="4" />
      <path d="M24 12v30M15 19h18M8 29c1 8 7 13 16 13s15-5 16-13M5 32l3-4 4 3M43 32l-3-4-4 3" />
    </>
  ),
  availability: (
    <>
      <path className="fill" d="M27 4 13 27h10l-3 17 15-24h-9z" />
      <path d="M6 12l4 2M42 12l-4 2M6 36l4-2M42 36l-4-2" />
    </>
  ),
  representativeness: (
    <>
      <path className="fill" d="M9 9q15-6 30 0v15q0 16-15 19Q9 40 9 24z" />
      <path d="M15 19q3-3 6 0M27 19q3-3 6 0M17 30q7 6 14 0" />
    </>
  ),
  'base-rate': (
    <>
      {[10, 24, 38].flatMap((x) => [10, 24, 38].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="3" className="fill" />))}
      <circle cx="38" cy="38" r="8" />
    </>
  ),
  regression: (
    <>
      <path d="M3 30q5-26 10 0t9 0 8 0 8 0 7 0" />
      <path d="M3 30h42" strokeDasharray="2 4" strokeWidth="2" />
    </>
  ),
  'loss-aversion': (
    <>
      <path d="M24 6v36M14 42h20M8 14l32 8" />
      <path className="fill" d="M3 26q5 8 10 0l-5-12zM35 30q5 6 10 0l-5-8z" />
      <circle cx="8" cy="23" r="2.5" className="fill" />
    </>
  ),
  framing: (
    <>
      <rect x="6" y="9" width="36" height="30" rx="2" />
      <rect x="12" y="15" width="24" height="18" className="fill" />
      <path d="M13 32l7-8 5 5 4-4 7 7" />
    </>
  ),
  endowment: (
    <>
      <path className="fill" d="M15 13l5-6h8l5 6-9 12z" />
      <path d="M15 13h18M4 33q8-3 14 1h9q4 0 4 3H19M4 42h26q7 0 13-9" />
    </>
  ),
  'planning-fallacy': (
    <>
      <path d="M12 5h24M12 43h24M15 5q0 13 9 19 9 6 9 19M33 5q0 13-9 19-9 6-9 19" />
      <path className="fill" d="M18 43q2-7 6-8 4 1 6 8z" />
    </>
  ),
  'sunk-cost': (
    <>
      <circle cx="24" cy="17" r="9" className="fill" />
      <path d="M21 14q3-3 6 0M20 18h7M20 21h7" strokeWidth="2" />
      <path d="M3 33q5-4 10 0t10 0 10 0 10 0M3 41q5-4 10 0t10 0 10 0 10 0" />
    </>
  ),
  overconfidence: (
    <>
      <path className="fill" d="M8 34 10 13l8 10 6-14 6 14 8-10 2 21z" />
      <path d="M8 40h32" />
    </>
  ),
  halo: (
    <>
      <ellipse cx="24" cy="9" rx="13" ry="4" />
      <circle cx="24" cy="27" r="8" className="fill" />
      <path d="M10 45q14-12 28 0" />
    </>
  ),
};

export function BiasIcon({ id, size = 40 }: { id: string; size?: number }) {
  const bias = BIAS_BY_ID[id];
  const color = bias ? CATEGORIES[bias.category].color : '#ccc';
  return (
    <svg className="bias-icon" viewBox="0 0 48 48" width={size} height={size} style={{ color }} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {GLYPHS[id] ?? (
          <text x="24" y="33" textAnchor="middle" fontSize="26" fill="currentColor" stroke="none">
            {bias ? CATEGORIES[bias.category].glyph : '?'}
          </text>
        )}
      </g>
    </svg>
  );
}
