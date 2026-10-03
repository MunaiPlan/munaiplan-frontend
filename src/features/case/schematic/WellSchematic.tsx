import { useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../../ui';
import { C, depthScale, fmt, kindNames, placeLabels, wrap, type HoleItem, type SchematicModel, type StringItem } from './schematic';
import { ComponentShape, Patterns, Swatch } from './shapes';

type Entry = { group: 'string'; key: string; item: StringItem } | { group: 'hole'; key: string; item: HoleItem };

const mm = (v: number | null) => (v === null ? '—' : `${fmt(v, 1)} мм`);
const span = (a: number, b: number) => `${fmt(a)}–${fmt(b)}\u00a0м`;

/** Every fact about one layer, shared by the tooltip and the legend's accessible text. */
function detailsOf(e: Entry): [string, string][] {
  if (e.group === 'string') {
    const c = e.item;
    const rows: [string, string][] = [['НД / ВД', `${fmt(c.od, 2)} / ${c.id ? fmt(c.id, 2) : '—'} мм`]];
    if (c.kind === 'stabilizer') rows.push(['Лопасти', c.blade ? `НД ${fmt(c.blade.od, 1)} мм${c.blade.length ? `, ${fmt(c.blade.length)} м` : ''}` : 'нет данных']);
    else if (c.joint) rows.push(['Замок', `НД ${fmt(c.joint.od, 1)}${c.joint.id ? ` · ВД ${fmt(c.joint.id, 1)}` : ''} мм${c.joint.length ? ` · ${fmt(c.joint.length)} м` : ''}`]);
    else if (c.kind === 'drillPipe' || c.kind === 'hwdp') rows.push(['Замок', 'нет данных']);
    rows.push(['Длина', `${fmt(c.length)} м`], ['Интервал', span(c.top, c.bottom)]);
    if (c.weight) rows.push(['Вес', `${fmt(c.weight)} кг/м`]);
    if (c.grade) rows.push(['Марка', c.grade]);
    if (c.type && c.type !== c.name) rows.push(['Тип в данных', c.type]);
    return rows;
  }
  const h = e.item;
  if (h.kind === 'open') {
    const rows: [string, string][] = [['Диаметр', mm(h.id)], ['Интервал', span(h.top, h.bottom)], ['Длина', `${fmt(h.bottom - h.top)} м`]];
    if (h.friction !== null) rows.push(['Коэф. трения', fmt(h.friction, 3)]);
    return rows;
  }
  const rows: [string, string][] = [['ВД', mm(h.id)], ['НД', h.od !== null ? mm(h.od) : `не задан (на схеме ≈ ${fmt(h.drawOd, 1)} мм)`],
    ['Башмак', `${fmt(h.bottom)} м`], ['Интервал', span(h.top, h.bottom)]];
  if (h.holeDiameter) rows.push(['Диаметр ствола', mm(h.holeDiameter)]);
  if (h.friction !== null) rows.push(['Коэф. трения', fmt(h.friction, 3)]);
  return rows;
}

/** Callouts use the common abbreviations (ТБТ, УБТ, ГЗД); the legend and tooltip spell names out. */
const calloutText = (c: StringItem) => `${['hwdp', 'collar', 'motor'].includes(c.kind) && c.name === kindNames[c.kind].name ? kindNames[c.kind].short : c.name} ${fmt(c.od, 1)}\u00a0мм`;
const outerOd = (c: StringItem) => Math.max(c.od, c.joint?.od ?? 0, c.blade?.od ?? 0);

/** Deterministic irregular wall offset in px, continuous in y. */
const wobble = (y: number) => 1.2 * Math.sin(y * 0.19) + 0.7 * Math.sin(y * 0.47 + 1.3) + 0.35 * Math.sin(y * 1.1 + 0.4);

function computeLayout(model: SchematicModel, W: number) {
  const narrow = W < 520;
  const gutter = narrow ? 50 : 70;
  const drawW = narrow ? Math.max(96, Math.min(150, Math.round(W * 0.36))) : 210;
  const colL = gutter + 12;
  const edge = drawW / 2;
  const cx = colL + edge;
  const maxD = Math.max(1, ...model.string.map(outerOd), ...model.hole.map((h) => Math.max(h.drawOd, h.holeDiameter ?? 0, h.id)));
  const k = (edge - 10) / (maxD / 2);
  const padTop = 30;
  const breaks = [...model.string.flatMap((c) => [c.top, c.bottom]), ...model.hole.flatMap((h) => [h.top, h.bottom])];
  const scale = depthScale(breaks, { height: narrow ? 700 : 860, minPx: 22 });
  const Y = (md: number) => padTop + scale.y(md);
  const bottomY = padTop + scale.height;
  const H = bottomY + 72;

  const breakYs = scale.segments.filter((s) => s.compressed && s.y1 - s.y0 > 40).map((s) => padTop + (s.y0 + s.y1) / 2);
  const avoidBreaks = (y: number, lo: number, hi: number) => {
    for (const b of breakYs) if (Math.abs(y - b) < 10) return y + 16 <= hi - 2 ? y + 16 : Math.max(lo + 2, y - 16);
    return y;
  };

  const fs = narrow ? 10.5 : 11;
  const lineH = narrow ? 12.5 : 13.5;
  const charW = narrow ? 6.1 : 6.5;
  const labelX = colL + drawW + 26;
  const elbowX = colL + drawW + 12;
  const maxChars = Math.max(10, Math.floor((W - labelX - 4) / charW));

  const callouts = [
    ...model.string.map((c) => {
      const y0 = Y(c.top), y1 = Y(c.bottom);
      return { key: c.key, ax: cx + (outerOd(c) / 2) * k, ay: avoidBreaks((y0 + y1) / 2, y0, y1), lines: wrap(calloutText(c), maxChars), bold: false };
    }),
    ...model.hole.map((h) => {
      const y0 = Y(h.top), y1 = Y(h.bottom);
      const ay = h.kind === 'casing' ? y1 - Math.min(14, (y1 - y0) / 2) : avoidBreaks(y0 + Math.min(40, (y1 - y0) * 0.3), y0, y1);
      return { key: h.key, ax: cx + ((h.kind === 'casing' ? h.drawOd : h.id) / 2) * k, ay, lines: wrap(h.label, maxChars), bold: true };
    }),
  ];
  const placed = new Map(placeLabels(callouts.map((c) => ({ key: c.key, y: c.ay, height: c.lines.length * lineH })), { gap: 5, minY: 4, maxY: H - 6 }).map((p) => [p.key, p.top]));

  return { narrow, gutter, drawW, colL, edge, cx, k, padTop, Y, bottomY, H, scale, breakYs, fs, lineH, charW, labelX, elbowX, callouts, placed };
}
type Layout = ReturnType<typeof computeLayout>;

/** Formation, cement and the borehole wall for one depth interval. */
function wallsFor(model: SchematicModel, L: Layout, top: number, bottom: number, p: string, key: string) {
  const mid = (top + bottom) / 2;
  const y0 = L.Y(top), y1 = L.Y(bottom);
  const open = model.hole.find((h) => h.kind === 'open' && h.top <= mid && mid <= h.bottom);
  const casing = model.hole.filter((h) => h.kind === 'casing' && h.top <= mid && mid <= h.bottom).sort((a, b) => b.drawOd - a.drawOd)[0];
  if (!open && !casing) return null;
  const wallMm = open ? open.id : casing?.holeDiameter ?? casing?.drawOd ?? 0;
  const wavy = Boolean(open || casing?.holeDiameter);
  const r = (wallMm / 2) * L.k;
  const xs: number[] = [];
  for (let y = y0; y < y1; y += 4) xs.push(y);
  xs.push(y1);
  const off = (y: number) => (wavy ? wobble(y) : 0);
  const side = (s: 1 | -1) => {
    const pts = xs.map((y) => `${L.cx + s * (r + off(y + s * 7))},${y}`);
    return `${L.cx + s * L.edge},${y0} ${pts.join(' ')} ${L.cx + s * L.edge},${y1}`;
  };
  const line = (s: 1 | -1) => xs.map((y) => `${L.cx + s * (r + off(y + s * 7))},${y}`).join(' ');
  return (
    <g key={key}>
      {casing && !open && casing.holeDiameter && casing.holeDiameter > casing.drawOd && (
        <>
          <rect x={L.cx - r} y={y0} width={r - (casing.drawOd / 2) * L.k} height={y1 - y0} fill={`url(#${p}-cement)`} />
          <rect x={L.cx + (casing.drawOd / 2) * L.k} y={y0} width={r - (casing.drawOd / 2) * L.k} height={y1 - y0} fill={`url(#${p}-cement)`} />
        </>
      )}
      <polygon points={side(-1)} fill={`url(#${p}-formation)`} />
      <polygon points={side(1)} fill={`url(#${p}-formation)`} />
      {wavy && <><polyline points={line(-1)} fill="none" stroke={C.ink} strokeWidth="1.2" /><polyline points={line(1)} fill="none" stroke={C.ink} strokeWidth="1.2" /></>}
    </g>
  );
}

/**
 * The string inside the wellbore along measured depth: casings with shoes, an irregular open-hole
 * wall, and every string component drawn by type. Widths are to a diameter scale; depth uses the
 * compressed piecewise scale from `depthScale`, with break marks on compressed intervals.
 * Hover, tap or keyboard focus in the legend highlights a layer and shows its details.
 */
export const WellSchematic = ({ model }: { model: SchematicModel }) => {
  const p = `ws${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hover ?? selected;

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const update = () => setWidth(Math.floor(el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const entries = useMemo<Entry[]>(() => [
    ...model.string.map((item) => ({ group: 'string' as const, key: item.key, item })),
    ...model.hole.map((item) => ({ group: 'hole' as const, key: item.key, item })),
  ], [model]);
  const L = useMemo(() => (width > 0 ? computeLayout(model, width) : null), [model, width]);
  const activeEntry = entries.find((e) => e.key === active);
  const toggle = (key: string | null) => setSelected((s) => (key === null || s === key ? null : key));
  const pointer = (key: string) => ({
    onPointerEnter: (e: { pointerType: string }) => { if (e.pointerType === 'mouse') setHover(key); },
    onPointerLeave: () => setHover(null),
    onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); toggle(key); },
    style: { cursor: 'pointer' },
  });
  const dim = (key: string) => (active && active !== key ? 0.28 : 1);

  const shoes = new Set(model.hole.filter((h) => h.kind === 'casing').map((h) => +h.bottom.toFixed(2)));
  const td = +model.totalDepth.toFixed(2);
  const stringBottom = model.string.at(-1)?.bottom ?? 0;
  const casings = model.hole.filter((h) => h.kind === 'casing').length;
  const open = model.hole.find((h) => h.kind === 'open');
  const summary = [
    model.string.length ? `Колонна: элементов ${model.string.length}, долото на ${fmt(stringBottom)} м.` : 'Колонна не задана.',
    `Ствол: обсадных колонн ${casings}${open ? `, открытый ствол ${fmt(open.id, 1)} мм до ${fmt(open.bottom)} м` : ''}.`,
    'Подробности по каждому элементу — в списке слоёв.',
  ].join(' ');

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]" onKeyDown={(e) => { if (e.key === 'Escape') { setSelected(null); setHover(null); } }}>
      <figure className="min-w-0">
        <div ref={boxRef} className="relative w-full" style={{ minHeight: L ? undefined : 480 }}>
          {L && (
            <svg width={width} height={L.H} viewBox={`0 0 ${width} ${L.H}`} role="img" aria-labelledby={`${p}-t ${p}-d`} className="block select-none font-sans"
              onClick={() => setSelected(null)}>
              <title id={`${p}-t`}>Схема колонны и ствола</title>
              <desc id={`${p}-d`}>{summary}</desc>
              <Patterns p={p} />

              {/* formation, cement, borehole wall */}
              {L.scale.segments.map((s, i) => wallsFor(model, L, s.top, s.bottom, p, `w${i}`))}
              {open && (() => {
                const yb = L.Y(open.bottom), r = (open.id / 2) * L.k;
                return (
                  <g>
                    <rect x={L.cx - L.edge} y={yb} width={2 * L.edge} height={12} fill={`url(#${p}-formation)`} />
                    <path d={`M${L.cx - r},${yb} Q${L.cx},${yb + 14} ${L.cx + r},${yb} Z`} fill={C.paper} stroke={C.ink} strokeWidth="1.2" />
                  </g>
                );
              })()}

              {/* surface */}
              <line x1={L.cx - L.edge - 6} x2={L.cx + L.edge + 6} y1={L.padTop} y2={L.padTop} stroke={C.ink} strokeWidth="1.5" />
              {Array.from({ length: Math.floor((2 * L.edge + 12) / 6) }, (_, i) => L.cx - L.edge - 6 + i * 6).map((x) => (
                <line key={x} x1={x} y1={L.padTop} x2={x + 4} y2={L.padTop - 4} stroke={C.ink500} strokeWidth="0.8" />
              ))}

              {/* casings with shoes */}
              {model.hole.filter((h) => h.kind === 'casing').map((h) => {
                const y0 = L.Y(h.top), y1 = L.Y(h.bottom);
                const ro = (h.drawOd / 2) * L.k, ri = (h.id / 2) * L.k, w = Math.max(1.5, ro - ri);
                const isActive = active === h.key;
                return (
                  <g key={h.key} opacity={dim(h.key)}>
                    {[-1, 1].map((s) => (
                      <rect key={s} x={s < 0 ? L.cx - ri - w : L.cx + ri} y={y0} width={w} height={y1 - y0} fill={h.od === null ? C.ink700 : C.ink} />
                    ))}
                    <polygon points={`${L.cx - ro - 4},${y1} ${L.cx - ri},${y1} ${L.cx - ro - 4},${y1 - 10}`} fill={C.ink} />
                    <polygon points={`${L.cx + ro + 4},${y1} ${L.cx + ri},${y1} ${L.cx + ro + 4},${y1 - 10}`} fill={C.ink} />
                    {isActive && <rect x={L.cx - ro - 7} y={y0 - 2} width={2 * ro + 14} height={y1 - y0 + 4} fill="none" stroke={C.ink} strokeDasharray="3 2" />}
                  </g>
                );
              })}

              {/* string */}
              {model.string.map((c) => {
                const y0 = L.Y(c.top), y1 = L.Y(c.bottom), R = (outerOd(c) / 2) * L.k;
                return (
                  <g key={c.key} opacity={dim(c.key)}>
                    <ComponentShape item={c} g={{ cx: L.cx, y0, y1, k: L.k }} p={p} />
                    {active === c.key && <rect x={L.cx - R - 4} y={y0 - 1.5} width={2 * R + 8} height={y1 - y0 + 3} fill="none" stroke={C.ink} strokeDasharray="3 2" />}
                  </g>
                );
              })}

              {/* break marks on compressed intervals */}
              {L.breakYs.map((y) => {
                const x0 = L.cx - L.edge - 3, x1 = L.cx + L.edge + 3;
                const zig = (yy: number) => `M${x0},${yy} L${L.cx - 7},${yy} L${L.cx - 2},${yy - 5} L${L.cx + 2},${yy + 5} L${L.cx + 7},${yy} L${x1},${yy}`;
                return (
                  <g key={`b${y}`} aria-hidden="true">
                    <rect x={x0} y={y - 4} width={x1 - x0} height={8} fill={C.paper} />
                    <path d={zig(y - 4)} fill="none" stroke={C.ink} strokeWidth="1" />
                    <path d={zig(y + 4)} fill="none" stroke={C.ink} strokeWidth="1" />
                    <rect x={L.gutter - 4} y={y - 4} width={8} height={8} fill={C.paper} />
                    <line x1={L.gutter - 5} y1={y - 1} x2={L.gutter + 5} y2={y - 6} stroke={C.ink} />
                    <line x1={L.gutter - 5} y1={y + 6} x2={L.gutter + 5} y2={y + 1} stroke={C.ink} />
                  </g>
                );
              })}

              {/* depth axis */}
              <line x1={L.gutter} x2={L.gutter} y1={L.padTop} y2={L.bottomY} stroke={C.ink500} strokeWidth="1" />
              {activeEntry && (
                <rect x={L.gutter - 1.5} y={L.Y(activeEntry.item.top)} width="3" height={Math.max(2, L.Y(activeEntry.item.bottom) - L.Y(activeEntry.item.top))} fill={C.ink} />
              )}
              {L.scale.ticks.filter((t) => t.major || !L.breakYs.some((b) => Math.abs(b - (L.padTop + t.y)) < 12)).map((t) => {
                const y = L.padTop + t.y;
                const key = +t.md.toFixed(2);
                const strong = key === td || shoes.has(key) || (activeEntry && (Math.abs(activeEntry.item.top - t.md) < 0.01 || Math.abs(activeEntry.item.bottom - t.md) < 0.01));
                return (
                  <g key={`t${t.md}`}>
                    <line x1={L.gutter - (t.major ? 5 : 3)} x2={L.gutter} y1={y} y2={y} stroke={t.major ? C.ink : C.ink500} />
                    {t.major && <line x1={L.gutter} x2={L.cx - L.edge} y1={y} y2={y} stroke={C.ink200} strokeDasharray="1 2" />}
                    <text x={L.gutter - 7} y={y} dy="0.33em" textAnchor="end" className="num font-mono" fontSize={t.major ? L.fs - 0.5 : L.fs - 1.5}
                      fill={t.major ? C.ink : C.ink500} fontWeight={strong ? 700 : 400}>{fmt(t.md, 1)}</text>
                  </g>
                );
              })}
              <text x={L.gutter - 7} y={L.padTop - 14} textAnchor="end" fontSize={L.fs - 1} fill={C.ink500}>MD, м</text>

              {/* hit areas: hole walls, then string components */}
              {model.hole.map((h) => {
                const y0 = L.Y(h.top), y1 = L.Y(h.bottom);
                const ri = (h.id / 2) * L.k, ro = h.kind === 'casing' ? (h.drawOd / 2) * L.k + 4 : ri + 6;
                return (
                  <g key={`hit${h.key}`} {...pointer(h.key)}>
                    <rect x={L.cx - ro} y={y0} width={ro - ri + 2} height={y1 - y0} fill="transparent" />
                    <rect x={L.cx + ri - 2} y={y0} width={ro - ri + 2} height={y1 - y0} fill="transparent" />
                  </g>
                );
              })}
              {model.string.map((c) => {
                const y0 = L.Y(c.top), y1 = L.Y(c.bottom), R = (outerOd(c) / 2) * L.k + 2;
                return <rect key={`hit${c.key}`} x={L.cx - R} y={y0} width={2 * R} height={Math.max(4, y1 - y0)} fill="transparent" {...pointer(c.key)} />;
              })}

              {/* callouts */}
              {L.callouts.map((c) => {
                const top = L.placed.get(c.key) ?? c.ay;
                const ly = top + (c.lines.length * L.lineH) / 2;
                const isActive = active === c.key;
                const w = Math.max(...c.lines.map((l) => l.length)) * L.charW;
                return (
                  <g key={`c${c.key}`} {...pointer(c.key)} opacity={active && !isActive ? 0.45 : 1}>
                    <polyline points={`${c.ax + 2},${c.ay} ${L.elbowX},${c.ay} ${L.labelX - 6},${ly}`} fill="none" stroke={isActive ? C.ink : C.ink500} strokeWidth={isActive ? 1.2 : 0.75} />
                    <circle cx={c.ax + 2} cy={c.ay} r="1.6" fill={C.ink} />
                    <rect x={L.labelX - 4} y={top - 2} width={w + 8} height={c.lines.length * L.lineH + 4} fill="transparent" />
                    <text x={L.labelX} y={top} fontSize={L.fs} fill={C.ink} fontWeight={c.bold || isActive ? 600 : 400}>
                      {c.lines.map((l, i) => <tspan key={i} x={L.labelX} dy={i === 0 ? '0.95em' : L.lineH}>{l}</tspan>)}
                    </text>
                  </g>
                );
              })}

              {/* diameter scale bar */}
              {(() => {
                const bar = [50, 100, 200, 500].find((d) => d * L.k >= 34) ?? 500;
                const y = L.bottomY + 40, x0 = L.cx - (bar / 2) * L.k, x1 = L.cx + (bar / 2) * L.k;
                return (
                  <g aria-hidden="true">
                    <line x1={x0} x2={x1} y1={y} y2={y} stroke={C.ink} strokeWidth="1.2" />
                    <line x1={x0} x2={x0} y1={y - 4} y2={y + 4} stroke={C.ink} /><line x1={x1} x2={x1} y1={y - 4} y2={y + 4} stroke={C.ink} />
                    <text x={L.cx} y={y + 16} textAnchor="middle" className="num font-mono" fontSize={L.fs - 1} fill={C.ink500}>{bar} мм</text>
                  </g>
                );
              })()}
            </svg>
          )}
          {L && activeEntry && <Tooltip entry={activeEntry} L={L} width={width} />}
        </div>
        <figcaption className="mt-3 text-xs leading-relaxed text-ink-500">
          Глубина по стволу (MD), м. Масштаб глубины нелинейный: длинные интервалы сжаты и отмечены знаком разрыва, короткие элементы
          КНБК растянуты; все подписи глубин истинные. Ширина элементов — в масштабе диаметров (шкала внизу).
        </figcaption>
      </figure>
      <Legend model={model} p={p} active={active} selected={selected} onHover={setHover} onToggle={toggle} />
    </div>
  );
};

