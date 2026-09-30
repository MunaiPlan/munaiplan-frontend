import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import { accessRequestHref, CONTACT_EMAIL } from './contact';
import { WellSketch } from './WellSketch';

/*
 * Public landing page for signed-out visitors at "/". Honest B2B copy: no customers, metrics or
 * accuracy claims, and the model predictions are called unvalidated (docs/recovery/model-validation.md).
 */

const primaryCta = 'inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink-700';
const secondaryCta = 'inline-flex h-11 items-center justify-center gap-2 rounded-md border border-ink-300 bg-paper px-5 text-sm font-medium text-ink transition-colors hover:border-ink';

const features = [
  {
    title: 'Иерархия скважин',
    text: 'Компания, месторождение, куст, скважина, ствол, дизайн, траектория и кейс — в одном дереве. Проводник как в IDE: поиск, контекстное меню, навигация с клавиатуры.',
  },
  {
    title: 'Импорт отчётов',
    text: 'Отчёты .docx на русском и английском и экспорт инклинометрии .txt. Сначала предпросмотр, затем импорт: траектория, колонна, ствол и раствор создаются автоматически.',
  },
  {
    title: 'Torque & Drag',
    text: 'Прогнозы ML-моделей по глубине: вес на крюке, момент, минимальный вес на долоте и эффективное натяжение — для спуска, подъёма, бурения ротором и ГЗД.',
  },
  {
    title: 'Сравнение с эталоном',
    text: 'Для импортированных кейсов результаты расчёта из исходного отчёта сохраняются как эталон и показываются рядом с прогнозом модели, с отклонением в процентах.',
  },
  {
    title: 'Гидравлика',
    text: 'Собственный расчёт в разработке. Пока для импортированных кейсов показаны параметры гидравлики из исходного отчёта — для справки.',
  },
  {
    title: 'Данные организации',
    text: 'Каждая организация видит только свои данные. Учётные записи создаёт администратор, публичной регистрации нет.',
  },
];

const audiences = [
  {
    title: 'Инженеры по бурению',
    text: 'Подготовка кейсов Torque & Drag, хранение траекторий, компоновок колонны и конструкции ствола.',
  },
  {
    title: 'Операторы и буровые подрядчики Казахстана',
    text: 'Интерфейс на русском языке и метрические единицы: м, мм, кг/м, °.',
  },
  {
    title: 'Команды с готовыми инженерными отчётами',
    text: 'Существующие отчёты переносятся импортом, а эталонные результаты остаются рядом с кейсом для сравнения.',
  },
];

const steps = [
  { title: 'Напишите нам', text: <>Укажите организацию и сколько сотрудникам нужен доступ: <a className="underline decoration-ink-300 underline-offset-2 hover:decoration-ink" href={accessRequestHref}>{CONTACT_EMAIL}</a>.</> },
  { title: 'Администратор создаёт учётные записи', text: 'Организацию и пользователей заводит администратор MunaiPlan — самостоятельной регистрации нет.' },
  { title: 'Войдите', text: 'Используйте email и пароль, выданные администратором.' },
];

const hierarchy = ['Компания', 'Месторождение', 'Куст', 'Скважина', 'Ствол', 'Дизайн', 'Траектория', 'Кейс'];

const Logo = () => (
  <span className="flex items-center gap-2">
    <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-sm bg-ink font-mono text-2xs font-bold text-paper">M</span>
    <span className="font-semibold tracking-tight">MunaiPlan</span>
  </span>
);

const SectionHeading = ({ id, eyebrow, children }: { id: string; eyebrow: string; children: ReactNode }) => (
  <div className="max-w-2xl">
    <p className="font-mono text-xs text-ink-500">{eyebrow}</p>
    <h2 id={id} className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{children}</h2>
  </div>
);

