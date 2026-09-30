import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cn } from '../../ui';
import { CONTACT_EMAIL } from '../landing/contact';
import { docsHref } from './slugs';
import { articles, groupTitle } from './content/registry';
import type { Article, DocSection } from './content/types';

/** h2/h3 with an anchor link; clicking «#» also copies the link to the section. */
const Heading = ({ level, id, children }: { level: 2 | 3; id: string; children: string }) => {
  const Tag = level === 2 ? 'h2' : 'h3';
  const { pathname } = useLocation();
  const copy = () => {
    try {
      void navigator.clipboard?.writeText(`${window.location.origin}${pathname}#${id}`).then(() => toast.success('Ссылка на раздел скопирована'));
    } catch { /* clipboard unavailable: the link still navigates */ }
  };
  return (
    <Tag id={id} className={cn('group scroll-mt-20 font-semibold tracking-tight text-ink',
      level === 2 ? 'mt-12 border-t border-ink-200 pt-8 text-xl' : 'mt-8 text-base')}>
      {children}
      <Link to={`#${id}`} onClick={copy} aria-label={`Ссылка на раздел «${children}»`}
        className="ml-2 inline-block font-mono font-normal text-ink-300 no-underline opacity-0 transition-opacity hover:text-ink focus:opacity-100 group-hover:opacity-100 touch:opacity-100">#</Link>
    </Tag>
  );
};

const Section = ({ section, level }: { section: DocSection; level: 2 | 3 }) => (
  <section aria-labelledby={section.id}>
    <Heading level={level} id={section.id}>{section.title}</Heading>
    {section.body}
    {section.subsections?.map((s) => <Section key={s.id} section={s} level={3} />)}
  </section>
);

interface TocItem { id: string; title: string; level: 2 | 3 }
const tocItems = (article: Article): TocItem[] => article.sections.flatMap((s) => [
  { id: s.id, title: s.title, level: 2 as const },
  ...(s.subsections ?? []).map((sub) => ({ id: sub.id, title: sub.title, level: 3 as const })),
]);

/** The heading currently at the top of the viewport. */
const useActiveHeading = (ids: string[]) => {
  const [active, setActive] = useState<string | undefined>(ids[0]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 110) current = id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, [ids]);
  return active;
};

const TocList = ({ items, active, onPick }: { items: TocItem[]; active?: string; onPick?: () => void }) => (
  <ol className="space-y-0.5 text-sm">
    {items.map((item) => (
      <li key={item.id}>
        <Link to={`#${item.id}`} onClick={onPick} aria-current={item.id === active ? 'location' : undefined}
          className={cn('block border-l-2 py-1 leading-5 hover:text-ink touch:py-2',
            item.level === 3 ? 'pl-6' : 'pl-3',
            item.id === active ? 'border-ink font-medium text-ink' : 'border-transparent text-ink-500')}>
          {item.title}
        </Link>
      </li>
    ))}
  </ol>
);

const PrevNext = ({ slug }: { slug: string }) => {
  const i = articles.findIndex((a) => a.slug === slug);
  const prev = articles[i - 1];
  const next = articles[i + 1];
  const card = 'group flex flex-col gap-1 rounded-lg border border-ink-200 px-4 py-3 hover:border-ink touch:py-4';
  return (
    <nav aria-label="Соседние статьи" className="mt-16 grid gap-3 border-t border-ink-200 pt-6 sm:grid-cols-2">
      {prev ? (
        <Link to={docsHref(prev.slug)} rel="prev" className={card}>
          <span className="text-xs text-ink-500">← Назад</span>
          <span className="font-medium text-ink">{prev.title}</span>
        </Link>
      ) : <Link to="/docs" rel="prev" className={card}><span className="text-xs text-ink-500">← Назад</span><span className="font-medium text-ink">Главная справки</span></Link>}
      {next && (
        <Link to={docsHref(next.slug)} rel="next" className={cn(card, 'text-right sm:col-start-2')}>
          <span className="text-xs text-ink-500">Далее →</span>
          <span className="font-medium text-ink">{next.title}</span>
        </Link>
      )}
    </nav>
  );
};

/** One article: title, lead, table of contents (right column on wide screens, collapsible above the text otherwise), sections, «Назад / Далее». */
export const ArticleView = ({ article, headingRef }: { article: Article; headingRef: (el: HTMLHeadingElement | null) => void }) => {
  const items = tocItems(article);
  const [ids] = useState(() => items.map((i) => i.id));
  const active = useActiveHeading(ids);
  const mobileToc = useRef<HTMLDetailsElement>(null);

  return (
    <div className="flex gap-10 xl:gap-14">
      <article className="min-w-0 max-w-3xl flex-1 text-[15px]">
        <p className="text-2xs font-semibold uppercase tracking-wider text-ink-500">{groupTitle(article.group)}</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-semibold tracking-tight text-ink focus:outline-none sm:text-3xl">{article.title}</h1>
        <p className="mt-3 text-base leading-7 text-ink-500 sm:text-lg">{article.description}</p>

        {items.length > 1 && (
          <details ref={mobileToc} className="group my-6 rounded-lg border border-ink-200 xl:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-ink touch:py-3.5 [&::-webkit-details-marker]:hidden">
              На этой странице
              <span aria-hidden="true" className="font-mono text-ink-500 transition-transform group-open:rotate-90">›</span>
            </summary>
            <div className="border-t border-ink-100 px-1 py-2">
              <TocList items={items} active={active} onPick={() => { if (mobileToc.current) mobileToc.current.open = false; }} />
            </div>
          </details>
        )}

        {article.intro}
        {article.sections.map((s) => <Section key={s.id} section={s} level={2} />)}

        <PrevNext slug={article.slug} />
        <p className="mt-8 text-xs text-ink-500">
          Нашли неточность в справке? Напишите на <a className="underline decoration-ink-300 underline-offset-2 hover:text-ink" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </article>

      {items.length > 1 && (
        <aside aria-label="На этой странице" className="hidden w-56 shrink-0 xl:block">
          <div className="thin-scrollbar sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pb-6">
            <p className="mb-2 pl-3 text-2xs font-semibold uppercase tracking-wider text-ink-500">На этой странице</p>
            <TocList items={items} active={active} />
          </div>
        </aside>
      )}
    </div>
  );
};
