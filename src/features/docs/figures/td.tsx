import { ArrowHead, GREY, INK, LIGHT, Marker, Svg } from './svg';

interface Operation {
  title: string;
  sub: string;
  move?: 'up' | 'down';
  rotate?: boolean;
  motor?: boolean;
  onBottom?: boolean;
}

const operations: Operation[] = [
  { title: 'Спуск', sub: 'вниз, без вращения', move: 'down' },
  { title: 'Подъём', sub: 'вверх, без вращения', move: 'up' },
  { title: 'Вращение над забоем', sub: 'вращение, долото над забоем', rotate: true },
  { title: 'Бурение ротором', sub: 'вращение, долото на забое', rotate: true, onBottom: true },
  { title: 'Бурение ГЗД (слайд)', sub: 'вращает только двигатель', motor: true, onBottom: true, move: 'down' },
  { title: 'Обратная проработка', sub: 'подъём с вращением', rotate: true, move: 'up' },
];

/** One sketch per operation: movement arrow, rotation, bit on or off bottom, mud motor. Two columns, so it reads on phones. */
export const OperationsFigure = () => (
  <Svg width={360} height={486} max={430} label="Операции Torque & Drag: спуск, подъём, вращение над забоем, бурение ротором, бурение ГЗД, обратная проработка">
    {operations.map((op, i) => {
      const cx = (i % 2) * 180 + 90;
      const top = Math.floor(i / 2) * 162;
      const bottom = top + 128;
      const bit = op.onBottom ? bottom - 7 : bottom - 26;
      return (
        <g key={op.title}>
          {i % 2 === 1 && <line x1={180} y1={top + 8} x2={180} y2={top + 152} stroke={LIGHT} />}
          {i >= 2 && <line x1={cx - 80} y1={top} x2={cx + 80} y2={top} stroke={LIGHT} />}
          <text x={cx} y={top + 22} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={INK}>{op.title}</text>
          {/* Surface, hole walls and bottom */}
          <line x1={cx - 34} y1={top + 38} x2={cx + 34} y2={top + 38} stroke={GREY} />
          <line x1={cx - 16} y1={top + 38} x2={cx - 16} y2={bottom} stroke={INK} strokeWidth={1.5} />
          <line x1={cx + 16} y1={top + 38} x2={cx + 16} y2={bottom} stroke={INK} strokeWidth={1.5} />
          <line x1={cx - 16} y1={bottom} x2={cx + 16} y2={bottom} stroke={INK} strokeWidth={2.5} />
          {/* String and bit */}
          <rect x={cx - 4} y={top + 30} width={8} height={bit - top - 30} fill="#FFFFFF" stroke={INK} strokeWidth={1.2} />
          {op.motor && <rect x={cx - 6} y={bit - 20} width={12} height={16} fill={GREY} stroke={INK} strokeWidth={1} />}
          <polygon points={`${cx - 7},${bit} ${cx + 7},${bit} ${cx},${bit + 7}`} fill={INK} />
          {/* Rotation of the whole string at surface, or of the bit only (motor) */}
          {op.rotate && (
            <g>
              <ellipse cx={cx} cy={top + 33} rx={12} ry={4} fill="none" stroke={INK} strokeWidth={1.25} />
              <ArrowHead x={cx + 12} y={top + 37} dir="down" size={5} />
            </g>
          )}
          {op.motor && (
            <g>
              <ellipse cx={cx} cy={bit + 2} rx={11} ry={3.5} fill="none" stroke={INK} strokeWidth={1.1} />
              <ArrowHead x={cx + 11} y={bit + 5.5} dir="down" size={4.5} />
            </g>
          )}
          {/* Movement */}
          {op.move && (
            <g>
              <line x1={cx + 34} y1={op.move === 'down' ? top + 60 : top + 106} x2={cx + 34} y2={op.move === 'down' ? top + 100 : top + 66}
                stroke={INK} strokeWidth={1.5} />
              <ArrowHead x={cx + 34} y={op.move === 'down' ? top + 106 : top + 60} dir={op.move} />
            </g>
          )}
          <text x={cx} y={top + 148} textAnchor="middle" fontSize={10.5} fill={GREY}>{op.sub}</text>
        </g>
      );
    })}
  </Svg>
);

/** A schematic depth chart with numbered markers explained in the text. No data values. */
export const DepthChartFigure = () => {
  const x0 = 56, x1 = 330, y0 = 36, y1 = 286;
  const guide = y0 + (y1 - y0) * 0.65;
  return (
    <Svg width={360} height={330} max={500} label="Схема графика по глубине: ось MD направлена вниз, по горизонтали нагрузка, линии операций и серые пределы">
      {/* Grid and axes */}
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={x0} y1={y0 + (y1 - y0) * f} x2={x1} y2={y0 + (y1 - y0) * f} stroke="#E4E4E7" strokeDasharray="2 4" />)}
      {[0.33, 0.66].map((f) => <line key={f} x1={x0 + (x1 - x0) * f} y1={y0} x2={x0 + (x1 - x0) * f} y2={y1} stroke="#E4E4E7" strokeDasharray="2 4" />)}
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="none" stroke={LIGHT} />
      {[['0', y0], ['1000', (y0 + y1) / 2], ['2000', y1]].map(([t, y]) => (
        <text key={t} x={x0 - 6} y={Number(y) + 4} textAnchor="end" fontSize={10} fill={GREY}>{t}</text>
      ))}
      <text x={0} y={0} fontSize={10.5} fill={GREY} transform={`translate(14 ${(y0 + y1) / 2 + 20}) rotate(-90)`}>MD, м</text>
      {[['0', x0], ['50', x0 + (x1 - x0) * 0.33], ['100', x0 + (x1 - x0) * 0.66]].map(([t, x]) => (
        <text key={t} x={Number(x)} y={y1 + 15} textAnchor="middle" fontSize={10} fill={GREY}>{t}</text>
      ))}
      <text x={(x0 + x1) / 2 + 20} y={y1 + 36} textAnchor="middle" fontSize={10.5} fill={GREY}>Вес на крюке, т</text>
      {/* Limits (grey) */}
      <line x1={318} y1={y0} x2={318} y2={y1} stroke="#A1A1AA" strokeWidth={1.25} />
      <path d="M92 36 C 100 120 118 200 136 286" fill="none" stroke="#A1A1AA" strokeWidth={1.25} strokeDasharray="4 4" />
      {/* Operations (ink) */}
      <path d="M60 36 C 110 120 150 200 205 286" fill="none" stroke={INK} strokeWidth={2} />
      <path d="M60 36 C 120 120 175 205 238 286" fill="none" stroke={INK} strokeWidth={2} strokeDasharray="2 3" />
      <path d="M60 36 C 130 120 200 210 270 286" fill="none" stroke={INK} strokeWidth={2} strokeDasharray="8 4" />
      {/* Reading guide */}
      <line x1={x0} y1={guide} x2={x1} y2={guide} stroke={GREY} strokeDasharray="1 3" strokeWidth={1.25} />
      <Marker x={36} y={100} n={1} />
      <Marker x={286} y={262} n={2} />
      <Marker x={318} y={60} n={3} />
      <Marker x={130} y={y1 + 32} n={4} />
      <Marker x={x0 + 14} y={guide - 12} n={5} />
    </Svg>
  );
};