const LandingPage = () => (
  <div className="min-h-screen bg-paper text-ink">
    <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
      Перейти к содержанию
    </a>

    <header className="sticky top-0 z-40 border-b border-ink-200 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="MunaiPlan — на главную" className="flex h-11 items-center"><Logo /></Link>
        <nav aria-label="Разделы" className="hidden items-center gap-6 text-sm text-ink-500 md:flex">
          <a href="#features" className="hover:text-ink">Возможности</a>
          <a href="#audience" className="hover:text-ink">Для кого</a>
          <a href="#access" className="hover:text-ink">Доступ</a>
          <Link to="/docs" className="hover:text-ink">Справка</Link>
        </nav>
        <div className="flex items-center gap-1">
          <Link to="/docs" className="flex h-11 items-center px-3 text-sm text-ink-500 hover:text-ink md:hidden">Справка</Link>
          <Link to="/auth" className={`${primaryCta} h-9 px-4 touch:h-11`}>Войти</Link>
        </div>
      </div>
    </header>

    <main id="content">
      {/* Hero */}
      <section aria-labelledby="hero-title" className="border-b border-ink-200">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
          <div>
            <p className="font-mono text-xs text-ink-500">Torque &amp; Drag · Гидравлика · Импорт отчётов</p>
            <h1 id="hero-title" className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Планирование бурения в одном рабочем пространстве
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
              MunaiPlan хранит иерархию скважин, импортирует инженерные отчёты и строит прогнозы Torque &amp; Drag
              с помощью ML-моделей — рядом с эталонными результатами из этих отчётов.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/auth" className={primaryCta}>Войти <FiArrowRight aria-hidden="true" /></Link>
              <a href={accessRequestHref} className={secondaryCta}><FiMail aria-hidden="true" /> Запросить доступ</a>
            </div>
            <p className="mt-4 text-xs text-ink-500">Доступ выдаёт администратор — публичной регистрации нет.</p>
          </div>
          <figure className="rounded-lg border border-ink-200 bg-paper shadow-panel">
            <div className="flex items-center gap-2 border-b border-ink-200 px-3 py-2">
              <span aria-hidden="true" className="flex gap-1.5">
                {[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full border border-ink-300" />)}
              </span>
              <span className="font-mono text-2xs text-ink-500">кейс · траектория и нагрузки</span>
            </div>
            <div className="p-3 sm:p-5"><WellSketch /></div>
            <figcaption className="border-t border-ink-200 px-3 py-2 text-2xs text-ink-500">Схематичная иллюстрация, не реальные данные.</figcaption>
          </figure>
        </div>
      </section>

      {/* Features */}
      <section id="features" aria-labelledby="features-title" className="scroll-mt-14 border-b border-ink-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <SectionHeading id="features-title" eyebrow="// возможности">Что умеет MunaiPlan</SectionHeading>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
            <div>
              <p className="text-sm leading-relaxed text-ink-700">
                Всё строится вокруг кейса — расчётного случая для конкретной траектории. Кейс хранит ствол, колонну,
                раствор, давления и параметры буровой, а анализы открываются на его вкладках.
              </p>
              <pre aria-label="Уровни иерархии" className="mt-6 overflow-x-auto rounded-lg bg-ink-50 p-4 font-mono text-xs leading-6 text-ink-700">
                {hierarchy.map((level, i) => `${i === 0 ? '' : `${'  '.repeat(i - 1)}└ `}${level}`).join('\n')}
              </pre>
            </div>
            <ol className="grid gap-px overflow-hidden rounded-lg border border-ink-200 bg-ink-200 sm:grid-cols-2">
              {features.map((f, i) => (
                <li key={f.title} className="bg-paper p-5 sm:p-6">
                  <p className="font-mono text-xs text-ink-500">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-2 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{f.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Honesty about the models */}
      <section aria-labelledby="validation-title" className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
          <div>
            <p className="font-mono text-xs text-paper/60">// честно о прогнозах</p>
            <h2 id="validation-title" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Прогнозы пока не валидированы</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-paper/80 sm:text-base">
            <p>
              Модели Torque &amp; Drag дают оценку, а не проверенный инженерный расчёт. Первое сравнение с эталонными
              результатами из импортированных отчётов — это проверка согласованности, а не валидация: на части кейсов расхождение значительное.
            </p>
            <p>
              Поэтому каждый прогноз в приложении помечен как невалидированный. Используйте его как ориентир и не
              принимайте инженерных решений без независимой проверки.
            </p>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section id="audience" aria-labelledby="audience-title" className="scroll-mt-14 border-b border-ink-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <SectionHeading id="audience-title" eyebrow="// для кого">Для буровых инженеров и операторов в Казахстане</SectionHeading>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {audiences.map((a) => (
              <li key={a.title} className="border-t border-ink pt-4">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Access */}
      <section id="access" aria-labelledby="access-title" className="scroll-mt-14">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <SectionHeading id="access-title" eyebrow="// доступ">Как получить доступ</SectionHeading>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title}>
                <p aria-hidden="true" className="font-mono text-4xl font-semibold text-ink-300">{i + 1}</p>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col gap-3 rounded-lg border border-ink-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="text-sm text-ink-700">Уже есть учётная запись? Войдите, чтобы открыть рабочую область.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={accessRequestHref} className={secondaryCta}>Запросить доступ</a>
              <Link to="/auth" className={primaryCta}>Войти <FiArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-ink-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3 text-ink"><Logo /><span className="text-ink-500">© {new Date().getFullYear()}</span></div>
        <p>Прогнозы ML-моделей не валидированы для инженерных решений.</p>
        <nav aria-label="Ссылки" className="flex gap-4">
          <Link to="/auth" className="hover:text-ink touch:py-3">Войти</Link>
          <Link to="/docs" className="hover:text-ink touch:py-3">Справка</Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink touch:py-3">{CONTACT_EMAIL}</a>
        </nav>
      </div>
    </footer>
  </div>
);

export default LandingPage;