const Tooltip = ({ entry, L, width }: { entry: Entry; L: Layout; width: number }) => {
  const y0 = L.Y(entry.item.top), y1 = L.Y(entry.item.bottom);
  const R = entry.group === 'string' ? (outerOd(entry.item) / 2) * L.k : (entry.item.drawOd / 2) * L.k;
  const w = Math.min(232, width - 8);
  let left = L.cx + R + 14;
  let top = Math.max(4, (y0 + y1) / 2 - 24);
  if (left + w > width - 4) {
    left = L.cx - R - 14 - w;
    if (left < 4) { left = Math.max(4, Math.min(width - w - 4, L.cx - w / 2)); top = Math.min(y1 + 10, L.H - 140); }
  }
  return (
    <div aria-hidden="true" className="pointer-events-none absolute z-10 rounded-md border border-ink bg-paper px-3 py-2 text-xs shadow-pop" style={{ left, top, width: w }}>
      <p className="font-semibold text-ink">{entry.group === 'string' ? entry.item.name : entry.item.name}</p>
      <dl className="mt-1 space-y-0.5">
        {detailsOf(entry).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3"><dt className="text-ink-500">{k}</dt><dd className="num text-right font-mono text-ink">{v}</dd></div>
        ))}
      </dl>
    </div>
  );
};

