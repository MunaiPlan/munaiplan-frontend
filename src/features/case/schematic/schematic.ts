/**
 * Pure model and layout maths for the string and wellbore schematic («Схема колонны и ствола»).
 * No React and no runtime imports, so the unit tests run it directly under Node.
 *
 * Depth scale: piecewise linear between "breaks" (every component, shoe and hole boundary). Each
 * interval gets a minimum height plus a share that grows with the square root of its length, so
 * thousands of metres of drill pipe are compressed and a 0,3 m bit stays readable. Inside an
 * interval the scale is linear, so every depth label (boundaries and round ticks) is true.
 */

/** Monochrome palette: ink and paper, greys only for hierarchy (tailwind.config.js). */
export const C = { ink: '#0A0A0A', ink700: '#3F3F46', ink500: '#71717A', ink300: '#D4D4D8', ink200: '#E4E4E7', ink100: '#F4F4F5', paper: '#FFFFFF' };

export type ComponentKind = 'drillPipe' | 'hwdp' | 'collar' | 'stabilizer' | 'jar' | 'motor' | 'mwd' | 'sub' | 'bit' | 'other';

export const kindNames: Record<ComponentKind, { name: string; short: string }> = {
  drillPipe: { name: 'Бурильная труба', short: 'БТ' },
  hwdp: { name: 'Толстостенная бурильная труба', short: 'ТБТ' },
  collar: { name: 'Утяжелённая бурильная труба', short: 'УБТ' },
  stabilizer: { name: 'Центратор', short: 'Центратор' },
  jar: { name: 'Яс', short: 'Яс' },
  motor: { name: 'Забойный двигатель', short: 'ГЗД' },
  mwd: { name: 'Телесистема', short: 'MWD' },
  sub: { name: 'Переводник', short: 'Переводник' },
  bit: { name: 'Долото', short: 'Долото' },
  other: { name: 'Элемент', short: 'Элемент' },
};

// Order matters: "Near Bit Stabilizer" is a stabilizer, "Heavy Weight Drill Pipe" is HWDP, "Bit Sub" is a sub.
// Cyrillic has no \b in JS regular expressions, so Russian words match as substrings.
const rules: [ComponentKind, RegExp][] = [
  ['stabilizer', /stab|центратор|калибратор|reamer|расширител|стабилизатор/i],
  ['jar', /\bjar|(^|[^а-яё])ясс?([^а-яё]|$)|accelerat|ускорител|shock|амортизатор/i],
  ['motor', /motor|turbin|bent|двигател|взд|гзд|турбобур|rotary steer|\brss\b|роторн\S* управля/i],
  ['mwd', /\bmwd|\blwd|telemetr|gamma|телесистем|каротаж/i],
  ['hwdp', /heavy|\bhwdp?\b|тбт|толстостен/i],
  ['collar', /collar|\bdc\b|non.?mag|убт|утяжел/i],
  ['drillPipe', /drill ?pipe|\bdp\b|бурильн|(^|[^а-яё])(с|л|о)?бт([^а-яё]|$)|тбп/i],
  ['sub', /\bsub\b|cross ?over|x-?over|float|filter|circulat|переводник|клапан|фильтр|циркуляц/i],
  ['bit', /\bbit\b|pdc|долот|шарош/i],
];

export const classify = (type: string | null | undefined): ComponentKind => {
  const t = (type ?? '').trim();
  if (!t) return 'other';
  return rules.find(([, re]) => re.test(t))?.[0] ?? 'other';
};

/** Russian display name; the stored type stays visible in the details. */
export const displayName = (kind: ComponentKind, type: string): string => {
  if (kind === 'other') return type.trim() || kindNames.other.name;
  if (kind === 'bit') {
    if (/pdc|polycrystalline|алмаз/i.test(type)) return 'Долото PDC';
    if (/bi-?cent|бицентр/i.test(type)) return 'Бицентричное долото';
    if (/roller|tricone|шарош/i.test(type)) return 'Шарошечное долото';
  }
  if (kind === 'jar' && /accelerat|ускорител/i.test(type)) return 'Ускоритель яса';
  if (kind === 'jar' && /shock|амортизатор/i.test(type)) return 'Амортизатор';
  if (kind === 'sub' && /float|клапан/i.test(type)) return 'Обратный клапан';
  if (kind === 'collar' && /non.?mag|немагн/i.test(type)) return 'Немагнитная УБТ';
  return kindNames[kind].name;
};

