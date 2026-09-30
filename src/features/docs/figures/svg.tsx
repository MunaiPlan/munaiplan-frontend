import type { ReactNode } from 'react';

/*
 * Shared pieces of the manual's diagrams. Ink on paper only: #0A0A0A for content, greys
 * (#71717A, #A1A1AA, #D4D4D8, #F4F4F5) for secondary lines and fills. Text inherits Inter.
 */
export const INK = '#0A0A0A';
export const GREY = '#71717A';
export const LIGHT = '#D4D4D8';
export const FAINT = '#F4F4F5';

/** Responsive SVG: scales to the figure width, never wider than `max` px. */
export const Svg = ({ width, height, label, max, children }: {
  width: number; height: number; label: string; max?: number; children: ReactNode;
}) => (
  <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="h-auto w-full"
    style={{ maxWidth: max ?? width * 1.25 }} fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
    {children}
  </svg>
);

/** A filled arrowhead with its tip at (x, y). */
export const ArrowHead = ({ x, y, dir, color = INK, size = 6 }: {
  x: number; y: number; dir: 'down' | 'up' | 'left' | 'right'; color?: string; size?: number;
}) => {
  const s = size;
  const points = {
    down: `${x},${y} ${x - s / 1.6},${y - s} ${x + s / 1.6},${y - s}`,
    up: `${x},${y} ${x - s / 1.6},${y + s} ${x + s / 1.6},${y + s}`,
    right: `${x},${y} ${x - s},${y - s / 1.6} ${x - s},${y + s / 1.6}`,
    left: `${x},${y} ${x + s},${y - s / 1.6} ${x + s},${y + s / 1.6}`,
  }[dir];
  return <polygon points={points} fill={color} />;
};

/** A numbered marker, referenced from the text below a figure. */
export const Marker = ({ x, y, n, inverted }: { x: number; y: number; n: number; inverted?: boolean }) => (
  <g>
    <circle cx={x} cy={y} r={9} fill={inverted ? '#FFFFFF' : INK} />
    <text x={x} y={y + 3.8} textAnchor="middle" fontSize={11} fontWeight={700} fill={inverted ? INK : '#FFFFFF'}>{n}</text>
  </g>
);
