import type { CSSProperties, ReactNode } from 'react';
import { BIAS_BY_ID, CATEGORIES } from '../data/biases';
import { BiasIcon } from './BiasIcon';

const catStyle = (id: string) => ({ '--cat': CATEGORIES[BIAS_BY_ID[id].category].color }) as CSSProperties;

/** Large collectible card: reward reveal and collection detail. */
export function FullCard({ id, footer }: { id: string; footer?: ReactNode }) {
  const b = BIAS_BY_ID[id];
  const cat = CATEGORIES[b.category];
  return (
    <div className="card card--full" style={catStyle(id)}>
      <span className="chip chip--cat">
        {cat.glyph} {cat.label}
      </span>
      <div className="card-art card-art--big">
        <BiasIcon id={id} size={88} />
      </div>
      <h3 className="card-title">{b.name}</h3>
      <p className="card-tagline">“{b.tagline}”</p>
      <p className="card-def">{b.shortDefinition}</p>
      <p className="card-example">
        <span>Example</span>
        {b.example}
      </p>
      {footer}
    </div>
  );
}

/** Small card: collection grid (locked cards show as a silhouette). */
export function MiniCard({ id, locked, onClick }: { id: string; locked: boolean; onClick: () => void }) {
  const b = BIAS_BY_ID[id];
  return (
    <button className={`card card--mini ${locked ? 'is-locked' : ''}`} style={catStyle(id)} onClick={onClick}>
      <span className="card-art">{locked ? <span className="lock-q">?</span> : <BiasIcon id={id} size={44} />}</span>
      <span className="card-name">{locked ? '???' : b.name}</span>
    </button>
  );
}

/** Card in the battle hand. */
export function HandCard(props: {
  id: string;
  index: number;
  owned: boolean;
  selected: boolean;
  blocked: boolean;
  onClick: (el: HTMLButtonElement) => void;
}) {
  const { id, index, owned, selected, blocked, onClick } = props;
  const b = BIAS_BY_ID[id];
  const style = { ...catStyle(id), '--i': index, '--fan': index - 2, '--lift': Math.abs(index - 2) } as CSSProperties;
  return (
    <button
      className={`card card--hand ${selected ? 'is-selected' : ''} ${blocked ? 'is-blocked' : ''}`}
      style={style}
      data-id={id}
      aria-pressed={selected}
      aria-label={`${b.name}: ${b.tagline}`}
      onClick={(e) => onClick(e.currentTarget)}
    >
      <span className="card-key" aria-hidden="true">
        {index + 1}
      </span>
      {owned && <span className="card-owned" title="In your collection">★</span>}
      <span className="card-art">
        <BiasIcon id={id} size={34} />
      </span>
      <span className="card-name">{b.cardLabel ?? b.name}</span>
      <span className="card-tagline">{b.tagline}</span>
    </button>
  );
}
