import test from 'node:test';
import assert from 'node:assert/strict';
import { buildModel, classify, depthScale, nominalCasingOd, placeLabels, uniqueBreaks, wrap } from './schematic.ts';

test('classifies imported English and Russian component types', () => {
  const cases = {
    'Drill Pipe': 'drillPipe', 'Бурильная труба': 'drillPipe', 'СБТ 127': 'drillPipe',
    'Heavy Weight': 'hwdp', 'Heavy Weight Drill Pipe': 'hwdp', 'ТБТ': 'hwdp',
    'Drill Collar': 'collar', 'Non-Mag Drill Collar': 'collar', 'УБТ 165': 'collar',
    Stabilizer: 'stabilizer', 'Near Bit Stabilizer': 'stabilizer', 'Калибратор': 'stabilizer',
    Jar: 'jar', 'Mechanical Jar': 'jar', 'Ясс гидравлический': 'jar',
    'Mud Motor': 'motor', 'ВЗД': 'motor', MWD: 'mwd', 'MWD Tool': 'mwd', 'Телесистема': 'mwd',
    Sub: 'sub', 'Cross Over': 'sub', 'Bit Sub': 'sub', 'Переводник': 'sub',
    Bit: 'bit', 'Polycrystalline Diamond Bit': 'bit', 'Долото PDC': 'bit',
    'Something odd': 'other', '': 'other',
  };
  for (const [type, kind] of Object.entries(cases)) assert.equal(classify(type), kind, type);
});

test('depth scale is monotonic, keeps every interval readable and labels true depths', () => {
  const breaks = [500, 1800, 2240, 2400, 2590, 2599.7, 2600];
  const s = depthScale(breaks, { height: 800, minPx: 22 });
  assert.equal(s.y(0), 0);
  for (const g of s.segments) {
    assert.ok(g.y1 - g.y0 >= 22, `interval ${g.top}–${g.bottom} is at least 22 px`);
    assert.ok(Math.abs(s.y(g.top) - g.y0) < 1e-9 && Math.abs(s.y(g.bottom) - g.y1) < 1e-9);
  }
  for (let md = 0; md < 2600; md += 7) assert.ok(s.y(md + 7) > s.y(md), `monotonic at ${md}`);
  // A 0,3 m bit is drawn far larger per metre than 1300 m of drill pipe, which is marked as compressed.
  const pipe = s.segments.find((g) => g.top === 500);
  const bit = s.segments.at(-1);
  assert.ok((bit.y1 - bit.y0) / 0.3 > 50 * (pipe.y1 - pipe.y0) / 1300);
  assert.equal(pipe.compressed, true);
  assert.equal(bit.compressed, false);
  // Ticks sit exactly where y() puts their depth.
  for (const t of s.ticks) assert.ok(Math.abs(s.y(t.md) - t.y) < 1e-9);
  assert.ok(s.ticks.some((t) => !t.major && t.md % 100 === 0), 'round intermediate ticks inside long intervals');
});

test('depth scale grows for many components instead of squeezing them', () => {
  const breaks = Array.from({ length: 60 }, (_, i) => (i + 1) * 10);
  const s = depthScale(breaks, { height: 600, minPx: 22 });
  assert.ok(s.height >= 60 * 22);
  assert.equal(depthScale([], { height: 600 }).segments.length, 0);
});

test('uniqueBreaks merges centimetre noise and drops invalid values', () => {
  assert.deepEqual(uniqueBreaks([1800, 0, 1800.01, NaN, -5, 500]), [0, 500, 1800]);
});

test('labels never overlap and stay inside the drawing', () => {
  const placed = placeLabels([
    { key: 'a', y: 100, height: 14 }, { key: 'b', y: 102, height: 14 }, { key: 'c', y: 104, height: 28 }, { key: 'd', y: 395, height: 14 },
  ], { gap: 4, minY: 0, maxY: 400 });
  for (let i = 1; i < placed.length; i += 1) {
    const prevH = [14, 14, 28, 14][i - 1];
    assert.ok(placed[i].top >= placed[i - 1].top + prevH + 4 - 1e-9);
  }
  assert.ok(placed.at(-1).top + 14 <= 400);
});

test('model: casing without OD, open hole, joints, ordering and hints', () => {
  const m = buildModel([
    { type: 'Mud Motor', body_md: 2400, body_length: 30, body_od: 171.45 },
    { type: 'Drill Pipe', body_md: 2190, body_length: 2190, body_od: 127, body_id: 108.6, stabilizer_od: 168.3, stabilizer_length: 0.43 },
    { type: 'Heavy Weight', body_md: 2370, body_length: 180, body_od: 127 },
    { type: 'Stabilizer', body_md: 2401, body_length: 0, body_od: 171 },
  ], { caisings: [{ md_top: 0, md_base: 1000, shoe_md: 1000, od: 0, inner_diameter: 226.7, description_caising: 'Casing' }],
    open_hole_md_top: 1000, open_hole_md_base: 2600, effective_diameter: 215.9 });
  assert.deepEqual(m.string.map((c) => c.kind), ['drillPipe', 'hwdp', 'motor']);
  assert.equal(m.string[0].joint.od, 168.3);
  assert.equal(m.string[1].joint, null);
  assert.equal(m.string[2].top, 2370);
  assert.equal(m.hole[0].od, null);
  assert.equal(m.hole[0].drawOd, 244.5);
  assert.match(m.hole[0].label, /^Обсадная колонна ВД\s226,7\sмм до\s1\s000\sм$/);
  assert.equal(m.hole[1].label, 'Открытый ствол 215,9\u00a0мм');
  assert.equal(m.totalDepth, 2600);
  assert.ok(m.hints.some((h) => h.includes('не показан')));
  assert.ok(m.hints.some((h) => h.includes('замки')));
});

test('model: empty inputs and a string deeper than the hole never throw', () => {
  const empty = buildModel(null, null);
  assert.equal(empty.string.length + empty.hole.length, 0);
  assert.equal(empty.totalDepth, 0);
  const deep = buildModel([{ type: 'Drill Pipe', body_md: 3000, body_length: 3000, body_od: 127 }],
    { caisings: [], open_hole_md_top: 0, open_hole_md_base: 2000, effective_diameter: 215.9 });
  assert.ok(deep.hints.some((h) => h.includes('глубже')));
  assert.equal(deep.totalDepth, 3000);
});

test('helpers', () => {
  assert.equal(nominalCasingOd(161.7), 177.8);
  assert.equal(nominalCasingOd(313.6), 339.7);
  assert.deepEqual(wrap('Обсадная колонна 244,5 мм до 1 800 м', 18), ['Обсадная колонна', '244,5 мм до 1 800', 'м']);
});
