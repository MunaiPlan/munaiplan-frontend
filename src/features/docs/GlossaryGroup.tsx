import { Link } from 'react-router-dom';
import { docsHref } from './slugs';
import { glossary, termAnchor, type GlossaryEntry, type TermKey } from './content/glossary';
import { articleBySlug } from './content/registry';

/** One letter of the glossary: term, English term, unit, definition and where it is explained. */
export const GlossaryGroup = ({ keys }: { keys: TermKey[] }) => (
  <dl className="my-4 divide-y divide-ink-100 border-y border-ink-100">
    {keys.map((key) => {
      const entry = glossary[key];
      const unit = 'unit' in entry ? entry.unit : undefined;
      const en = 'en' in entry ? entry.en : undefined;
      const see: GlossaryEntry['see'] = entry.see;
      const where = articleBySlug[see.slug];
      return (
        <div key={key} id={termAnchor(key)} className="scroll-mt-20 py-3 target:bg-ink-50">
          <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-semibold text-ink">{entry.term}</span>
            {en && <span className="text-sm italic text-ink-500">{en}</span>}
            {unit && <span className="rounded border border-ink-200 px-1.5 font-mono text-2xs text-ink-700">{unit}</span>}
          </dt>
          <dd className="mt-1 leading-7 text-ink-700">
            {entry.definition}{' '}
            <Link to={docsHref(see.slug, see.anchor)} className="whitespace-nowrap text-sm text-ink-500 underline decoration-ink-300 underline-offset-2 hover:text-ink">
              → {where?.title ?? 'подробнее'}
            </Link>
          </dd>
        </div>
      );
    })}
  </dl>
);