/** The layers from bottom to top. It is also the keyboard and screen-reader way into the drawing. */
const Legend = ({ model, p, active, selected, onHover, onToggle }: {
  model: SchematicModel; p: string; active: string | null; selected: string | null;
  onHover: (k: string | null) => void; onToggle: (k: string | null) => void;
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const stringEntries: Entry[] = [...model.string].reverse().map((item) => ({ group: 'string', key: item.key, item }));
  const holeEntries: Entry[] = [...model.hole].sort((a, b) => b.bottom - a.bottom).map((item) => ({ group: 'hole', key: item.key, item }));
  const first = stringEntries[0]?.key ?? holeEntries[0]?.key ?? null;
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const tabKey = [...stringEntries, ...holeEntries].some((e) => e.key === focusKey) ? focusKey : first;

  const onKeyDown = (e: KeyboardEvent) => {
    const buttons = [...(listRef.current?.querySelectorAll<HTMLButtonElement>('button[data-key]') ?? [])];
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const next = e.key === 'ArrowDown' ? Math.min(buttons.length - 1, i + 1) : e.key === 'ArrowUp' ? Math.max(0, i - 1)
      : e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : -1;
    if (next >= 0) { e.preventDefault(); buttons[next].focus(); }
  };

  const row = (e: Entry): ReactNode => {
    const it = e.item;
    const sizes = e.group === 'string'
      ? `НД ${fmt(e.item.od, 1)}${e.item.id ? ` · ВД ${fmt(e.item.id, 1)}` : ''} мм · ${fmt(e.item.length)} м`
      : e.item.kind === 'casing'
        ? `${e.item.od !== null ? `НД ${fmt(e.item.od, 1)} · ` : ''}ВД ${fmt(e.item.id, 1)} мм · башмак ${fmt(e.item.bottom)} м`
        : `Ø ${fmt(e.item.id, 1)} мм · ${fmt(e.item.bottom - e.item.top)} м`;
    const extra = detailsOf(e).filter(([k]) => ['Замок', 'Лопасти', 'Вес', 'Марка', 'Коэф. трения'].includes(k)).map(([k, v]) => `${k}: ${v}`).join('; ');
    return (
      <li key={e.key}>
        <button type="button" data-key={e.key} tabIndex={tabKey === e.key ? 0 : -1} aria-pressed={selected === e.key}
          onFocus={() => { setFocusKey(e.key); onHover(e.key); }} onBlur={() => onHover(null)}
          onMouseEnter={() => onHover(e.key)} onMouseLeave={() => onHover(null)} onClick={() => onToggle(e.key)}
          className={cn('flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left text-xs outline-none transition-colors touch:py-2.5',
            'focus-visible:ring-2 focus-visible:ring-ink', active === e.key ? 'bg-ink-100' : 'hover:bg-ink-50', selected === e.key && 'ring-1 ring-ink')}>
          <Swatch kind={e.group === 'string' ? e.item.kind : e.item.kind} p={p} />
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
              <span className={cn('min-w-0 text-ink', e.group === 'hole' ? 'font-semibold' : 'font-medium')}>{it.name}</span>
              <span className="num shrink-0 whitespace-nowrap font-mono text-2xs text-ink-500">{fmt(it.top)}–{fmt(it.bottom)} м</span>
            </span>
            <span className="num mt-0.5 block font-mono text-2xs text-ink-700">{sizes}</span>
            {extra && <span className="sr-only">. {extra}</span>}
          </span>
        </button>
      </li>
    );
  };

  return (
    <aside aria-label="Слои схемы" className="min-w-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto thin-scrollbar">
      <div ref={listRef} onKeyDown={onKeyDown} className="space-y-4">
        <p className="text-2xs text-ink-500">Наведите или нажмите на слой — он выделится на схеме. С клавиатуры: Tab, затем ↑ ↓, Enter закрепляет, Esc снимает.</p>
        {stringEntries.length > 0 && (
          <section>
            <h3 className="mb-1 text-2xs font-medium uppercase tracking-wider text-ink-500">Колонна · снизу вверх</h3>
            <ol className="space-y-0.5">{stringEntries.map(row)}</ol>
          </section>
        )}
        {holeEntries.length > 0 && (
          <section>
            <h3 className="mb-1 text-2xs font-medium uppercase tracking-wider text-ink-500">Ствол · снизу вверх</h3>
            <ol className="space-y-0.5">{holeEntries.map(row)}</ol>
          </section>
        )}
      </div>
    </aside>
  );
};
