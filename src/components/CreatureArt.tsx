// Monsters of the Mindwilds, drawn in SVG. Each one carries a visual clue to its bias:
// the crab's anchor, the moth's glowing memories, the fox's gilded frame, the wraith's coins,
// the imp's dice, the owl's crown and hourglass, the serpent's rising-and-falling tide.

const INK = '#12081f';

/** Glowing slit eye with an angry brow. `side` is the eye's side as the viewer sees it. */
function Eye(props: { id: string; x: number; y: number; r: number; side: 'l' | 'r'; glow: string; deep: string; tilt?: number; pupil?: boolean }) {
  const { id, x, y, r, side, glow, deep, tilt = 0, pupil = true } = props;
  const [a, b] = side === 'l' ? [-0.95, -0.1] : [-0.1, -0.95];
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <defs>
        <radialGradient id={`${id}-i`}>
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset=".42" stopColor={glow} />
          <stop offset="1" stopColor={deep} />
        </radialGradient>
        <radialGradient id={`${id}-h`}>
          <stop offset="0" stopColor={glow} stopOpacity=".65" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-c`}>
          <path d={`M${-r * 1.7} ${r * a}L${r * 1.7} ${r * b}V${r * 2}H${-r * 1.7}Z`} />
        </clipPath>
      </defs>
      <circle r={r * 2.3} fill={`url(#${id}-h)`} />
      <g clipPath={`url(#${id}-c)`}>
        <ellipse rx={r * 1.2} ry={r * 0.85} fill={`url(#${id}-i)`} stroke={INK} strokeWidth="2" />
        {pupil && <ellipse rx={r * 0.2} ry={r * 0.66} fill={INK} />}
        <circle cx={-r * 0.45} cy={-r * 0.05} r={r * 0.17} fill="#fff" />
      </g>
      <path d={`M${-r * 1.45} ${r * a}L${r * 1.45} ${r * b}`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** A row of fangs hanging from (dir 1) or rising from (dir -1) a gently curved gum line. */
function Fangs({ x1, x2, y, n, h, dir = 1, bend = 0 }: { x1: number; x2: number; y: number; n: number; h: number; dir?: 1 | -1; bend?: number }) {
  const w = (x2 - x1) / n;
  let d = '';
  for (let i = 0; i < n; i++) {
    const u = ((i + 0.5) / n) * 2 - 1;
    const by = y + bend * (1 - u * u);
    const len = h * (1 - 0.35 * u * u);
    const a = x1 + i * w;
    d += `M${a.toFixed(1)} ${by.toFixed(1)}L${(a + w / 2).toFixed(1)} ${(by + dir * len).toFixed(1)}L${(a + w).toFixed(1)} ${by.toFixed(1)}Z`;
  }
  return <path d={d} fill="#fff6e6" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />;
}

/** A limb drawn as an inked stroke: dark outline underneath, colour on top. */
function Limb({ d, w, color }: { d: string; w: number; color: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth={w + 5} />
      <path d={d} stroke={color} strokeWidth={w} />
    </g>
  );
}

const Shadow = ({ rx = 62 }: { rx?: number }) => <ellipse cx="100" cy="187" rx={rx} ry="9" fill="#000" opacity=".42" />;

const OWL_MARKS = [[88, 122], [100, 118], [112, 122], [82, 136], [94, 133], [106, 133], [118, 136], [88, 149], [100, 147], [112, 149], [94, 161], [106, 161]]
  .map(([x, y]) => `M${x - 4} ${y - 3}l4 4 4-4`)
  .join('');

const WRAITH_CLAWS =
  'M84 122C90 114 98 114 101 122M84 128C92 122 100 124 102 132M86 134C92 130 98 134 99 142M116 122C110 114 102 114 99 122M116 128C108 122 100 124 98 132M114 134C108 130 102 134 101 142';

const SERPENT_HUMP = 'M22 178C22 112 42 66 76 66C108 66 118 112 118 178';
const SERPENT_NECK = 'M132 180C130 142 150 126 156 104C160 92 162 84 162 72';

const ART: Record<string, JSX.Element> = {
  'anchor-crab': (
    <>
      <defs>
        <linearGradient id="crab-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0604a" />
          <stop offset=".55" stopColor="#9c1f2e" />
          <stop offset="1" stopColor="#4d0b1c" />
        </linearGradient>
        <linearGradient id="crab-claw" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f47458" />
          <stop offset="1" stopColor="#7a1426" />
        </linearGradient>
      </defs>
      <Shadow rx={68} />
      {/* rusted anchor, swung like a club */}
      <g transform="rotate(14 158 90)" fill="none" strokeLinecap="round">
        <path d="M158 32V124M140 48H176M126 98C128 122 144 132 158 132S188 122 190 98" stroke={INK} strokeWidth="14" />
        <circle cx="158" cy="22" r="9" stroke={INK} strokeWidth="10" />
        <path d="M158 32V124M140 48H176M126 98C128 122 144 132 158 132S188 122 190 98" stroke="#6f7b9c" strokeWidth="9" />
        <circle cx="158" cy="22" r="9" stroke="#6f7b9c" strokeWidth="5" />
        <path d="M155 38V116" stroke="#aab4d0" strokeWidth="2.5" />
        <path d="M117 102l9-20 11 18zM179 100l11-18 9 20z" fill="#6f7b9c" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="160" cy="70" r="3.5" fill="#b8612b" />
        <circle cx="151" cy="127" r="4" fill="#b8612b" />
        <circle cx="183" cy="111" r="3" fill="#b8612b" />
      </g>
      <Limb d="M66 146L42 150L30 180M62 138L34 132L18 156M72 152L62 170L60 186M134 146L158 150L170 180M138 138L166 132L182 156M128 152L138 170L140 186" w={6} color="#8a1a2b" />
      {/* small claw gripping the anchor */}
      <Limb d="M138 124Q150 118 152 106" w={9} color="#9c1f2e" />
      <path d="M146 104C146 90 160 84 170 90C162 92 158 96 156 102ZM148 108C154 116 166 116 172 108C164 108 160 106 156 104Z" fill="url(#crab-claw)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {/* spiked carapace */}
      <path d="M54 114L44 92L70 104ZM72 102L68 76L90 96ZM92 96L100 70L108 96ZM110 96L132 76L128 102ZM130 104L156 92L146 114Z" fill="#b3263a" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M48 136C46 112 64 94 100 94S154 112 152 136C150 154 130 164 100 164S50 154 48 136Z" fill="url(#crab-shell)" stroke={INK} strokeWidth="3" />
      <path d="M64 116Q100 100 136 116" stroke="#ff9d80" strokeWidth="3" fill="none" opacity=".45" strokeLinecap="round" />
      <circle cx="76" cy="128" r="5.5" fill="#e8d7b0" stroke={INK} strokeWidth="1.5" />
      <circle cx="76" cy="128" r="2" fill="#5c3b2e" />
      <circle cx="130" cy="134" r="4.5" fill="#e8d7b0" stroke={INK} strokeWidth="1.5" />
      <circle cx="130" cy="134" r="1.6" fill="#5c3b2e" />
      <path d="M108 118l12 7M114 114l-3 13" stroke="#4d0b1c" strokeWidth="2" strokeLinecap="round" />
      {/* mandibles and maw */}
      <path d="M80 144Q72 152 78 162Q82 152 88 148ZM120 144Q128 152 122 162Q118 152 112 148Z" fill="#c23a3a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M82 142Q100 164 118 142Q100 150 82 142Z" fill="#1a0510" stroke={INK} strokeWidth="2" />
      <Fangs x1={85} x2={115} y={143} n={5} h={7} bend={3} />
      {/* eyestalks */}
      <Limb d="M88 98L84 70M112 98L116 70" w={7} color="#9c1f2e" />
      <circle cx="84" cy="64" r="12" fill="#9c1f2e" stroke={INK} strokeWidth="2.5" />
      <circle cx="116" cy="64" r="12" fill="#9c1f2e" stroke={INK} strokeWidth="2.5" />
      <Eye id="crab-el" x={84} y={64} r={8} side="l" glow="#ffd84a" deep="#b35a00" />
      <Eye id="crab-er" x={116} y={64} r={8} side="r" glow="#ffd84a" deep="#b35a00" />
      {/* huge crusher claw, raised to strike */}
      <Limb d="M64 130Q46 120 42 100" w={11} color="#a3202f" />
      <path d="M40 100C16 96 6 68 20 44C26 62 40 70 56 70C58 82 52 94 40 100Z" fill="url(#crab-claw)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M44 102C30 112 16 108 10 96C22 98 34 96 46 90Z" fill="url(#crab-claw)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M25 55l7 1-3 6zM33 63l7 0-4 6zM43 67l6-1-2 6z" fill="#fff6e6" stroke={INK} strokeWidth="1" />
    </>
  ),
  'memory-moth': (
    <>
      <defs>
        <linearGradient id="moth-wl" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#251046" />
          <stop offset=".55" stopColor="#5b28a0" />
          <stop offset="1" stopColor="#b660ec" />
        </linearGradient>
        <linearGradient id="moth-wr" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#251046" />
          <stop offset=".55" stopColor="#5b28a0" />
          <stop offset="1" stopColor="#b660ec" />
        </linearGradient>
        <linearGradient id="moth-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a2c8c" />
          <stop offset="1" stopColor="#1c0b33" />
        </linearGradient>
        <radialGradient id="moth-spot">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset=".6" stopColor="#ff8a2a" />
          <stop offset="1" stopColor="#7a1d00" />
        </radialGradient>
        <radialGradient id="moth-orb">
          <stop offset="0" stopColor="#fff8d6" />
          <stop offset=".45" stopColor="#ffd36e" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* tattered wings */}
      <path d="M96 104C74 108 50 120 44 142L36 178L52 158C62 158 72 148 78 138C86 126 92 116 98 110Z" fill="url(#moth-wl)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M104 104C126 108 150 120 156 142L164 178L148 158C138 158 128 148 122 138C114 126 108 116 102 110Z" fill="url(#moth-wr)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M96 88C78 50 44 30 18 40L24 48L10 54L22 60L8 70L22 74L12 86L28 90C46 104 74 104 96 98Z" fill="url(#moth-wl)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M104 88C122 50 156 30 182 40L176 48L190 54L178 60L192 70L178 74L188 86L172 90C154 104 126 104 104 98Z" fill="url(#moth-wr)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M92 94L32 58M90 96L22 80M92 98L52 97M108 94L168 58M110 96L178 80M108 98L148 97" stroke="#12081f" strokeWidth="1.5" opacity=".6" />
      {/* staring eye-spots */}
      {[48, 152].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="68" r="15" fill="#140824" stroke="#e0a3ff" strokeWidth="1.5" />
          <circle cx={cx} cy="68" r="10" fill="url(#moth-spot)" />
          <ellipse cx={cx} cy="68" rx="2.6" ry="8" fill={INK} />
          <circle cx={cx - 3} cy="64" r="2" fill="#fff" />
        </g>
      ))}
      <circle cx="66" cy="140" r="5" fill="#ffb347" opacity=".85" />
      <circle cx="134" cy="140" r="5" fill="#ffb347" opacity=".85" />
      {/* body */}
      <path d="M90 104C88 128 94 152 100 164C106 152 112 128 110 104Z" fill="url(#moth-body)" stroke={INK} strokeWidth="2.5" />
      <path d="M91 116Q100 121 109 116M92 128Q100 133 108 128M94 140Q100 145 106 140" stroke="#c46cf0" strokeWidth="2" opacity=".75" fill="none" />
      <path d="M84 92C82 80 90 74 100 74S118 80 116 92C118 100 110 108 100 108S82 100 84 92Z" fill="#4b2479" stroke={INK} strokeWidth="2.5" />
      <path d="M88 88l-4-3M112 88l4-3M90 100l-4 3M110 100l4 3" stroke="#8c5ad0" strokeWidth="2" strokeLinecap="round" />
      <path d="M94 60C86 44 72 34 56 30C66 40 80 50 92 62ZM106 60C114 44 128 34 144 30C134 40 120 50 108 62Z" fill="#d1b0ff" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="100" cy="68" rx="16" ry="13" fill="#2a1150" stroke={INK} strokeWidth="2.5" />
      <Eye id="moth-el" x={92} y={67} r={6.5} side="l" glow="#ff5a6e" deep="#6a0018" pupil={false} />
      <Eye id="moth-er" x={108} y={67} r={6.5} side="r" glow="#ff5a6e" deep="#6a0018" pupil={false} />
      <path d="M94 78Q89 89 95 96Q96 87 99 81ZM106 78Q111 89 105 96Q104 87 101 81Z" fill="#f3e6ff" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      {/* the vivid memories it feeds on */}
      <circle cx="26" cy="132" r="17" fill="url(#moth-orb)" />
      <circle cx="176" cy="128" r="15" fill="url(#moth-orb)" />
      <circle cx="168" cy="22" r="12" fill="url(#moth-orb)" />
      <circle cx="30" cy="20" r="11" fill="url(#moth-orb)" />
      <path d="M18 132h16M26 126l3 6-3 6M20 129l-1 3" stroke="#7a4a00" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M178 120l-5 8h5l-3 8" stroke="#7a4a00" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'framing-fox': (
    <>
      <defs>
        <linearGradient id="fox-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9346" />
          <stop offset=".6" stopColor="#d2451f" />
          <stop offset="1" stopColor="#7a1612" />
        </linearGradient>
        <linearGradient id="fox-gold" gradientUnits="userSpaceOnUse" x1="64" y1="138" x2="136" y2="184">
          <stop offset="0" stopColor="#fff1a8" />
          <stop offset=".5" stopColor="#f5b841" />
          <stop offset="1" stopColor="#9a5a14" />
        </linearGradient>
        <radialGradient id="fox-ember" cx="50%" cy="20%" r="80%">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset=".5" stopColor="#ffb13b" />
          <stop offset="1" stopColor="#ff6a1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Shadow />
      {/* three ember-tipped tails */}
      <path d="M80 138C46 128 32 84 46 40C52 68 66 88 88 102Z" fill="url(#fox-fur)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M84 158C40 162 10 122 20 72C28 96 46 112 70 118C76 132 80 146 84 158Z" fill="url(#fox-fur)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M116 158C160 162 190 122 180 72C172 96 154 112 130 118C124 132 120 146 116 158Z" fill="url(#fox-fur)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="24" cy="80" r="15" fill="url(#fox-ember)" />
      <circle cx="176" cy="80" r="15" fill="url(#fox-ember)" />
      <circle cx="48" cy="46" r="13" fill="url(#fox-ember)" />
      {/* body */}
      <path d="M64 178C60 142 74 120 100 118C126 120 140 142 136 178Z" fill="url(#fox-fur)" stroke={INK} strokeWidth="3" />
      <path d="M82 124L90 142L95 130L100 150L105 130L110 142L118 124C108 118 92 118 82 124Z" fill="#ffe9c9" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      {/* the gilded frame it wraps every fact in */}
      <rect x="64" y="138" width="72" height="46" rx="3" fill="#1b1036" stroke={INK} strokeWidth="13" />
      <rect x="64" y="138" width="72" height="46" rx="3" fill="#1b1036" stroke="url(#fox-gold)" strokeWidth="8" />
      {[[64, 138], [136, 138], [64, 184], [136, 184]].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="5" fill="#f5b841" stroke={INK} strokeWidth="1.5" />
      ))}
      <path d="M100 148l4 8.5 9.5 1-7 6.5 2 9.5-8.5-5-8.5 5 2-9.5-7-6.5 9.5-1z" fill="#fff1a8" />
      <path d="M80 150l4 4M120 150l-4 4M80 174l4-4M120 174l-4-4" stroke="#fff1a8" strokeWidth="1.5" opacity=".6" />
      <path d="M52 150C46 156 48 168 58 170L68 166V150ZM148 150C154 156 152 168 142 170L132 166V150Z" fill="#b8381c" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M66 150l7 2-6 3zM66 157l7 2-6 3zM66 164l7 2-6 3zM134 150l-7 2 6 3zM134 157l-7 2 6 3zM134 164l-7 2 6 3z" fill="#fff6e6" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      {/* head */}
      <path d="M60 72L52 14L94 52ZM140 72L148 14L106 52Z" fill="#d2451f" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M64 64L59 28L84 52ZM136 64L141 28L116 52Z" fill="#2a0a14" />
      <path d="M50 80L60 58C74 44 126 44 140 58L150 80L138 86L146 96L128 100C120 116 110 124 100 128C90 124 80 116 72 100L54 96L62 86Z" fill="url(#fox-fur)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 55L106 63L100 71L94 63Z" fill="#ffd36e" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M58 82L78 86L62 91ZM142 82L122 86L138 91Z" fill="#5a0c14" />
      <path d="M76 96C84 108 92 118 100 124C108 118 116 108 124 96C116 101 108 103 100 103S84 101 76 96Z" fill="#ffe9c9" stroke={INK} strokeWidth="1.5" />
      <path d="M93 94H107L100 101Z" fill={INK} />
      <path d="M79 104Q100 128 121 104Q100 114 79 104Z" fill="#1a0510" stroke={INK} strokeWidth="1.5" />
      <Fangs x1={83} x2={117} y={105} n={6} h={6} bend={4} />
      <Eye id="fox-el" x={80} y={76} r={7.5} side="l" glow="#d8ff5a" deep="#3d7a00" tilt={12} />
      <Eye id="fox-er" x={120} y={76} r={7.5} side="r" glow="#d8ff5a" deep="#3d7a00" tilt={-12} />
    </>
  ),
  'loss-wraith': (
    <>
      <defs>
        <linearGradient id="wraith-cloak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a2a78" />
          <stop offset=".55" stopColor="#35113f" />
          <stop offset="1" stopColor="#1a0822" stopOpacity=".3" />
        </linearGradient>
        <radialGradient id="wraith-coin" cx="35%" cy="35%">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="1" stopColor="#c7861c" />
        </radialGradient>
        <radialGradient id="wraith-eye">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".3" stopColor="#ffb3c6" />
          <stop offset=".65" stopColor="#ff4f7b" stopOpacity=".7" />
          <stop offset="1" stopColor="#ff4f7b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="188" rx="46" ry="6" fill="#ff6f91" opacity=".22" />
      <path d="M36 70C24 60 28 44 42 42M164 70C176 60 172 44 158 42M30 120C18 116 16 104 26 98M170 120C182 116 184 104 174 98" stroke="#ff8fb0" strokeWidth="2.5" fill="none" opacity=".4" strokeLinecap="round" />
      {/* tattered cloak */}
      <path d="M100 12C62 12 44 44 42 80C40 108 36 134 24 164L40 156L44 178L58 160L66 186L78 164L90 190L100 168L110 190L122 164L134 186L142 160L156 178L160 156L176 164C164 134 160 108 158 80C156 44 138 12 100 12Z" fill="url(#wraith-cloak)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 22C74 22 60 42 56 70" stroke="#b05ac0" strokeWidth="3" fill="none" opacity=".5" strokeLinecap="round" />
      {/* the void under the hood */}
      <path d="M100 34C77 34 64 53 64 76C64 97 79 112 100 114C121 112 136 97 136 76C136 53 123 34 100 34Z" fill="#06020c" stroke="#7d2f8a" strokeWidth="4" />
      <ellipse cx="85" cy="72" rx="15" ry="9" fill="url(#wraith-eye)" transform="rotate(20 85 72)" />
      <ellipse cx="115" cy="72" rx="15" ry="9" fill="url(#wraith-eye)" transform="rotate(-20 115 72)" />
      <ellipse cx="85" cy="72" rx="7" ry="2.4" fill="#fff" transform="rotate(20 85 72)" />
      <ellipse cx="115" cy="72" rx="7" ry="2.4" fill="#fff" transform="rotate(-20 115 72)" />
      <path d="M82 94Q100 108 118 94Q100 100 82 94Z" fill="#2a0714" />
      <Fangs x1={85} x2={115} y={96} n={6} h={5} bend={2.5} />
      {/* sleeves, bony claws, and the hoard it cannot let go of */}
      <path d="M48 92C54 118 68 130 84 132L86 118C74 112 64 102 58 86ZM152 92C146 118 132 130 116 132L114 118C126 112 136 102 142 86Z" fill="#4a1856" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <g stroke={INK} strokeWidth="2">
        <circle cx="80" cy="128" r="8" fill="url(#wraith-coin)" />
        <circle cx="120" cy="130" r="9" fill="url(#wraith-coin)" />
        <circle cx="100" cy="128" r="10" fill="url(#wraith-coin)" />
        <circle cx="90" cy="140" r="11" fill="url(#wraith-coin)" />
        <circle cx="110" cy="142" r="11" fill="url(#wraith-coin)" />
      </g>
      <g fill="none" stroke="#a8681a" strokeWidth="1.5">
        <circle cx="90" cy="140" r="6.5" />
        <circle cx="110" cy="142" r="6.5" />
        <circle cx="100" cy="128" r="5.5" />
      </g>
      <ellipse cx="72" cy="166" rx="6" ry="3.5" fill="url(#wraith-coin)" stroke={INK} strokeWidth="1.5" transform="rotate(-30 72 166)" />
      <ellipse cx="130" cy="174" rx="5" ry="3" fill="url(#wraith-coin)" stroke={INK} strokeWidth="1.5" transform="rotate(25 130 174)" />
      <Limb d={WRAITH_CLAWS} w={3} color="#eadfcf" />
    </>
  ),
  'pattern-imp': (
    <>
      <defs>
        <radialGradient id="imp-skin" cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#4fd8ea" />
          <stop offset=".6" stopColor="#1a8aa0" />
          <stop offset="1" stopColor="#0a4150" />
        </radialGradient>
        <linearGradient id="imp-horn" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f4e9cf" />
          <stop offset="1" stopColor="#8f7a52" />
        </linearGradient>
        <radialGradient id="imp-glow">
          <stop offset="0" stopColor="#7ff0ff" stopOpacity=".8" />
          <stop offset="1" stopColor="#7ff0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Shadow rx={58} />
      {/* bat wings */}
      <path d="M74 108L24 56L30 82L8 84L26 100L12 114L38 114L64 124ZM126 108L176 56L170 82L192 84L174 100L188 114L162 114L136 124Z" fill="#0b3a47" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M74 108L30 82M72 112L26 100M70 116L38 114M126 108L170 82M128 112L174 100M130 116L162 114" stroke="#3fd5e8" strokeWidth="1.5" opacity=".55" />
      {/* barbed tail */}
      <Limb d="M124 166C152 176 174 158 170 132C167 116 176 104 186 106" w={4.5} color="#137086" />
      <path d="M182 104L197 90L194 112Z" fill="#137086" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {/* crouching legs */}
      <path d="M76 162C66 166 62 176 68 184H92C90 174 86 166 76 162ZM124 162C134 166 138 176 132 184H108C110 174 114 166 124 162Z" fill="url(#imp-skin)" stroke={INK} strokeWidth="2.5" />
      <path d="M68 184l-4 3M76 184l-2 4M84 184v4M132 184l4 3M124 184l2 4M116 184v4" stroke="#f4e9cf" strokeWidth="2.5" strokeLinecap="round" />
      {/* belly rune: it sees patterns everywhere */}
      <ellipse cx="100" cy="146" rx="32" ry="30" fill="url(#imp-skin)" stroke={INK} strokeWidth="3" />
      <path d="M100 130L114 156H86Z" stroke="#7ff0ff" strokeWidth="2" fill="none" />
      <circle cx="100" cy="147" r="3.5" fill="#7ff0ff" />
      <path d="M100 130h.01M114 156h.01M86 156h.01" stroke="#7ff0ff" strokeWidth="4" strokeLinecap="round" />
      {/* arms and dice */}
      <Limb d="M74 138C60 144 52 152 48 160" w={6} color="#1a8aa0" />
      <Limb d="M126 136C140 128 148 116 150 104" w={6} color="#1a8aa0" />
      <g transform="rotate(-16 40 168)">
        <rect x="28" y="156" width="24" height="24" rx="5" fill="#f4f1ff" stroke={INK} strokeWidth="2.5" />
        <path d="M34 162h.01M40 168h.01M46 174h.01" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      </g>
      <circle cx="156" cy="80" r="22" fill="url(#imp-glow)" />
      <g transform="rotate(20 156 80)">
        <rect x="145" y="69" width="22" height="22" rx="5" fill="#f4f1ff" stroke={INK} strokeWidth="2.5" />
        <path d="M151 75h.01M161 75h.01M151 85h.01M161 85h.01" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* head */}
      <path d="M62 82L32 64L58 98ZM138 82L168 64L142 98Z" fill="#137086" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M72 60C58 46 58 24 72 10C68 30 76 44 90 52ZM128 60C142 46 142 24 128 10C132 30 124 44 110 52Z" fill="url(#imp-horn)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="100" cy="88" r="40" fill="url(#imp-skin)" stroke={INK} strokeWidth="3" />
      <Eye id="imp-el" x={84} y={82} r={10} side="l" glow="#ffe14a" deep="#b34700" />
      <Eye id="imp-er" x={116} y={82} r={10} side="r" glow="#ffe14a" deep="#b34700" />
      <path d="M96 96l-2 3M104 96l2 3" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M68 100Q100 134 132 100Q100 114 68 100Z" fill="#06222b" stroke={INK} strokeWidth="2" />
      <Fangs x1={72} x2={128} y={101} n={9} h={7} bend={6} />
      <Fangs x1={84} x2={116} y={113} n={5} h={5} dir={-1} bend={4} />
    </>
  ),
  'oracle-owl': (
    <>
      <defs>
        <linearGradient id="owl-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b3a70" />
          <stop offset=".6" stopColor="#2f1b3d" />
          <stop offset="1" stopColor="#1a0e24" />
        </linearGradient>
        <radialGradient id="owl-iris">
          <stop offset="0" stopColor="#fff6c2" />
          <stop offset=".35" stopColor="#ffcc33" />
          <stop offset=".8" stopColor="#ff7a1a" />
          <stop offset="1" stopColor="#7a2a00" />
        </radialGradient>
        <radialGradient id="owl-halo">
          <stop offset="0" stopColor="#ffcc33" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffcc33" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="owl-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe38a" />
          <stop offset="1" stopColor="#c7861c" />
        </linearGradient>
        <linearGradient id="owl-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7ecff" stopOpacity=".55" />
          <stop offset="1" stopColor="#6fb6ff" stopOpacity=".25" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="190" rx="66" ry="7" fill="#000" opacity=".42" />
      <Limb d="M20 181H180" w={7} color="#4a2c1a" />
      {/* blade-feathered wings */}
      <path d="M58 86C32 96 18 126 20 158L30 148L32 166L42 152L46 168L56 148C58 124 62 104 66 92ZM142 86C168 96 182 126 180 158L170 148L168 166L158 152L154 168L144 148C142 124 138 104 134 92Z" fill="#241430" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M66 60L48 12L86 48ZM134 60L152 12L114 48Z" fill="#2f1b3d" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M100 42C62 42 50 78 52 114C54 150 74 176 100 176S146 150 148 114C150 78 138 42 100 42Z" fill="url(#owl-body)" stroke={INK} strokeWidth="3" />
      <path d="M100 106C80 106 70 126 72 146C76 164 88 172 100 172S124 164 128 146C130 126 120 106 100 106Z" fill="#6b4a78" opacity=".55" />
      <path d={OWL_MARKS} stroke="#1a0e24" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* hypnotic eyes under a furious brow */}
      <circle cx="80" cy="86" r="30" fill="url(#owl-halo)" />
      <circle cx="120" cy="86" r="30" fill="url(#owl-halo)" />
      <circle cx="80" cy="86" r="24" fill="#3d2650" stroke={INK} strokeWidth="2" />
      <circle cx="120" cy="86" r="24" fill="#3d2650" stroke={INK} strokeWidth="2" />
      <circle cx="80" cy="86" r="17" fill="url(#owl-iris)" stroke={INK} strokeWidth="2" />
      <circle cx="120" cy="86" r="17" fill="url(#owl-iris)" stroke={INK} strokeWidth="2" />
      <circle cx="80" cy="86" r="11" fill="none" stroke="#7a2a00" strokeWidth="1.5" />
      <circle cx="120" cy="86" r="11" fill="none" stroke="#7a2a00" strokeWidth="1.5" />
      <circle cx="80" cy="86" r="4.5" fill={INK} />
      <circle cx="120" cy="86" r="4.5" fill={INK} />
      <circle cx="75" cy="81" r="2.2" fill="#fff" />
      <circle cx="115" cy="81" r="2.2" fill="#fff" />
      <path d="M50 64L100 82L150 64L150 53L100 71L50 53Z" fill="#241430" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="100" cy="57" r="10" fill="url(#owl-halo)" />
      <ellipse cx="100" cy="57" rx="4.5" ry="7" fill="url(#owl-iris)" stroke={INK} strokeWidth="1.5" />
      <ellipse cx="100" cy="57" rx="1.4" ry="5" fill={INK} />
      <path d="M91 96H109L100 119Z" fill="url(#owl-gold)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {/* a crooked, cracked crown of certainty */}
      <g transform="rotate(-14 100 36)">
        <path d="M80 44L82 22L91 33L100 16L109 33L118 22L120 44Z" fill="url(#owl-gold)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="100" cy="37" r="3.5" fill="#ff4f7b" stroke={INK} strokeWidth="1.2" />
        <path d="M106 25L103 33L107 40" stroke={INK} strokeWidth="1.5" fill="none" />
      </g>
      <Limb d="M82 172C80 180 83 185 88 187M90 172C90 180 92 185 97 187M110 172C110 180 108 185 103 187M118 172C120 180 117 185 112 187" w={3} color="#eadfcf" />
      {/* an hourglass that has almost run out */}
      <g transform="translate(152 124)">
        <path d="M4 2Q4 18 15 25Q4 32 4 48H26Q26 32 15 25Q26 18 26 2Z" fill="url(#owl-glass)" stroke="#c7ecff" strokeWidth="1.8" />
        <path d="M11 20Q15 23 19 20L15 25Z" fill="#ffd36e" />
        <path d="M15 25V44" stroke="#ffd36e" strokeWidth="1.2" />
        <path d="M6 48Q15 33 24 48Z" fill="#ffd36e" />
        <Limb d="M0 1H30M0 50H30" w={5} color="#c7861c" />
      </g>
    </>
  ),
  'tide-serpent': (
    <>
      <defs>
        <linearGradient id="serpent-scale" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="180">
          <stop offset="0" stopColor="#4fb6ff" />
          <stop offset=".5" stopColor="#1f5fbf" />
          <stop offset="1" stopColor="#0b2466" />
        </linearGradient>
        <linearGradient id="serpent-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5cc2ff" />
          <stop offset="1" stopColor="#163f9e" />
        </linearGradient>
        <linearGradient id="serpent-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f6fd1" />
          <stop offset="1" stopColor="#0a1f5c" />
        </linearGradient>
      </defs>
      {/* the average the tide always drifts back to */}
      <path d="M0 150H200" stroke="#c7f1ff" strokeDasharray="4 8" strokeWidth="2" opacity=".5" />
      {/* rising coil with dorsal spines */}
      <path d="M32 92L18 76L42 80ZM52 68L46 44L66 62ZM78 60L88 36L96 60ZM104 70L124 56L114 82Z" fill="#1fc7c7" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d={SERPENT_HUMP} stroke={INK} strokeWidth="30" fill="none" strokeLinecap="round" />
      <path d={SERPENT_HUMP} stroke="url(#serpent-scale)" strokeWidth="24" fill="none" strokeLinecap="round" />
      <path d={SERPENT_HUMP} stroke="#8fe3ff" strokeWidth="14" strokeDasharray="1 9" fill="none" strokeLinecap="round" opacity=".45" />
      <path d="M168 100L186 92L172 114ZM162 126L180 122L164 140Z" fill="#1fc7c7" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d={SERPENT_NECK} stroke={INK} strokeWidth="30" fill="none" strokeLinecap="round" />
      <path d={SERPENT_NECK} stroke="url(#serpent-scale)" strokeWidth="24" fill="none" strokeLinecap="round" />
      <path d={SERPENT_NECK} stroke="#8fe3ff" strokeWidth="14" strokeDasharray="1 9" fill="none" strokeLinecap="round" opacity=".45" />
      {/* head with gaping jaws */}
      <path d="M150 36L156 12L166 32L176 18L178 46Z" fill="#1fc7c7" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M100 58L150 62L154 68L104 82Z" fill="#2a0510" />
      <Fangs x1={104} x2={146} y={59} n={6} h={8} />
      <g transform="rotate(-16 106 80)">
        <Fangs x1={106} x2={150} y={80} n={6} h={7} dir={-1} />
      </g>
      <path d="M176 66C178 46 166 34 148 34C128 34 112 42 96 50C94 54 96 58 100 58L150 62C160 64 168 68 176 66Z" fill="url(#serpent-head)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M154 68L104 82C101 86 103 90 108 90C128 88 148 86 168 80C168 74 162 68 154 68Z" fill="url(#serpent-head)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Eye id="serpent-e" x={146} y={46} r={7} side="r" glow="#ff9a3d" deep="#8a1a00" />
      <path d="M104 50l5-2" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M100 58C92 70 90 84 96 96M110 88C106 98 108 106 114 110" stroke="#7ff0ff" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* waves */}
      <path d="M0 158q12-10 25 0t25 0 25 0 25 0 25 0 25 0 25 0 25 0V200H0z" fill="url(#serpent-sea)" opacity=".92" />
      <path d="M0 158q12-10 25 0t25 0 25 0 25 0 25 0 25 0 25 0 25 0" stroke="#c7f1ff" strokeWidth="2.5" fill="none" opacity=".7" />
      <path d="M0 174q12-8 25 0t25 0 25 0 25 0 25 0 25 0 25 0 25 0V200H0z" fill="#0a1f5c" />
      <path d="M30 146h.01M38 138h.01M118 142h.01M142 148h.01M126 136h.01" stroke="#c7f1ff" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
};

export function CreatureArt({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 200 200" className="creature-svg" role="img" aria-label={id.replace('-', ' ')}>
      {ART[id]}
    </svg>
  );
}
