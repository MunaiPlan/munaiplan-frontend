import type { DocSlug } from '../slugs';

/**
 * Every term a user meets in MunaiPlan. Used by the glossary page, by search and by <Term k="…">
 * links inside articles. Add a term here, then reference it with its key.
 *
 * `unit` is what the UI shows; `null` means the UI shows no unit, so none is given here either.
 */
export interface GlossaryEntry {
  term: string;
  /** English term engineers expect, if any. */
  en?: string;
  unit?: string | null;
  definition: string;
  /** Where the term is explained in context. */
  see: { slug: DocSlug; anchor?: string };
}

export const glossary = {
  api: { term: 'API (строка состояния)', definition: 'Индикатор связи с сервером MunaiPlan в строке состояния. «API недоступен» означает, что приложение сейчас не может получить или сохранить данные.', see: { slug: 'interface', anchor: 'status-bar' } },
  dls: { term: 'DLS', en: 'dogleg severity', unit: '°/30 м', definition: 'Пространственная интенсивность искривления: насколько резко меняется направление ствола на каждые 30 м длины.', see: { slug: 'trajectory', anchor: 'columns' } },
  drift: { term: 'Drift', en: 'drift diameter', unit: 'мм', definition: 'Проходной (шаблонный) диаметр обсадной колонны: наибольший диаметр инструмента, который гарантированно пройдёт через неё.', see: { slug: 'hole-and-string', anchor: 'casing' } },
  globalNE: { term: 'Global N / Global E', en: 'grid northing / easting', unit: 'м', definition: 'Глобальные (картографические) координаты точки инклинометрии. Если в источнике их нет, сохраняются как 0.', see: { slug: 'trajectory', anchor: 'columns' } },
  md: { term: 'MD', en: 'measured depth', unit: 'м', definition: 'Глубина по стволу: длина ствола от точки отсчёта до точки, измеренная вдоль его оси. Всегда не меньше TVD.', see: { slug: 'trajectory', anchor: 'geometry' } },
  ne: { term: 'N / E', en: 'local northing / easting', unit: 'м', definition: 'Локальные координаты: смещение точки от устья на север (N) и на восток (E). Отрицательные значения — на юг и на запад.', see: { slug: 'trajectory', anchor: 'geometry' } },
  torqueDrag: { term: 'Torque & Drag', en: 'torque and drag', definition: 'Расчёт крутящего момента и сил сопротивления (трения) при движении и вращении колонны в стволе. В MunaiPlan — двумя способами: расчёт по формулам и прогноз ML-модели.', see: { slug: 'torque-drag' } },
  tvd: { term: 'TVD', en: 'true vertical depth', unit: 'м', definition: 'Глубина по вертикали: расстояние по вертикали от точки отсчёта до точки ствола.', see: { slug: 'trajectory', anchor: 'geometry' } },
  uwi: { term: 'UWI', en: 'unique well identifier', definition: 'Уникальный идентификатор скважины, принятый в вашей организации или регионе.', see: { slug: 'hierarchy', anchor: 'well' } },
  vs: { term: 'VS', en: 'vertical section', unit: 'м', definition: 'Смещение по вертикальной плоскости: горизонтальное расстояние от устья, спроецированное на выбранное направление профиля.', see: { slug: 'trajectory', anchor: 'geometry' } },

  subSea: { term: 'Абсолютная отметка', en: 'sub-sea depth, TVDSS', unit: 'м', definition: 'Глубина точки относительно уровня моря (а не стола ротора). При импорте может вычисляться как TVD минус высота точки отсчёта.', see: { slug: 'trajectory', anchor: 'columns' } },
  azimuth: { term: 'Азимут', en: 'azimuth', unit: '°', definition: 'Направление ствола в плане, отсчитанное от севера по часовой стрелке, от 0 до 360°.', see: { slug: 'trajectory', anchor: 'geometry' } },
  activeUnit: { term: 'Активная единица', definition: 'Текстовое поле месторождения и скважины для пометки о принятой системе единиц. На расчёты не влияет: MunaiPlan всегда хранит значения в метрических единицах.', see: { slug: 'hierarchy', anchor: 'field' } },
  kb: { term: 'Альтитуда стола ротора', en: 'kelly bushing elevation', unit: 'м', definition: 'Высота стола ротора (точки отсчёта глубин) относительно уровня моря. Хранится в заголовке траектории.', see: { slug: 'trajectory', anchor: 'edit' } },
  shoe: { term: 'Башмак', en: 'casing shoe', unit: 'м', definition: 'Нижний конец обсадной колонны; указывается глубиной по стволу.', see: { slug: 'hole-and-string', anchor: 'casing' } },
  rig: { term: 'Буровая', en: 'rig', definition: 'Вкладка кейса с параметрами буровой установки: грузоподъёмность, номинальный момент, давления, длины и диаметры наземной обвязки.', see: { slug: 'fluid-and-rig', anchor: 'rig' } },
  rotatingOnBottom: { term: 'Бурение ротором', en: 'rotating on bottom', definition: 'Операция: колонна вращается с поверхности (ротором или верхним приводом), долото на забое под нагрузкой. В сравнении с отчётом называется «Вращение на забое».', see: { slug: 'torque-drag', anchor: 'operations' } },
  slideDrilling: { term: 'Бурение ГЗД (слайдирование)', en: 'slide drilling', definition: 'Операция: колонна не вращается и скользит вниз, долото вращает забойный двигатель. Типично для ориентированного бурения.', see: { slug: 'torque-drag', anchor: 'operations' } },
  validation: { term: 'Валидация', en: 'validation', definition: 'Подтверждение точности расчёта независимыми эталонами (например, замерами на буровой) с согласованными допусками. Прогнозы MunaiPlan пока не валидированы.', see: { slug: 'torque-drag', anchor: 'not-validated' } },
  id: { term: 'ВД', en: 'ID, inner diameter', unit: 'мм', definition: 'Внутренний диаметр трубы или обсадной колонны.', see: { slug: 'hole-and-string', anchor: 'string' } },
  weight: { term: 'Вес (линейный)', en: 'weight per length', unit: 'кг/м', definition: 'Масса одного метра элемента колонны в воздухе. Обязателен для расчёта Torque & Drag.', see: { slug: 'hole-and-string', anchor: 'string' } },
  hookLoad: { term: 'Вес на крюке', en: 'hook load', unit: 'т', definition: 'Нагрузка, которую колонна создаёт на крюке талевой системы. Зависит от веса колонны в растворе, трения и операции.', see: { slug: 'torque-drag', anchor: 'families' } },
  vsView: { term: 'Вертикальный профиль', en: 'vertical section view', definition: 'График траектории в вертикальной плоскости: смещение (VS) по горизонтали, TVD по вертикали вниз.', see: { slug: 'trajectory', anchor: 'views' } },
  capacity: { term: 'Вместимость', en: 'linear capacity', unit: 'л/м', definition: 'Объём ствола или колонны на метр длины.', see: { slug: 'hole-and-string', anchor: 'casing' } },
  rotatingOffBottom: { term: 'Вращение над забоем', en: 'rotating off bottom', definition: 'Операция: колонна вращается, долото поднято над забоем и не нагружено.', see: { slug: 'torque-drag', anchor: 'operations' } },
  motor: { term: 'ГЗД', en: 'mud motor, PDM', definition: 'Гидравлический забойный двигатель: вращает долото потоком бурового раствора без вращения колонны.', see: { slug: 'torque-drag', anchor: 'operations' } },
  geothermal: { term: 'Геотермический профиль', en: 'geothermal gradient', definition: 'Температура на поверхности и на глубине и градиент температуры (°C/100 м). Вводится на вкладке «Давления и температура».', see: { slug: 'fluid-and-rig', anchor: 'geothermal' } },
  drillDepth: { term: 'Глубина бурения', unit: 'м', definition: 'Справочное поле кейса: до какой глубины рассчитывается этот случай. В расчёте не используется — глубину долота задаёт низ колонны.', see: { slug: 'case', anchor: 'properties' } },
  bitDepth: { term: 'Глубина долота', en: 'bit depth', unit: 'м', definition: 'Глубина по стволу, на которой находится долото, то есть низ рабочей колонны. Для сравнения с отчётом берётся глубина анализа из отчёта.', see: { slug: 'comparison', anchor: 'points' } },
  blockRating: { term: 'Грузоподъёмность', en: 'block rating', definition: 'Допустимая нагрузка на талевую систему буровой. На графике веса на крюке показана серой линией «Грузоподъёмность вышки».', see: { slug: 'fluid-and-rig', anchor: 'rig' } },
  bopRating: { term: 'Давление ПВО', en: 'BOP pressure rating', definition: 'Номинальное рабочее давление противовыбросового оборудования. Единица в интерфейсе не указана.', see: { slug: 'fluid-and-rig', anchor: 'rig' } },
  design: { term: 'Дизайн', en: 'design, plan', definition: 'Вариант плана скважины внутри ствола: например, проект и его версии. Содержит траектории.', see: { slug: 'hierarchy', anchor: 'design' } },
  yieldPoint: { term: 'ДНС', en: 'YP, yield point', unit: 'lbf/100ft²', definition: 'Динамическое напряжение сдвига бурового раствора. Показывается на вкладке «Гидравлика» из импортированного отчёта.', see: { slug: 'hydraulics', anchor: 'reference' } },
  duplicate: { term: 'Дубликат импорта', definition: 'Повторная загрузка тех же файлов. MunaiPlan узнаёт их по содержимому и не создаёт второй кейс.', see: { slug: 'import', anchor: 'duplicates' } },
  toolJoint: { term: 'Замок', en: 'tool joint', definition: 'Утолщённое резьбовое соединение бурильной трубы. В колонне задаются его длина, НД и ВД.', see: { slug: 'hole-and-string', anchor: 'string' } },
  importWarnings: { term: 'Замечания импорта', en: 'import warnings', definition: 'Сообщения о том, что при импорте пришлось вычислить, допустить или пропустить. Показываются в предпросмотре и в панели «Источник» кейса.', see: { slug: 'import', anchor: 'warnings' } },
  inclination: { term: 'Зенитный угол', en: 'inclination, Inc', unit: '°', definition: 'Угол между осью ствола и вертикалью: 0° — вертикально вниз, 90° — горизонтально. В таблице — «Зенит».', see: { slug: 'trajectory', anchor: 'geometry' } },
  import: { term: 'Импорт', definition: 'Создание кейса вместе со всей иерархией из инженерного отчёта (.docx) и/или экспорта инклинометрии (.txt).', see: { slug: 'import' } },
  survey: { term: 'Инклинометрия', en: 'survey', definition: 'Таблица точек ствола с глубиной, зенитным углом и азимутом (и вычисленными TVD, координатами, DLS). Составляет траекторию.', see: { slug: 'trajectory', anchor: 'columns' } },
  washout: { term: 'Кавернозность', en: 'volume excess, washout', unit: '%', definition: 'Насколько фактический объём открытого ствола превышает номинальный.', see: { slug: 'hole-and-string', anchor: 'open-hole' } },
  case: { term: 'Кейс', en: 'case', definition: 'Расчётный случай для конкретной траектории: ствол, колонна, раствор, давления, буровая и результаты анализов. Нижний уровень иерархии.', see: { slug: 'case' } },
  workString: { term: 'Колонна (рабочая)', en: 'work string, drill string', definition: 'Бурильная колонна кейса: элементы сверху вниз, от бурильных труб до долота.', see: { slug: 'hole-and-string', anchor: 'string' } },
  company: { term: 'Компания', en: 'company', definition: 'Верхний уровень иерархии, например оператор или подрядчик. Внутри — месторождения.', see: { slug: 'hierarchy', anchor: 'company' } },
  friction: { term: 'Коэффициент трения', en: 'friction factor', definition: 'Безразмерный коэффициент трения колонны о стенки обсадной колонны или открытого ствола: отношение силы трения к силе прижатия. Обычно 0,15–0,25 в обсадной колонне и 0,25–0,4 в открытом стволе. Одно значение на секцию, для всех операций.', see: { slug: 'hole-and-string', anchor: 'friction' } },
  site: { term: 'Куст', en: 'site, pad', definition: 'Кустовая площадка на месторождении, с которой бурятся скважины. Внутри — скважины.', see: { slug: 'hierarchy', anchor: 'site' } },
  grade: { term: 'Марка', en: 'grade', definition: 'Марка стали элемента колонны (например, X, G, S или обозначение производителя).', see: { slug: 'hole-and-string', anchor: 'string' } },
  field: { term: 'Месторождение', en: 'field', definition: 'Второй уровень иерархии, внутри компании. Внутри — кусты.', see: { slug: 'hierarchy', anchor: 'field' } },
  minWob: { term: 'Мин. вес на долоте', en: 'minimum WOB to buckling', unit: 'т', definition: 'Нагрузка на долото, при которой колонна начинает терять устойчивость — синусоидальный или спиральный изгиб — при бурении ротором или ГЗД.', see: { slug: 'torque-drag', anchor: 'families' } },
  model: { term: 'Модель (ML-модель)', en: 'machine-learning model', definition: 'Модель машинного обучения, которая по траектории, колонне и стволу даёт прогноз нагрузок по глубине. Это оценка, а не физический расчёт.', see: { slug: 'torque-drag', anchor: 'what' } },
  torque: { term: 'Момент', en: 'torque', unit: 'кН·м', definition: 'Крутящий момент в колонне. На поверхности — момент на роторе (surface torque).', see: { slug: 'torque-drag', anchor: 'families' } },
  surfaceTorque: { term: 'Момент на роторе', en: 'surface torque', unit: 'кН·м', definition: 'Крутящий момент, который нужно приложить к колонне на поверхности.', see: { slug: 'comparison', anchor: 'points' } },
  makeUp: { term: 'Момент свинчивания', en: 'make-up torque', unit: 'кН·м', definition: 'Момент затяжки резьбовых соединений. Рабочий момент не должен его превышать.', see: { slug: 'torque-drag', anchor: 'limits' } },
  od: { term: 'НД', en: 'OD, outer diameter', unit: 'мм', definition: 'Наружный диаметр трубы, замка или обсадной колонны.', see: { slug: 'hole-and-string', anchor: 'string' } },
  casing: { term: 'Обсадная колонна', en: 'casing', definition: 'Закреплённый интервал ствола. Задаётся верхом, низом, башмаком, ВД и коэффициентом трения.', see: { slug: 'hole-and-string', anchor: 'casing' } },
  backReaming: { term: 'Обратная проработка', en: 'back reaming', definition: 'Операция: подъём колонны с одновременным вращением.', see: { slug: 'torque-drag', anchor: 'operations' } },
  organization: { term: 'Организация', en: 'organization, tenant', definition: 'Заказчик MunaiPlan со своими пользователями и данными. Пользователи видят только данные своей организации.', see: { slug: 'admin', anchor: 'model' } },
  openHole: { term: 'Открытый ствол', en: 'open hole', definition: 'Незакреплённый интервал ниже последней обсадной колонны до забоя.', see: { slug: 'hole-and-string', anchor: 'open-hole' } },
  deviation: { term: 'Отклонение', en: 'relative difference', unit: '%', definition: 'Разница между прогнозом модели и эталоном из отчёта в процентах от эталона: (модель − отчёт) / |отчёт|.', see: { slug: 'comparison', anchor: 'deviation' } },
  planView: { term: 'План', en: 'plan view', definition: 'Вид траектории сверху: E по горизонтали, N по вертикали.', see: { slug: 'trajectory', anchor: 'views' } },
  plasticViscosity: { term: 'Пластическая вязкость', en: 'PV, plastic viscosity', unit: 'сП', definition: 'Реологический параметр бурового раствора. Показывается на вкладке «Гидравлика» из импортированного отчёта.', see: { slug: 'hydraulics', anchor: 'reference' } },
  density: { term: 'Плотность раствора', en: 'mud density', unit: 'кг/м³', definition: 'Плотность бурового раствора. Например, 1230 кг/м³ = 1,23 г/см³.', see: { slug: 'fluid-and-rig', anchor: 'fluid' } },
  trippingOut: { term: 'Подъём', en: 'tripping out, POOH', definition: 'Операция: колонна поднимается без вращения. Трение увеличивает вес на крюке.', see: { slug: 'torque-drag', anchor: 'operations' } },
  porePressure: { term: 'Поровое давление', en: 'pore pressure', definition: 'Давление флюида в порах пласта на заданной TVD. Единица давления в интерфейсе не указана.', see: { slug: 'fluid-and-rig', anchor: 'pore-pressure' } },
  tensionLimit: { term: 'Предел натяжения', en: 'tension limit', unit: 'т', definition: 'Наибольшее допустимое растягивающее усилие в колонне; серая линия на графике эффективного натяжения.', see: { slug: 'torque-drag', anchor: 'limits' } },
  yieldStrength: { term: 'Предел текучести', en: 'minimum yield strength', unit: 'psi', definition: 'Минимальный предел текучести материала элемента колонны. Обязателен для расчёта Torque & Drag.', see: { slug: 'hole-and-string', anchor: 'string' } },
  explorer: { term: 'Проводник', en: 'explorer', definition: 'Дерево иерархии слева: компании, месторождения… кейсы. Поиск, контекстное меню, навигация с клавиатуры.', see: { slug: 'interface', anchor: 'explorer' } },
  breadcrumbs: { term: 'Путь (хлебные крошки)', en: 'breadcrumbs', definition: 'Цепочка уровней в верхней панели от «Рабочая область» до открытой записи.', see: { slug: 'interface', anchor: 'top-bar' } },
  fluid: { term: 'Раствор', en: 'drilling fluid, mud', definition: 'Буровой раствор кейса: название, плотность, тип основы и базовая жидкость.', see: { slug: 'fluid-and-rig', anchor: 'fluid' } },
  role: { term: 'Роль', en: 'role', definition: '«Пользователь» работает с данными своей организации; «Администратор» дополнительно создаёт организации и учётные записи.', see: { slug: 'admin', anchor: 'roles' } },
  sinusoidal: { term: 'Синусоидальный изгиб', en: 'sinusoidal buckling', definition: 'Первая стадия потери устойчивости сжатой колонны: колонна ложится на стенку волной. Трение растёт.', see: { slug: 'formula', anchor: 'buckling' } },
  helical: { term: 'Спиральный изгиб', en: 'helical buckling', definition: 'Вторая, более опасная стадия потери устойчивости: колонна закручивается спиралью; возможна «блокировка» (lock-up) — колонна перестаёт передавать нагрузку.', see: { slug: 'formula', anchor: 'buckling' } },
  trippingIn: { term: 'Спуск', en: 'tripping in, RIH', definition: 'Операция: колонна опускается без вращения. Трение уменьшает вес на крюке.', see: { slug: 'torque-drag', anchor: 'operations' } },
  jointLength: { term: 'Ср. длина трубы', en: 'average joint length', unit: 'м', definition: 'Средняя длина одной трубы (свечи) элемента колонны. Обязательна для расчёта Torque & Drag.', see: { slug: 'hole-and-string', anchor: 'string' } },
  wellbore: { term: 'Ствол', en: 'wellbore; hole', definition: 'Два значения. 1) Уровень иерархии: основной ствол или боковой ствол скважины. 2) Вкладка кейса «Ствол»: обсадные колонны и открытый ствол.', see: { slug: 'hierarchy', anchor: 'wellbore' } },
  statusBar: { term: 'Строка состояния', en: 'status bar', definition: 'Чёрная полоса внизу экрана: связь с сервером, готовность модели, напоминание о невалидированных прогнозах, учётная запись.', see: { slug: 'interface', anchor: 'status-bar' } },
  topDrive: { term: 'СВП', en: 'top drive', definition: 'Силовой верхний привод: вращает колонну сверху вместо ротора. В параметрах буровой — длина и ВД обвязки СВП.', see: { slug: 'fluid-and-rig', anchor: 'rig' } },
  pipeSize: { term: 'Типоразмер трубы', unit: 'мм', definition: 'Справочное поле кейса с основным диаметром бурильных труб. В расчёте не используется: берутся диаметры элементов колонны.', see: { slug: 'case', anchor: 'properties' } },
  station: { term: 'Точка инклинометрии', en: 'survey station', definition: 'Одна строка инклинометрии: замер на глубине MD с зенитным углом и азимутом.', see: { slug: 'trajectory', anchor: 'columns' } },
  trajectory: { term: 'Траектория', en: 'trajectory, well path', definition: 'Инклинометрия ствола и заголовок отчёта. Уровень иерархии над кейсами: все кейсы траектории используют её точки.', see: { slug: 'trajectory' } },
  reductionLevel: { term: 'Уровень приведения', en: 'reference datum', definition: 'Текстовое поле месторождения: уровень, к которому приводятся глубины и отметки (например, уровень моря).', see: { slug: 'hierarchy', anchor: 'field' } },
  element: { term: 'Элемент колонны', en: 'string component', definition: 'Одна строка колонны: бурильные трубы, ТБТ, УБТ, забойный двигатель, долото и т. п.', see: { slug: 'hole-and-string', anchor: 'string' } },
  reference: { term: 'Эталон из отчёта', en: 'reference results', definition: 'Результаты Torque & Drag из исходного импортированного отчёта, сохранённые рядом с кейсом. Это расчёт другой программы, а не замеры.', see: { slug: 'comparison' } },
  emw: { term: 'ЭПБР', en: 'EMW, equivalent mud weight', definition: 'Эквивалентная плотность бурового раствора, выражающая давление на глубине через плотность. Единица в интерфейсе не указана.', see: { slug: 'fluid-and-rig', anchor: 'pore-pressure' } },
  effectiveDiameter: { term: 'Эффективный диаметр', en: 'effective hole diameter', unit: 'мм', definition: 'Диаметр открытого ствола, принимаемый в расчёте (обычно диаметр долота с учётом кавернозности).', see: { slug: 'hole-and-string', anchor: 'open-hole' } },
  formulaEngine: { term: 'Расчёт по формулам', en: 'analytical torque and drag', definition: 'Стандартный инженерный расчёт Torque & Drag в MunaiPlan по уравнениям механики (модель мягкой нити). В отличие от прогноза модели, каждая величина следует из данных кейса и формул.', see: { slug: 'formula' } },
  softString: { term: 'Модель мягкой нити', en: 'soft-string model', definition: 'Модель, в которой колонна — тяжёлая гибкая нить без изгибной жёсткости, лежащая на стенке ствола. Стандарт для расчёта Torque & Drag (Johancsik и др., 1984).', see: { slug: 'formula', anchor: 'what' } },
  buoyancyFactor: { term: 'Коэффициент плавучести', en: 'buoyancy factor', definition: 'Доля веса колонны, остающаяся в растворе: 1 − ρ раствора / ρ стали. Для раствора 1200 кг/м³ — около 0,85.', see: { slug: 'formula', anchor: 'buoyancy' } },
  sideForce: { term: 'Боковая сила', en: 'side force, normal force', unit: 'кН/м', definition: 'Сила, с которой колонна прижимается к стенке ствола, на метр длины. Создаётся весом колонны поперёк ствола и натяжением на искривлении; от неё зависят трение, момент и износ.', see: { slug: 'formula', anchor: 'side-force' } },
  trueTension: { term: 'Истинное натяжение', en: 'true tension', unit: 'т', definition: 'Фактическая осевая сила в теле трубы с учётом гидростатического давления на торцы и уступы (метод давления на площадь). Используется для напряжений; у устья равна эффективному натяжению.', see: { slug: 'formula', anchor: 'true-tension' } },
  overpullMargin: { term: 'Запас по затяжке', en: 'overpull margin', unit: 'т', definition: 'Насколько можно увеличить натяжение при подъёме, пока хотя бы один элемент колонны не достигнет предела натяжения (доля предела текучести).', see: { slug: 'formula', anchor: 'tension-limit' } },
  neutralPoint: { term: 'Нейтральная точка', en: 'neutral point', unit: 'м', definition: 'Глубина, на которой эффективное натяжение равно нулю: ниже колонна сжата, выше растянута. В сводке показано расстояние от долота.', see: { slug: 'formula', anchor: 'tension' } },
  blockWeight: { term: 'Вес талевого блока', en: 'travelling block weight', unit: 'т', definition: 'Вес подвижной части талевой системы (блок, крюк, верхний привод). Входит в вес на крюке.', see: { slug: 'formula', anchor: 'parameters' } },
  tortuosity: { term: 'Извилистость ствола', en: 'tortuosity', definition: 'Мелкие искривления ствола между точками инклинометрии. Увеличивают боковые силы и трение; в расчёте по формулам MunaiPlan пока не добавляются.', see: { slug: 'formula', anchor: 'assumptions' } },
  effectiveTension: { term: 'Эффективное натяжение', en: 'effective tension', unit: 'т', definition: 'Осевая сила в колонне с учётом плавучести (метод плавучести): натяжение от веса колонны в растворе, трения и нагрузки на долото. Положительная — растяжение, отрицательная — сжатие. По ней определяют вес на крюке и продольный изгиб.', see: { slug: 'formula', anchor: 'tension' } },
} satisfies Record<string, GlossaryEntry>;

export type TermKey = keyof typeof glossary;

/** Anchor of a term on the glossary page, e.g. "term-md". */
export const termAnchor = (key: string) => `term-${key}`;