/* ---------- input shapes (loose: API values may be null, 0 or missing) ---------- */

type Num = number | null | undefined;

export interface RawSection {
  id?: string; type?: string | null; body_md?: Num; body_length?: Num; body_od?: Num; body_id?: Num;
  avg_joint_length?: Num; stabilizer_length?: Num; stabilizer_od?: Num; stabilizer_id?: Num;
  weight?: Num; grade?: string | null;
}
export interface RawCasing {
  id?: string; md_top?: Num; md_base?: Num; shoe_md?: Num; od?: Num; inner_diameter?: Num; drift_id?: Num;
  effective_hole_diameter?: Num; friction_factor_caising?: Num; description_caising?: string | null;
}
export interface RawHole {
  caisings?: RawCasing[] | null; open_hole_md_top?: Num; open_hole_md_base?: Num; effective_diameter?: Num; friction_factor_open_hole?: Num;
}

/* ---------- normalized model ---------- */

export interface StringItem {
  key: string;
  kind: ComponentKind;
  type: string;
  name: string;
  top: number;
  bottom: number;
  length: number;
  od: number;
  id: number | null;
  /** Tool joint (pipes) — from the «Замок» columns. Null when not given. */
  joint: { od: number; id: number | null; length: number | null } | null;
  /** Stabilizer blades — the same columns hold the blade OD and length for a stabilizer. */
  blade: { od: number; length: number | null } | null;
  jointLength: number | null;
  weight: number | null;
  grade: string | null;
}

export interface HoleItem {
  key: string;
  kind: 'casing' | 'open';
  name: string;
  top: number;
  bottom: number;
  /** Inner diameter of the casing, or the open-hole diameter. */
  id: number;
  /** Stored casing OD; null when not given. */
  od: number | null;
  /** OD used for drawing: stored, else the nearest standard casing size above the ID. */
  drawOd: number;
  /** Drilled hole around the casing, when known. */
  holeDiameter: number | null;
  shoe: number | null;
  friction: number | null;
  label: string;
}

export interface SchematicModel {
  string: StringItem[];
  hole: HoleItem[];
  /** Deepest point of anything drawn. */
  totalDepth: number;
  /** Gentle Russian hints about missing or inconsistent data. */
  hints: string[];
}

const pos = (v: Num): number | null => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null);
const nonNeg = (v: Num): number | null => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null);

export const fmt = (v: number, digits = 2): string => v.toLocaleString('ru-RU', { maximumFractionDigits: digits });

/** API 5CT casing ODs, mm. */
const casingSizes = [114.3, 127, 139.7, 168.3, 177.8, 193.7, 219.1, 244.5, 273.1, 298.4, 323.9, 339.7, 406.4, 473.1, 508];
/** The smallest standard casing whose wall (OD − ID) is plausible for the given ID. */
export const nominalCasingOd = (id: number): number =>
  casingSizes.find((od) => od - id >= 12 && od - id <= 45) ?? +(id * 1.08).toFixed(1);

const casingName = (desc: string | null | undefined): string => {
  const d = (desc ?? '').trim();
  if (!d || /^casing$/i.test(d)) return 'Обсадная колонна';
  if (/^liner$/i.test(d)) return 'Хвостовик';
  return d;
};

