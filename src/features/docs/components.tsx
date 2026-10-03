import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../ui';
import { docsHref, type DocSlug } from './slugs';
import { glossary, termAnchor, type TermKey } from './content/glossary';

/*
 * The building blocks of an article. Articles are plain TSX using only these, so the look stays
 * consistent and an article is easy to edit: text in <P>, lists in <UL>/<OL>, notes in <Callout>,
 * procedures in <Steps>, tables in <DocTable>, diagrams in <Figure>, keys in <Kbd>,
 * interface labels in <Ui>, glossary terms in <Term>, links to other articles in <DocLink>.
 */

export const P = ({ children }: { children: ReactNode }) => <p className="my-4 leading-7 text-ink-700">{children}</p>;

export const UL = ({ children }: { children: ReactNode }) => (
  <ul className="my-4 list-disc space-y-1.5 pl-5 leading-7 text-ink-700 marker:text-ink-300">{children}</ul>
);

export const OL = ({ children }: { children: ReactNode }) => (
  <ol className="my-4 list-decimal space-y-1.5 pl-5 leading-7 text-ink-700 marker:font-mono marker:text-xs marker:text-ink-500">{children}</ol>
);

/** A label exactly as it appears in the interface: a button, tab, field or column. */
export const Ui = ({ children }: { children: ReactNode }) => (
  <span className="rounded border border-ink-200 bg-ink-50 px-1 py-px text-[0.92em] font-medium text-ink">{children}</span>
);

export const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="inline-flex min-w-[1.5rem] items-center justify-center rounded border border-b-2 border-ink-300 bg-paper px-1.5 font-mono text-xs font-medium text-ink">{children}</kbd>
);

/** Link to another article (and optionally a heading in it). */
export const DocLink = ({ to, hash, children }: { to: DocSlug; hash?: string; children: ReactNode }) => (
  <Link to={docsHref(to, hash)} className="font-medium text-ink underline decoration-ink-300 underline-offset-2 hover:decoration-ink">{children}</Link>
);

/** A glossary term: links to its definition; the definition also shows as a tooltip. */
export const Term = ({ k, children }: { k: TermKey; children?: ReactNode }) => {
  const entry = glossary[k];
  return (
    <Link to={docsHref('glossary', termAnchor(k))} title={entry.definition}
      className="text-ink underline decoration-ink-300 decoration-dotted underline-offset-2 hover:decoration-ink">
      {children ?? entry.term}
    </Link>
  );
};

const calloutLabels = { note: 'Примечание', important: 'Важно', tip: 'Совет' } as const;

/** A highlighted note. "important" is outlined in ink, "note" is a quiet grey block, "tip" is dashed. */
export const Callout = ({ tone = 'note', title, children }: { tone?: keyof typeof calloutLabels; title?: ReactNode; children: ReactNode }) => (
  <aside role="note" aria-label={calloutLabels[tone]} className={cn('my-5 rounded-lg px-4 py-3.5 text-[0.95em] leading-7',
    tone === 'note' && 'bg-ink-100 text-ink-700',
    tone === 'important' && 'border-2 border-ink text-ink',
    tone === 'tip' && 'border border-dashed border-ink-300 text-ink-700')}>
    <p className="font-mono text-2xs font-semibold uppercase tracking-wider text-ink-500">{calloutLabels[tone]}</p>
    {title && <p className="mt-1 font-semibold text-ink">{title}</p>}
    <div className="mt-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>p]:my-2 [&>ul]:my-2">{children}</div>
  </aside>
);

/** A numbered procedure. */
export const Steps = ({ items }: { items: { title: ReactNode; body?: ReactNode }[] }) => (
  <ol className="my-6 space-y-5">
    {items.map((item, i) => (
      <li key={i} className="flex gap-4">
        <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs font-semibold text-paper">{i + 1}</span>
        <div className="min-w-0 pt-0.5">
          <p className="font-semibold text-ink">{item.title}</p>
          {item.body && <div className="mt-1 leading-7 text-ink-700 [&>p]:my-2">{item.body}</div>}
        </div>
      </li>
    ))}
  </ol>
);

/**
 * A reference table. On narrow screens it scrolls sideways inside its own frame (the page never does).
 * `mono` lists columns shown in the monospace font (symbols, units).
 */
export const DocTable = ({ caption, head, rows, mono = [] }: {
  caption: string; head: ReactNode[]; rows: ReactNode[][]; mono?: number[];
}) => (
  <div role="region" aria-label={caption} tabIndex={0} className="thin-scrollbar my-5 max-w-full overflow-x-auto rounded-lg border border-ink-200">
    <table className="w-full border-collapse text-left text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead className="bg-ink-50">
        <tr>{head.map((h, i) => <th key={i} scope="col" className="border-b border-ink-200 px-3 py-2 text-xs font-semibold text-ink-700">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r} className="border-b border-ink-100 align-top last:border-0">
            {row.map((cell, c) => (
              <td key={c} className={cn('px-3 py-2 leading-6 text-ink-700', c === 0 && 'font-medium text-ink', mono.includes(c) && 'whitespace-nowrap font-mono text-xs leading-6')}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** A diagram with a caption. Figures are hand-drawn SVG in ink on paper (see figures/). */
export const Figure = ({ caption, children, wide }: { caption: ReactNode; children: ReactNode; wide?: boolean }) => (
  <figure className={cn('my-6 overflow-hidden rounded-lg border border-ink-200 bg-paper', !wide && 'max-w-xl')}>
    <div className="flex justify-center px-3 py-4 sm:px-5">{children}</div>
    <figcaption className="border-t border-ink-200 bg-ink-50 px-4 py-2 text-xs leading-5 text-ink-500">{caption}</figcaption>
  </figure>
);

/** Question and answer (FAQ). */
export const QA = ({ q, children }: { q: string; children: ReactNode }) => (
  <details className="group my-3 rounded-lg border border-ink-200 open:border-ink-300">
    <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3 font-medium text-ink touch:py-3.5 [&::-webkit-details-marker]:hidden">
      <span>{q}</span>
      <span aria-hidden="true" className="font-mono text-ink-500 transition-transform group-open:rotate-45">+</span>
    </summary>
    <div className="border-t border-ink-100 px-4 pb-1 text-[0.95em] [&>p]:my-3">{children}</div>
  </details>
);

/** A displayed equation in plain readable notation (monospace, centred, scrolls on phones). */
export const Eq = ({ children, label }: { children: ReactNode; label?: string }) => (
  <p className="thin-scrollbar my-4 overflow-x-auto rounded-lg bg-ink-50 px-4 py-3 text-center font-mono text-sm leading-7 text-ink" aria-label={label}>
    {children}
  </p>
);
