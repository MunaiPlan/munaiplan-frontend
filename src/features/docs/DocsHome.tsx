import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { Callout, DocLink, Figure } from './components';
import { groups } from './content/registry';
import { ServiceLogicFigure } from './figures/overview';
import { docsHref } from './slugs';

const starters = [
  { slug: 'start', title: 'Что такое MunaiPlan', text: 'Возможности, логика сервиса и как получить доступ.' },
  { slug: 'quick-start', title: 'Быстрый старт', text: 'Пять шагов: от импорта отчёта до прогноза и сравнения.' },
  { slug: 'glossary', title: 'Глоссарий', text: 'Все термины от А до Я с единицами и определениями.' },
] as const;

/** /docs: search, where to start, how the service works and every section. */
export const DocsHome = ({ headingRef, onSearch }: { headingRef: (el: HTMLHeadingElement | null) => void; onSearch: () => void }) => (
  <div className="max-w-4xl text-[15px]">
    <p className="text-2xs font-semibold uppercase tracking-wider text-ink-500">Руководство пользователя</p>
    <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-semibold tracking-tight text-ink focus:outline-none sm:text-4xl">Справка MunaiPlan</h1>
    <p className="mt-3 max-w-2xl text-base leading-7 text-ink-500 sm:text-lg">
      Как устроен сервис, что означает каждый термин и как читать результаты: от импорта отчёта до прогноза Torque &amp; Drag и сравнения с эталоном.
    </p>

    <button type="button" onClick={onSearch}
      className="mt-6 flex h-12 w-full max-w-xl items-center gap-3 rounded-lg border border-ink-300 bg-paper px-4 text-left text-ink-500 transition-colors hover:border-ink">
      <FiSearch aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">Поиск: термин, раздел или вопрос…</span>
      <kbd className="hidden rounded border border-b-2 border-ink-300 px-1.5 font-mono text-xs text-ink sm:inline">/</kbd>
    </button>

    <h2 className="mt-12 text-xl font-semibold tracking-tight text-ink">С чего начать</h2>
    <ul className="mt-4 grid gap-3 sm:grid-cols-3">
      {starters.map((s, i) => (
        <li key={s.slug}>
          <Link to={docsHref(s.slug)} className={`flex h-full flex-col gap-1 rounded-lg border px-4 py-4 transition-colors ${i === 1 ? 'border-ink bg-ink text-paper hover:bg-ink-700' : 'border-ink-200 hover:border-ink'}`}>
            <span className="flex items-center justify-between font-semibold">{s.title} <FiArrowRight aria-hidden="true" /></span>
            <span className={`text-sm leading-6 ${i === 1 ? 'text-paper/70' : 'text-ink-500'}`}>{s.text}</span>
          </Link>
        </li>
      ))}
    </ul>

    <h2 className="mt-12 text-xl font-semibold tracking-tight text-ink">Как устроен сервис</h2>
    <div className="grid items-start gap-x-10 lg:grid-cols-[1fr_1fr]">
      <div className="leading-7 text-ink-700">
        <p className="mt-4">
          Данные попадают в MunaiPlan <DocLink to="import">импортом отчёта</DocLink> или вводятся вручную и складываются в{' '}
          <DocLink to="hierarchy">дерево из восьми уровней</DocLink>. Нижний уровень — <DocLink to="case">кейс</DocLink>: для него
          ML-модель строит <DocLink to="torque-drag">прогноз Torque &amp; Drag</DocLink>, а у импортированных кейсов прогноз{' '}
          <DocLink to="comparison">сравнивается с эталоном из отчёта</DocLink>.
        </p>
        <Callout tone="important">
          <p>Прогнозы моделей не валидированы: используйте их как ориентир, а не как основание для инженерных решений.</p>
        </Callout>
      </div>
      <Figure caption="Путь данных: от отчёта до сравнения с эталоном.">
        <ServiceLogicFigure />
      </Figure>
    </div>

    <h2 className="mt-12 text-xl font-semibold tracking-tight text-ink">Все разделы</h2>
    <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <section key={g.key} aria-label={g.title} className="border-t border-ink pt-3">
          <h3 className="font-semibold text-ink">{g.title}</h3>
          <ul className="mt-2 space-y-1">
            {g.articles.map((a) => (
              <li key={a.slug}>
                <Link to={docsHref(a.slug)} className="block py-0.5 text-ink-700 underline decoration-ink-200 underline-offset-2 hover:text-ink hover:decoration-ink touch:py-2">{a.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </div>
);