export function buildModel(sections: RawSection[] | null | undefined, hole: RawHole | null | undefined): SchematicModel {
  const hints: string[] = [];

  // String: sorted top to bottom by the stored bottom depth; missing depths fall back to the running sum of lengths.
  const raw = [...(sections ?? [])];
  if (raw.every((s) => nonNeg(s.body_md) !== null)) raw.sort((a, b) => (a.body_md as number) - (b.body_md as number));
  const items: StringItem[] = [];
  let running = 0;
  let skipped = 0;
  raw.forEach((s, i) => {
    const length = pos(s.body_length);
    const od = pos(s.body_od);
    if (length === null || od === null) { skipped += 1; return; }
    const bottom = pos(s.body_md) ?? running + length;
    const top = Math.max(0, bottom - length);
    const type = (s.type ?? '').trim();
    const kind = classify(type);
    const tjOd = pos(s.stabilizer_od);
    items.push({
      key: `s${i}`, kind, type, name: displayName(kind, type), top, bottom, length, od, id: pos(s.body_id),
      joint: kind !== 'stabilizer' && tjOd !== null ? { od: tjOd, id: pos(s.stabilizer_id), length: pos(s.stabilizer_length) } : null,
      blade: kind === 'stabilizer' && tjOd !== null ? { od: tjOd, length: pos(s.stabilizer_length) } : null,
      jointLength: pos(s.avg_joint_length), weight: pos(s.weight), grade: s.grade?.trim() || null,
    });
    running = bottom;
  });
  if (skipped) hints.push(`${skipped === 1 ? 'Один элемент колонны не показан' : `Не показано элементов колонны: ${skipped}`} — не задана длина или НД.`);
  const noJoints = items.filter((c) => (c.kind === 'drillPipe' || c.kind === 'hwdp') && !c.joint).length;
  if (noJoints) hints.push('Для части бурильных труб не заданы замки — трубы нарисованы без замков.');

  // Hole: casings by shoe depth, then the open hole below.
  const holeItems: HoleItem[] = [];
  let casingSkipped = 0;
  (hole?.caisings ?? []).forEach((c, i) => {
    const bottom = pos(c.shoe_md) ?? pos(c.md_base);
    const id = pos(c.inner_diameter) ?? pos(c.drift_id);
    const od = pos(c.od);
    const innerD = id ?? (od !== null ? +(od * 0.92).toFixed(1) : null);
    if (bottom === null || innerD === null) { casingSkipped += 1; return; }
    const top = Math.min(nonNeg(c.md_top) ?? 0, bottom);
    const name = casingName(c.description_caising);
    const size = od !== null ? `${fmt(od, 1)} мм` : `ВД ${fmt(innerD, 1)} мм`;
    holeItems.push({
      key: `c${i}`, kind: 'casing', name, top, bottom, id: innerD, od, drawOd: od ?? nominalCasingOd(innerD),
      holeDiameter: pos(c.effective_hole_diameter), shoe: bottom, friction: nonNeg(c.friction_factor_caising),
      label: `${name} ${size} до ${fmt(bottom, 1)} м`,
    });
  });
  if (casingSkipped) hints.push(`Не показано обсадных колонн: ${casingSkipped} — не задана глубина башмака или диаметр.`);
  holeItems.sort((a, b) => a.bottom - b.bottom);

  if (hole) {
    const lastShoe = holeItems.at(-1)?.bottom ?? 0;
    const bottom = pos(hole.open_hole_md_base);
    const top = nonNeg(hole.open_hole_md_top) || lastShoe;
    const d = pos(hole.effective_diameter);
    if (bottom !== null && d !== null && bottom > top) {
      holeItems.push({
        key: 'open', kind: 'open', name: 'Открытый ствол', top, bottom, id: d, od: null, drawOd: d, holeDiameter: d, shoe: null,
        friction: nonNeg(hole.friction_factor_open_hole), label: `Открытый ствол ${fmt(d, 1)} мм`,
      });
    } else if (bottom !== null || d !== null) {
      hints.push('Открытый ствол не показан — не заданы низ (забой) или эффективный диаметр.');
    }
  }

  const stringBottom = items.at(-1)?.bottom ?? 0;
  const holeBottom = Math.max(0, ...holeItems.map((h) => h.bottom));
  if (!items.length && raw.length === 0) hints.push('Рабочая колонна не задана — показан только ствол.');
  if (!holeItems.length) hints.push('Секции ствола не заданы — показана только колонна.');
  if (items.length && holeItems.length && stringBottom > holeBottom + 0.01) {
    hints.push(`Колонна (${fmt(stringBottom)} м) глубже последней секции ствола (${fmt(holeBottom)} м): ниже ствол не описан.`);
  }
  return { string: items, hole: holeItems, totalDepth: Math.max(stringBottom, holeBottom), hints };
}

/* ---------- depth scale ---------- */

export interface DepthSegment {
  top: number;
  bottom: number;
  y0: number;
  y1: number;
  /** Drawn noticeably smaller than a linear scale would draw it: marked with a break symbol. */
  compressed: boolean;
}

export interface DepthTick { md: number; y: number; major: boolean }

