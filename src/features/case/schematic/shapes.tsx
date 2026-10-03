import { C, type ComponentKind, type StringItem } from './schematic';

/** Pattern ids are prefixed per schematic instance so two schematics on a page never clash. */
export const Patterns = ({ p }: { p: string }) => (
  <defs>
    <pattern id={`${p}-hatch`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="4" height="4" fill={C.paper} /><line x1="0" y1="0" x2="0" y2="4" stroke={C.ink} strokeWidth="1.3" />
    </pattern>
    <pattern id={`${p}-hlines`} width="4" height="3" patternUnits="userSpaceOnUse">
      <rect width="4" height="3" fill={C.paper} /><line x1="0" y1="0.5" x2="4" y2="0.5" stroke={C.ink} strokeWidth="1" />
    </pattern>
    <pattern id={`${p}-cross`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="5" height="5" fill={C.paper} />
      <line x1="0" y1="0" x2="0" y2="5" stroke={C.ink} strokeWidth="0.8" /><line x1="0" y1="0" x2="5" y2="0" stroke={C.ink} strokeWidth="0.8" />
    </pattern>
    <pattern id={`${p}-formation`} width="12" height="9" patternUnits="userSpaceOnUse">
      <rect width="12" height="9" fill={C.paper} />
      <line x1="1" y1="7" x2="5" y2="3" stroke={C.ink300} strokeWidth="0.9" />
      <circle cx="9" cy="2.5" r="0.7" fill={C.ink500} />
    </pattern>
    <pattern id={`${p}-cement`} width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="4" fill={C.ink100} /><circle cx="2" cy="2" r="0.6" fill={C.ink500} />
    </pattern>
  </defs>
);

export interface ShapeGeometry {
  cx: number;
  y0: number;
  y1: number;
  /** px per mm of diameter. */
  k: number;
}

/** Visual pitch of tool joints: the real joint length when it is at least 14 px, else a symbolic 20 px. */
const pitch = (item: StringItem, y0: number, y1: number, fallback: number) => {
  const pxPerM = (y1 - y0) / item.length;
  const real = (item.jointLength ?? 0) * pxPerM;
  return real >= 14 ? real : fallback;
};

const steps = (y0: number, y1: number, p: number) => {
  const out: number[] = [];
  for (let y = y0; y < y1 - p * 0.35; y += p) out.push(y);
  return out;
};

/** One string component, drawn like real pipe; each type has its own fill, hatch and outline weight. */
export const ComponentShape = ({ item, g, p }: { item: StringItem; g: ShapeGeometry; p: string }) => {
  const { cx, y0, y1, k } = g;
  const h = y1 - y0;
  const r = (item.od / 2) * k;
  const ri = item.id ? (item.id / 2) * k : 0;
  const body = (fill: string, sw = 1, dash?: string) => (
    <rect x={cx - r} y={y0} width={2 * r} height={h} fill={fill} stroke={C.ink} strokeWidth={sw} strokeDasharray={dash} />
  );
  const bore = ri > 1 && ri < r - 1 && (
    <g stroke={C.ink300} strokeWidth="0.75"><line x1={cx - ri} y1={y0} x2={cx - ri} y2={y1} /><line x1={cx + ri} y1={y0} x2={cx + ri} y2={y1} /></g>
  );

  switch (item.kind as ComponentKind) {
    case 'drillPipe':
    case 'hwdp': {
      const heavy = item.kind === 'hwdp';
      const rj = item.joint ? Math.max(r + 1.5, (item.joint.od / 2) * k) : 0;
      const tj = heavy ? 5 : 4;
      const pp = pitch(item, y0, y1, heavy ? 18 : 22);
      return (
        <g>
          {body(heavy ? C.ink200 : C.paper)}
          {!heavy && bore}
          {item.joint && steps(y0, y1, pp).map((y) => (
            <rect key={y} x={cx - rj} y={Math.min(y, y1 - tj)} width={2 * rj} height={tj} rx="0.8" fill={C.ink} />
          ))}
          {heavy && item.joint && steps(y0, y1, pp).filter((y) => y + pp / 2 < y1 - 4).map((y) => (
            <rect key={`pad${y}`} x={cx - (r + (rj - r) * 0.7)} y={y + pp / 2 - 2} width={2 * (r + (rj - r) * 0.7)} height="4" fill={C.paper} stroke={C.ink} strokeWidth="0.9" />
          ))}
        </g>
      );
    }
    case 'collar': {
      const pp = pitch(item, y0, y1, 28);
      return (
        <g>
          {body(`url(#${p}-hatch)`, 1.6)}
          {steps(y0, y1, pp).slice(1).map((y) => <line key={y} x1={cx - r} x2={cx + r} y1={y} y2={y} stroke={C.ink} strokeWidth="1.6" />)}
        </g>
      );
    }
    case 'jar': {
      const neck = y0 + h * 0.28;
      return (
        <g>
          <rect x={cx - r * 0.78} y={y0} width={r * 1.56} height={neck - y0} fill={C.paper} stroke={C.ink} strokeWidth="1.2" />
          <rect x={cx - r} y={neck} width={2 * r} height={y1 - neck} fill={`url(#${p}-hlines)`} stroke={C.ink} strokeWidth="1.4" />
        </g>
      );
    }
    case 'stabilizer': {
      const rb = item.blade ? Math.max(r + 2, (item.blade.od / 2) * k) : r * 1.25;
      const bladeH = Math.max(h * 0.5, Math.min(h * 0.75, ((item.blade?.length ?? 0) * h) / item.length));
      const b0 = y0 + (h - bladeH) / 2;
      const b1 = b0 + bladeH;
      const s = Math.min(6, bladeH * 0.25);
      return (
        <g>
          {body(C.paper)}
          <polygon points={`${cx - rb},${b0 + s} ${cx - r},${b0} ${cx - r},${b1 - s} ${cx - rb},${b1}`} fill={C.ink} />
          <polygon points={`${cx + r},${b0 + s} ${cx + rb},${b0} ${cx + rb},${b1 - s} ${cx + r},${b1}`} fill={C.ink} />
          <polygon points={`${cx - r * 0.35},${b0 + s} ${cx + r * 0.35},${b0} ${cx + r * 0.35},${b1 - s} ${cx - r * 0.35},${b1}`} fill={C.ink} />
        </g>
      );
    }
    case 'motor': {
      const bearing = y1 - Math.max(5, h * 0.2);
      return (
        <g>
          <rect x={cx - r} y={y0} width={2 * r} height={bearing - y0} fill={`url(#${p}-cross)`} stroke={C.ink} strokeWidth="1.6" />
          <rect x={cx - r * 0.9} y={bearing} width={r * 1.8} height={y1 - bearing} fill={C.paper} stroke={C.ink} strokeWidth="1.2" />
          <line x1={cx - r} y1={y0 + (bearing - y0) * 0.72} x2={cx + r} y2={y0 + (bearing - y0) * 0.66} stroke={C.ink} strokeWidth="1.6" />
        </g>
      );
    }
    case 'mwd':
      return (
        <g>
          {body(C.paper, 2)}
          <line x1={cx} y1={y0 + 2} x2={cx} y2={y1 - 2} stroke={C.ink500} strokeWidth="0.8" strokeDasharray="2 2" />
          {[0.3, 0.62].map((t) => <rect key={t} x={cx - r * 0.55} y={y0 + h * t - 1.5} width={r * 1.1} height="3" fill={C.ink} />)}
        </g>
      );
    case 'sub':
      return (
        <g>
          {body(C.ink100)}
          {[y0 + 3, y1 - 3].map((y) => <line key={y} x1={cx - r + 2} x2={cx + r - 2} y1={y} y2={y} stroke={C.ink500} strokeWidth="0.8" strokeDasharray="1.5 1.5" />)}
        </g>
      );
    case 'bit': {
      const rs = Math.min(r * 0.72, r - 2);
      const sh = y0 + h * 0.3;
      const gauge = y0 + h * 0.62;
      return (
        <g>
          <path d={`M${cx - rs},${y0} L${cx + rs},${y0} L${cx + rs},${sh} L${cx + r},${sh + 3} L${cx + r},${gauge}
            Q${cx + r},${y1} ${cx},${y1} Q${cx - r},${y1} ${cx - r},${gauge} L${cx - r},${sh + 3} L${cx - rs},${sh} Z`} fill={C.ink} />
          {[-0.55, -0.2, 0.2, 0.55].map((t) => <circle key={t} cx={cx + t * r} cy={gauge + (y1 - gauge) * (0.35 + Math.abs(t) * -0.2)} r={Math.max(1, Math.min(2, r * 0.06))} fill={C.paper} />)}
        </g>
      );
    }
    default:
      return <g>{body(C.paper, 1, '3 2')}</g>;
  }
};

/** A small legend swatch with the same treatment as the drawing. */
export const Swatch = ({ kind, p }: { kind: ComponentKind | 'casing' | 'open'; p: string }) => {
  const w = 18, h = 26;
  const inner = (() => {
    switch (kind) {
      case 'drillPipe': return <><rect x="5" y="1" width="8" height="24" fill={C.paper} stroke={C.ink} /><rect x="3" y="8" width="12" height="3" fill={C.ink} /><rect x="3" y="20" width="12" height="3" fill={C.ink} /></>;
      case 'hwdp': return <><rect x="5" y="1" width="8" height="24" fill={C.ink200} stroke={C.ink} /><rect x="3" y="4" width="12" height="3.5" fill={C.ink} /><rect x="3.8" y="13" width="10.4" height="3" fill={C.paper} stroke={C.ink} strokeWidth="0.8" /><rect x="3" y="21" width="12" height="3.5" fill={C.ink} /></>;
      case 'collar': return <rect x="3.5" y="1" width="11" height="24" fill={`url(#${p}-hatch)`} stroke={C.ink} strokeWidth="1.4" />;
      case 'jar': return <><rect x="5" y="1" width="8" height="8" fill={C.paper} stroke={C.ink} /><rect x="3.5" y="9" width="11" height="16" fill={`url(#${p}-hlines)`} stroke={C.ink} strokeWidth="1.2" /></>;
      case 'stabilizer': return <><rect x="5" y="1" width="8" height="24" fill={C.paper} stroke={C.ink} /><polygon points="1,10 5,7 5,17 1,20" fill={C.ink} /><polygon points="13,10 17,7 17,17 13,20" fill={C.ink} /><polygon points="7.5,10 10.5,7 10.5,17 7.5,20" fill={C.ink} /></>;
      case 'motor': return <><rect x="3.5" y="1" width="11" height="19" fill={`url(#${p}-cross)`} stroke={C.ink} strokeWidth="1.4" /><rect x="4" y="20" width="10" height="5" fill={C.paper} stroke={C.ink} /></>;
      case 'mwd': return <><rect x="3.5" y="1.5" width="11" height="23" fill={C.paper} stroke={C.ink} strokeWidth="1.8" /><rect x="6" y="8" width="6" height="2.5" fill={C.ink} /><rect x="6" y="16" width="6" height="2.5" fill={C.ink} /></>;
      case 'sub': return <rect x="4" y="6" width="10" height="14" fill={C.ink100} stroke={C.ink} />;
      case 'bit': return <path d="M6,3 L12,3 L12,10 L15,12 L15,18 Q15,25 9,25 Q3,25 3,18 L3,12 L6,10 Z" fill={C.ink} />;
      case 'casing': return <><rect x="1" y="1" width="16" height="24" fill={`url(#${p}-formation)`} /><rect x="3" y="1" width="2.5" height="22" fill={C.ink} /><rect x="12.5" y="1" width="2.5" height="22" fill={C.ink} /><rect x="5.5" y="1" width="7" height="24" fill={C.paper} /><polygon points="2,25 7,25 2,19" fill={C.ink} /><polygon points="16,25 11,25 16,19" fill={C.ink} /></>;
      case 'open': return <><rect x="0" y="1" width="18" height="24" fill={`url(#${p}-formation)`} /><path d="M3.5,1 Q2.5,5 3.8,9 T3.2,17 T3.8,25 L14.2,25 Q15.5,21 14.6,17 T14.8,9 T14.4,1 Z" fill={C.paper} stroke={C.ink} strokeWidth="1.1" /></>;
      default: return <rect x="4" y="2" width="10" height="22" fill={C.paper} stroke={C.ink} strokeDasharray="3 2" />;
    }
  })();
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="shrink-0">{inner}</svg>;
};
