import { ArrowHead, GREY, INK, Svg } from './svg';

/** Import: files → check (preview) → import → hierarchy, case and reference results. */
export const ImportFlowFigure = () => {
  const outputs = [
    { x: 8, title: 'Иерархия', lines: ['компания … ', 'траектория'] },
    { x: 126, title: 'Кейс', lines: ['колонна, ствол,', 'раствор'] },
    { x: 244, title: 'Эталон', lines: ['результаты T&D', 'из отчёта'] },
  ];
  return (
    <Svg width={360} height={352} max={440} label="Импорт: выберите файлы, нажмите «Проверить», просмотрите данные, нажмите «Импортировать» — создаются иерархия, кейс и эталон">
      {/* Files */}
      <rect x={10} y={8} width={160} height={54} rx={7} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
      <text x={24} y={31} fontSize={13} fontWeight={700} fill={INK}>Отчёт</text>
      <text x={24} y={49} fontSize={11} fill={GREY}>.docx · рус. или англ.</text>
      <rect x={190} y={8} width={160} height={54} rx={7} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={204} y={31} fontSize={13} fontWeight={700} fill={INK}>Инклинометрия</text>
      <text x={204} y={49} fontSize={11} fill={GREY}>.txt · по желанию</text>
      <path d="M90 62 V80 H270 V62" fill="none" stroke={INK} strokeWidth={1.5} />
      <line x1={180} y1={80} x2={180} y2={94} stroke={INK} strokeWidth={1.5} />
      <ArrowHead x={180} y={100} dir="down" />
      {/* Check */}
      <rect x={50} y={100} width={260} height={56} rx={7} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
      <text x={180} y={124} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>1. Проверить</text>
      <text x={180} y={143} textAnchor="middle" fontSize={11} fill={GREY}>предпросмотр: ничего не сохраняется</text>
      <line x1={180} y1={156} x2={180} y2={174} stroke={INK} strokeWidth={1.5} />
      <ArrowHead x={180} y={180} dir="down" />
      {/* Import */}
      <rect x={50} y={180} width={260} height={56} rx={7} fill={INK} />
      <text x={180} y={204} textAnchor="middle" fontSize={13} fontWeight={700} fill="#FFFFFF">2. Импортировать</text>
      <text x={180} y={223} textAnchor="middle" fontSize={11} fill="#D4D4D8">данные записываются в вашу организацию</text>
      <path d="M180 236 V252 M66 252 H294 M66 252 V262 M180 252 V262 M294 252 V262" fill="none" stroke={INK} strokeWidth={1.5} />
      {outputs.map((o) => (
        <g key={o.title}>
          <ArrowHead x={o.x + 58} y={270} dir="down" />
          <rect x={o.x} y={270} width={116} height={74} rx={7} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
          <text x={o.x + 58} y={293} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={INK}>{o.title}</text>
          {o.lines.map((line, i) => <text key={line} x={o.x + 58} y={312 + i * 15} textAnchor="middle" fontSize={10.5} fill={GREY}>{line}</text>)}
        </g>
      ))}
    </Svg>
  );
};