export interface DepthScale {
  y: (md: number) => number;
  height: number;
  segments: DepthSegment[];
  ticks: DepthTick[];
}

export interface ScaleOptions {
  /** Preferred drawing height in px (top of 0 m to the deepest point). */
  height: number;
  /** Minimum height of any interval in px. */
  minPx?: number;
  /** Intervals drawn below this share of the linear scale get a break mark. */
  compressRatio?: number;
}

/** Unique sorted depths, merging points closer than 2 cm (rounding noise between tables). */
export const uniqueBreaks = (values: number[]): number[] => {
  const sorted = values.filter((v) => Number.isFinite(v) && v >= 0).sort((a, b) => a - b);
  const out: number[] = [];
  for (const v of sorted) if (out.length === 0 || v - (out.at(-1) as number) > 0.02) out.push(v);
  return out;
};

const niceSteps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];

export function depthScale(breakDepths: number[], { height, minPx = 22, compressRatio = 0.6 }: ScaleOptions): DepthScale {
  const breaks = uniqueBreaks([0, ...breakDepths]);
  if (breaks.length < 2) return { y: () => 0, height: 0, segments: [], ticks: breaks.map((md) => ({ md, y: 0, major: true })) };
  const lengths = breaks.slice(1).map((b, i) => b - breaks[i]);
  const n = lengths.length;
  const total = Math.max(height, n * minPx * 1.6);
  const roots = lengths.reduce((s, l) => s + Math.sqrt(l), 0);
  const a = (total - n * minPx) / roots;
  const linear = total / (breaks.at(-1) as number);

  const segments: DepthSegment[] = [];
  let y = 0;
  lengths.forEach((l, i) => {
    const h = minPx + a * Math.sqrt(l);
    segments.push({ top: breaks[i], bottom: breaks[i + 1], y0: y, y1: y + h, compressed: h / l < compressRatio * linear });
    y += h;
  });

  const yOf = (md: number): number => {
    if (md <= 0) return 0;
    const s = segments.find((g) => md <= g.bottom) ?? (segments.at(-1) as DepthSegment);
    const t = Math.min(1, (md - s.top) / (s.bottom - s.top));
    return s.y0 + t * (s.y1 - s.y0);
  };

  // Boundary labels, plus round depths inside tall intervals (linear there, so they are true).
  const ticks: DepthTick[] = breaks.map((md) => ({ md, y: yOf(md), major: true }));
  for (const s of segments) {
    const pxPerM = (s.y1 - s.y0) / (s.bottom - s.top);
    const step = niceSteps.find((st) => st * pxPerM >= 48);
    if (!step) continue;
    for (let md = Math.ceil((s.top + 1e-6) / step) * step; md < s.bottom; md += step) {
      const ty = yOf(md);
      if (ty - s.y0 >= 16 && s.y1 - ty >= 16) ticks.push({ md, y: ty, major: false });
    }
  }
  ticks.sort((p, q) => p.y - q.y);
  return { y: yOf, height: y, segments, ticks };
}

/* ---------- callout placement ---------- */

export interface LabelRequest { key: string; y: number; height: number }
export interface PlacedLabel { key: string; y: number; top: number }

/**
 * Stacks labels near their anchors without overlap: push down in order, then pull back up from
 * the bottom if the stack overflows `maxY`. `top` is the top of each label block.
 */
export function placeLabels(requests: LabelRequest[], { gap = 4, minY = 0, maxY = Infinity } = {}): PlacedLabel[] {
  const sorted = [...requests].sort((a, b) => a.y - b.y);
  const tops: number[] = [];
  sorted.forEach((r, i) => {
    const want = r.y - r.height / 2;
    const floor = i === 0 ? minY : tops[i - 1] + sorted[i - 1].height + gap;
    tops.push(Math.max(want, floor));
  });
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const ceiling = i === sorted.length - 1 ? maxY - sorted[i].height : tops[i + 1] - gap - sorted[i].height;
    if (tops[i] > ceiling) tops[i] = Math.max(minY, ceiling);
  }
  return sorted.map((r, i) => ({ key: r.key, y: r.y, top: tops[i] }));
}

/** Greedy word wrap by an approximate character budget. */
export const wrap = (text: string, maxChars: number): string[] => {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > maxChars) { lines.push(line); line = word; } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
};
