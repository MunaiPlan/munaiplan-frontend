import { ArrowHead, FAINT, GREY, INK, LIGHT, Svg } from './svg';

/** Vertical section: MD along the path, TVD straight down, VS sideways, inclination from vertical. */
export const DepthGeometryFigure = () => {
  const stations = [[60, 52], [60, 76], [60, 100], [64, 140], [80, 175], [112, 207], [190, 235], [255, 248.5], [320, 262]];
  return (
    <Svg width={370} height={302} max={480} label="Вертикальный разрез скважины: MD вдоль ствола, TVD по вертикали, смещение VS по горизонтали, зенитный угол от вертикали">
      <line x1={16} y1={30} x2={350} y2={30} stroke={GREY} strokeWidth={1.25} />
      <text x={200} y={22} fontSize={10.5} fill={GREY}>поверхность</text>
      <text x={60} y={22} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={INK} dx={52}>устье</text>
      <line x1={112} y1={19} x2={64} y2={28} stroke={LIGHT} />
      {/* Well path: vertical, build, tangent. */}
      <path d="M60 30 V100 C60 170 110 215 190 235 L320 262" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      {stations.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={3.2} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />)}
      <text x={70} y={80} fontSize={10.5} fill={GREY}>точки инклинометрии</text>
      {/* MD label */}
      <line x1={120} y1={152} x2={98} y2={182} stroke={GREY} />
      <text x={123} y={148} fontSize={12} fontWeight={700} fill={INK}>MD<tspan fontWeight={400} fill={GREY}> — длина вдоль ствола</tspan></text>
      {/* TVD dimension */}
      <line x1={320} y1={262} x2={346} y2={262} stroke={GREY} strokeDasharray="3 3" />
      <line x1={340} y1={38} x2={340} y2={254} stroke={INK} strokeWidth={1.25} />
      <ArrowHead x={340} y={31} dir="up" />
      <ArrowHead x={340} y={261} dir="down" />
      <text x={0} y={0} fontSize={12} fontWeight={700} fill={INK} transform="translate(356 170) rotate(-90)">TVD</text>
      {/* VS dimension */}
      <line x1={60} y1={104} x2={60} y2={288} stroke={GREY} strokeDasharray="3 3" />
      <line x1={320} y1={266} x2={320} y2={288} stroke={GREY} strokeDasharray="3 3" />
      <line x1={67} y1={282} x2={313} y2={282} stroke={INK} strokeWidth={1.25} />
      <ArrowHead x={61} y={282} dir="left" />
      <ArrowHead x={319} y={282} dir="right" />
      <rect x={140} y={275} width={100} height={14} fill="#FFFFFF" />
      <text x={190} y={286} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={INK}>Смещение (VS)</text>
      {/* Inclination */}
      <line x1={255} y1={248.5} x2={255} y2={204} stroke={GREY} strokeDasharray="3 3" />
      <path d="M255 226.5 A22 22 0 0 1 276.5 253" fill="none" stroke={INK} strokeWidth={1.25} />
      <text x={262} y={214} fontSize={11.5} fontWeight={700} fill={INK}>Зенит</text>
      <text x={262} y={227} fontSize={10} fill={GREY}>от вертикали</text>
    </Svg>
  );
};

/** Plan view: local N/E of a station and its azimuth from north. */
export const PlanViewFigure = () => (
  <Svg width={360} height={236} max={460} label="Вид сверху: координаты N и E точки и азимут, отсчитанный от севера по часовой стрелке">
    {/* Axes */}
    <line x1={110} y1={206} x2={110} y2={34} stroke={INK} strokeWidth={1.25} />
    <ArrowHead x={110} y={26} dir="up" />
    <text x={118} y={32} fontSize={12} fontWeight={700} fill={INK}>N <tspan fontWeight={400} fill={GREY}>(север)</tspan></text>
    <line x1={70} y1={170} x2={300} y2={170} stroke={INK} strokeWidth={1.25} />
    <ArrowHead x={308} y={170} dir="right" />
    <text x={306} y={190} textAnchor="end" fontSize={12} fontWeight={700} fill={INK}>E <tspan fontWeight={400} fill={GREY}>(восток)</tspan></text>
    <text x={102} y={186} textAnchor="end" fontSize={10.5} fill={GREY}>устье</text>
    {/* Projection of the path */}
    <path d="M110 170 C 130 150 180 100 250 70" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    <circle cx={250} cy={70} r={3.5} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
    {/* N and E of the station */}
    <line x1={250} y1={74} x2={250} y2={170} stroke={GREY} strokeDasharray="3 3" />
    <line x1={246} y1={70} x2={110} y2={70} stroke={GREY} strokeDasharray="3 3" />
    <text x={180} y={64} textAnchor="middle" fontSize={11} fill={GREY}>E точки</text>
    <text x={256} y={124} fontSize={11} fill={GREY}>N точки</text>
    {/* Azimuth at the station */}
    <line x1={250} y1={66} x2={250} y2={28} stroke={GREY} strokeDasharray="3 3" />
    <line x1={250} y1={70} x2={290} y2={52.8} stroke={INK} strokeWidth={1.25} />
    <path d="M250 48 A22 22 0 0 1 270.2 61.3" fill="none" stroke={INK} strokeWidth={1.25} />
    <text x={276} y={40} fontSize={11.5} fontWeight={700} fill={INK}>Азимут</text>
    <text x={276} y={52} fontSize={10} fill={GREY}>от севера</text>
  </Svg>
);

