/**
 * Line art for the landing page: a well profile (vertical, build, tangent) and a depth chart
 * with three load curves and a limit. Schematic only, no real or synthetic data values.
 * Solid lines draw themselves once and dashed ones fade in, unless the visitor prefers reduced
 * motion (see .sketch-draw in index.css).
 */
export const WellSketch = () => (
  <svg viewBox="0 0 560 380" role="img" aria-labelledby="well-sketch-title" className="h-auto w-full text-ink">
    <title id="well-sketch-title">Схема: профиль скважины и графики нагрузок по глубине</title>
    <defs>
      <pattern id="sketch-grid" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M24 0H0V24" fill="none" stroke="#E4E4E7" strokeWidth="1" strokeDasharray="2 3" />
      </pattern>
    </defs>

    {/* Left: vertical section. */}
    <g transform="translate(20 20)">
      <rect width="250" height="330" fill="url(#sketch-grid)" />
      <path d="M0 0H250M0 0V330" stroke="#71717A" strokeWidth="1" />
      <text x="250" y="-6" textAnchor="end" className="fill-ink-500 font-mono" fontSize="10">VS, м</text>
      <text x="-6" y="330" textAnchor="end" className="fill-ink-500 font-mono" fontSize="10" transform="rotate(-90 -6 330)">TVD, м</text>
      <path className="sketch-draw" pathLength={1} d="M36 0V120C36 200 70 250 150 285L240 322"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {[40, 80, 120].map((y) => <circle key={y} cx="36" cy={y} r="2.5" fill="currentColor" />)}
      {[[52, 196], [86, 245], [150, 285], [195, 303]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.5" fill="currentColor" />)}
      <path d="M36 120H64" stroke="#71717A" strokeWidth="1" strokeDasharray="2 2" />
      <text x="68" y="123" className="fill-ink-500 font-mono" fontSize="10">KOP</text>
    </g>

    {/* Right: loads against depth, depth downward. */}
    <g transform="translate(300 20)">
      <rect width="240" height="330" fill="url(#sketch-grid)" />
      <path d="M0 0H240M0 0V330" stroke="#71717A" strokeWidth="1" />
      <text x="240" y="-6" textAnchor="end" className="fill-ink-500 font-mono" fontSize="10">нагрузка →</text>
      <text x="-6" y="330" textAnchor="end" className="fill-ink-500 font-mono" fontSize="10" transform="rotate(-90 -6 330)">MD, м</text>
      <path d="M196 0C200 110 204 220 206 330" fill="none" stroke="#A1A1AA" strokeWidth="1.25" />
      <path className="sketch-draw" pathLength={1} d="M170 0C150 100 110 220 70 330" fill="none" stroke="currentColor" strokeWidth="2" />
      <path className="sketch-fade" d="M150 0C135 100 100 220 58 330" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
      <path className="sketch-fade sketch-late" d="M120 0C110 110 80 230 40 330" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 3" />
    </g>
  </svg>
);
