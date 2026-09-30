import { ArrowHead, FAINT, GREY, INK, LIGHT, Marker, Svg } from './svg';

/** How data flows: data → case → prediction → comparison. */
export const ServiceLogicFigure = () => {
  const steps = [
    { title: 'Данные', sub: 'импорт отчёта или ручной ввод' },
    { title: 'Кейс', sub: 'траектория, колонна, ствол, раствор' },
    { title: 'Прогноз Torque & Drag', sub: 'ML-модель: нагрузки по глубине', tag: true },
    { title: 'Сравнение с отчётом', sub: 'модель против эталона из отчёта' },
  ];
  return (
    <Svg width={360} height={392} max={420} label="Схема работы: данные, кейс, прогноз Torque & Drag, сравнение с отчётом">
      {steps.map((s, i) => {
        const y = 8 + i * 96;
        return (
          <g key={s.title}>
            <rect x={20} y={y} width={320} height={64} rx={8} fill={i === 2 ? INK : '#FFFFFF'} stroke={INK} strokeWidth={1.5} />
            <circle cx={46} cy={y + 32} r={12} fill={i === 2 ? '#FFFFFF' : INK} />
            <text x={46} y={y + 36.5} textAnchor="middle" fontSize={12} fontWeight={700} fill={i === 2 ? INK : '#FFFFFF'}>{i + 1}</text>
            <text x={70} y={y + 28} fontSize={14} fontWeight={600} fill={i === 2 ? '#FFFFFF' : INK}>{s.title}</text>
            <text x={70} y={y + 47} fontSize={11.5} fill={i === 2 ? '#D4D4D8' : GREY}>{s.sub}</text>
            {s.tag && (
              <g>
                <rect x={236} y={y - 9} width={96} height={18} rx={9} fill="#FFFFFF" stroke={INK} />
                <text x={284} y={y + 3.5} textAnchor="middle" fontSize={10} fontWeight={600} fill={INK}>не валидировано</text>
              </g>
            )}
            {i < steps.length - 1 && (
              <g>
                <line x1={180} y1={y + 64} x2={180} y2={y + 90} stroke={INK} strokeWidth={1.5} />
                <ArrowHead x={180} y={y + 96} dir="down" />
              </g>
            )}
          </g>
        );
      })}
      <text x={338} y={390} textAnchor="end" fontSize={10} fill={GREY}>шаг 4 — только для импортированных кейсов</text>
    </Svg>
  );
};

const levels = [
  ['Компания', 'Демо Бурение'], ['Месторождение', 'Северное'], ['Куст', 'Куст 12'], ['Скважина', 'Скв. 12-1'],
  ['Ствол', 'Основной ствол'], ['Дизайн', 'План #1'], ['Траектория', 'Проект 2400 м'], ['Кейс', 'Секция 215,9 мм'],
];

/** The eight levels as an indented tree, with synthetic example names. */
export const HierarchyFigure = () => (
  <Svg width={360} height={330} max={440} label="Восемь уровней иерархии: компания, месторождение, куст, скважина, ствол, дизайн, траектория, кейс">
    {levels.map(([label, example], i) => {
      const x = 8 + i * 18;
      const y = 6 + i * 40;
      const last = i === levels.length - 1;
      return (
        <g key={label}>
          {i > 0 && <path d={`M${x - 8} ${y - 10} V${y + 15} H${x}`} fill="none" stroke={LIGHT} strokeWidth={1.5} />}
          <rect x={x} y={y} width={204} height={30} rx={5} fill={last ? INK : '#FFFFFF'} stroke={INK} strokeWidth={last ? 0 : 1.25} />
          <text x={x + 10} y={y + 19.5} fontSize={12.5} fontWeight={600} fill={last ? '#FFFFFF' : INK}>{label}</text>
          <text x={x + 196} y={y + 19.5} textAnchor="end" fontSize={10.5} fontFamily="JetBrains Mono, ui-monospace, monospace" fill={last ? '#D4D4D8' : GREY}>{example}</text>
        </g>
      );
    })}
  </Svg>
);