/** Hole and string: casing, shoe, open hole and the string components top to bottom. */
export const WellSchematicFigure = () => {
  const labels: { y: number; ax: number; ay: number; title: string; sub?: string }[] = [
    { y: 40, ax: 116, ay: 40, title: 'Обсадная колонна', sub: 'верх, низ, ВД, трение' },
    { y: 100, ax: 86, ay: 100, title: 'Бурильные трубы', sub: 'НД, ВД, вес, замок' },
    { y: 150, ax: 116, ay: 147, title: 'Башмак' },
    { y: 190, ax: 111, ay: 190, title: 'Открытый ствол', sub: 'эфф. диаметр, трение' },
    { y: 236, ax: 88, ay: 236, title: 'ТБТ (Heavy Weight)' },
    { y: 268, ax: 91, ay: 268, title: 'Забойный двигатель' },
    { y: 298, ax: 90, ay: 294, title: 'Долото на забое', sub: 'низ колонны = глубина долота' },
  ];
  return (
    <Svg width={360} height={322} max={440} label="Схема ствола и колонны: обсадная колонна с башмаком, открытый ствол, бурильные трубы, ТБТ, забойный двигатель и долото">
      {/* Formation */}
      <rect x={18} y={24} width={28} height={282} fill={FAINT} />
      <rect x={114} y={24} width={28} height={282} fill={FAINT} />
      <rect x={46} y={150} width={4} height={156} fill={FAINT} />
      <rect x={110} y={150} width={4} height={156} fill={FAINT} />
      <rect x={46} y={300} width={68} height={6} fill={FAINT} />
      <line x1={10} y1={24} x2={150} y2={24} stroke={GREY} strokeWidth={1.25} />
      {/* Casing and shoe */}
      <line x1={46} y1={24} x2={46} y2={150} stroke={INK} strokeWidth={3} />
      <line x1={114} y1={24} x2={114} y2={150} stroke={INK} strokeWidth={3} />
      <polygon points="46,150 46,140 54,150" fill={INK} />
      <polygon points="114,150 114,140 106,150" fill={INK} />
      {/* Open hole */}
      <line x1={50} y1={150} x2={50} y2={300} stroke={INK} strokeWidth={1.25} />
      <line x1={110} y1={150} x2={110} y2={300} stroke={INK} strokeWidth={1.25} />
      <line x1={50} y1={300} x2={110} y2={300} stroke={INK} strokeWidth={2} />
      {/* String */}
      <rect x={74} y={16} width={12} height={204} fill="#FFFFFF" stroke={INK} strokeWidth={1.2} />
      {[48, 88, 128, 168, 208].map((y) => <rect key={y} x={72} y={y} width={16} height={5} fill={INK} />)}
      <rect x={72} y={220} width={16} height={34} fill={LIGHT} stroke={INK} strokeWidth={1.2} />
      <rect x={69} y={254} width={22} height={32} fill={GREY} stroke={INK} strokeWidth={1.2} />
      <polygon points="68,286 92,286 80,299" fill={INK} />
      {labels.map((l) => (
        <g key={l.title}>
          <polyline points={`${l.ax},${l.ay} ${l.ax + 8},${l.ay} 152,${l.y}`} fill="none" stroke={GREY} />
          <circle cx={l.ax} cy={l.ay} r={1.8} fill={INK} />
          <text x={158} y={l.y + 4} fontSize={11.5} fontWeight={600} fill={INK}>{l.title}</text>
          {l.sub && <text x={158} y={l.y + 18} fontSize={10} fill={GREY}>{l.sub}</text>}
        </g>
      ))}
    </Svg>
  );
};