/** The app shell: explorer, top bar, main panel, status bar, with numbered markers. */
export const InterfaceFigure = () => (
  <Svg width={360} height={250} max={560} label="Окно MunaiPlan: проводник слева, верхняя панель, рабочая панель и строка состояния">
    <rect x={4} y={4} width={352} height={242} rx={6} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
    {/* Explorer */}
    <rect x={5} y={5} width={95} height={221} fill={FAINT} />
    <line x1={100} y1={5} x2={100} y2={226} stroke={LIGHT} />
    <text x={12} y={20} fontSize={7.5} fontWeight={700} fill={GREY} letterSpacing={0.6}>ПРОВОДНИК</text>
    <rect x={12} y={27} width={80} height={11} rx={2} fill="#FFFFFF" stroke={LIGHT} />
    <text x={16} y={35} fontSize={7} fill={GREY}>Поиск…</text>
    {[['Демо Бурение', 0], ['Северное', 1], ['Куст 12', 2], ['Скв. 12-1', 3], ['Основной ствол', 4], ['План #1', 5], ['Проект 2400 м', 6], ['Секция 215,9', 7], ['Секция 152,4', 7]].map(([name, depth], i) => {
      const y = 50 + i * 14;
      const active = i === 7;
      return (
        <g key={i}>
          {active && <rect x={5} y={y - 9} width={95} height={13} fill={INK} />}
          <text x={12 + Number(depth) * 5} y={y} fontSize={7.5} fill={active ? '#FFFFFF' : INK}>{name}</text>
        </g>
      );
    })}
    {/* Top bar */}
    <line x1={100} y1={28} x2={356} y2={28} stroke={LIGHT} />
    <text x={110} y={19.5} fontSize={8} fill={GREY}>Рабочая область / … /</text>
    <text x={198} y={19.5} fontSize={8} fontWeight={600} fill={INK}>Секция 215,9 мм</text>
    {[306, 322, 338].map((x) => <rect key={x} x={x} y={11} width={10} height={10} rx={2} fill="none" stroke={GREY} />)}
    {/* Main panel */}
    <text x={112} y={44} fontSize={7} fill={GREY} letterSpacing={0.4}>КЕЙС</text>
    <text x={112} y={57} fontSize={11} fontWeight={700} fill={INK}>Секция 215,9 мм</text>
    {['Обзор', 'Ствол', 'Колонна', 'Раствор', 'Torque & Drag'].map((t, i) => (
      <text key={t} x={112 + [0, 30, 58, 95, 130][i]} y={76} fontSize={7.5} fontWeight={i === 4 ? 700 : 400} fill={i === 4 ? INK : GREY}>{t}</text>
    ))}
    <line x1={242} y1={80} x2={292} y2={80} stroke={INK} strokeWidth={1.5} />
    <line x1={108} y1={81} x2={350} y2={81} stroke={LIGHT} />
    <rect x={112} y={90} width={232} height={128} rx={4} fill="#FFFFFF" stroke={LIGHT} />
    <path d="M130 100 C 170 140 200 180 250 210" fill="none" stroke={INK} strokeWidth={1.5} />
    <path d="M130 100 C 180 140 230 180 300 210" fill="none" stroke={INK} strokeWidth={1.5} strokeDasharray="5 3" />
    <line x1={330} y1={98} x2={330} y2={212} stroke="#A1A1AA" />
    {/* Status bar */}
    <path d="M4 226 H356 V240 A6 6 0 0 1 350 246 H10 A6 6 0 0 1 4 240 Z" fill={INK} />
    <circle cx={14} cy={236} r={2} fill="#FFFFFF" />
    <text x={20} y={239} fontSize={7.5} fill="#FFFFFF">API</text>
    <circle cx={42} cy={236} r={2} fill="#FFFFFF" />
    <text x={48} y={239} fontSize={7.5} fill="#FFFFFF">Модель готова</text>
    <text x={108} y={239} fontSize={7.5} fill="#D4D4D8">Прогнозы не валидированы</text>
    <Marker x={52} y={196} n={1} />
    <Marker x={287} y={16} n={2} />
    <Marker x={228} y={150} n={3} />
    <Marker x={300} y={236} n={4} inverted />
  </Svg>
);
