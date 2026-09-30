import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { cn } from '../../ui';
import { docsHref } from './slugs';
import { search, type SearchEntry } from './search';

const kindLabels: Record<SearchEntry['kind'], string> = { article: 'Статья', section: 'Раздел', term: 'Термин' };

/** Shown before anything is typed. */
const suggestions: SearchEntry[] = [
  { kind: 'article', title: 'Быстрый старт: от отчёта до прогноза', context: 'Начало работы', href: docsHref('quick-start'), haystack: '', key: '' },
  { kind: 'article', title: 'Импорт отчётов', context: 'Импорт отчётов', href: docsHref('import'), haystack: '', key: '' },
  { kind: 'section', title: 'Готовность к расчёту Torque & Drag', context: 'Кейс: вкладки и готовность к расчёту', href: docsHref('case', 'readiness'), haystack: '', key: '' },
  { kind: 'article', title: 'Как читать графики', context: 'Torque & Drag', href: docsHref('depth-charts'), haystack: '', key: '' },
  { kind: 'article', title: 'Глоссарий', context: 'Справочник', href: docsHref('glossary'), haystack: '', key: '' },
  { kind: 'article', title: 'Вопросы и решения проблем', context: 'Справочник', href: docsHref('faq'), haystack: '', key: '' },
];

/** Search over titles, headings and glossary terms. ↑↓ choose, Enter opens, Esc closes. */
export const SearchDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const panel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const results = useMemo(() => (query.trim() ? search(query) : suggestions), [query]);

  useFocusTrap(panel, open, onClose);
  useEffect(() => { if (open) { setQuery(''); setActive(0); } }, [open]);
  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const go = (entry: SearchEntry | undefined) => {
    if (!entry) return;
    onClose();
    navigate(entry.href);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(results[active]); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 sm:p-4 sm:pt-[12vh]"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Поиск по справке"
        className="flex h-full w-full flex-col bg-paper sm:h-auto sm:max-h-[70vh] sm:max-w-xl sm:rounded-lg sm:shadow-pop">
        <div className="flex items-center gap-2 border-b border-ink-200 pl-4 pr-1">
          <FiSearch aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-500" />
          <input type="text" enterKeyHint="search" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown}
            role="combobox" aria-expanded="true" aria-controls="docs-search-results" aria-autocomplete="list"
            aria-activedescendant={results.length ? `docs-search-${active}` : undefined} aria-label="Поиск по справке"
            placeholder="Термин, раздел или вопрос…" autoComplete="off" spellCheck={false}
            className="h-14 min-w-0 flex-1 border-0 bg-transparent px-0 text-base text-ink placeholder:text-ink-500 focus:outline-none focus:ring-0" />
          <button type="button" onClick={onClose} aria-label="Закрыть поиск"
            className="flex h-11 w-11 items-center justify-center rounded text-ink-500 hover:bg-ink-100 hover:text-ink">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <p className="sr-only" role="status">{query.trim() ? `Найдено: ${results.length}` : ''}</p>
        {!query.trim() && <p className="px-4 pt-3 text-2xs font-semibold uppercase tracking-wider text-ink-500">Часто нужно</p>}
        <ul ref={list} id="docs-search-results" role="listbox" aria-label="Результаты поиска" className="thin-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
          {results.map((r, i) => (
            <li key={`${r.href}-${i}`} id={`docs-search-${i}`} data-index={i} role="option" aria-selected={i === active}
              onMouseMove={() => setActive(i)} onClick={() => go(r)}
              className={cn('flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 touch:py-3', i === active ? 'bg-ink text-paper' : 'text-ink')}>
              <span className={cn('mt-0.5 w-14 shrink-0 font-mono text-2xs uppercase tracking-wide', i === active ? 'text-paper/70' : 'text-ink-500')}>{kindLabels[r.kind]}</span>
              <span className="min-w-0">
                <span className="block font-medium">{r.title}</span>
                <span className={cn('block truncate text-xs', i === active ? 'text-paper/70' : 'text-ink-500')}>{r.context}</span>
              </span>
            </li>
          ))}
          {query.trim() && results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-ink-500">
              Ничего не найдено по «{query.trim()}». Попробуйте другое слово или откройте глоссарий.
            </li>
          )}
        </ul>
        <p className="hidden border-t border-ink-200 px-4 py-2 text-2xs text-ink-500 sm:block">
          <span className="font-mono">↑ ↓</span> выбрать · <span className="font-mono">Enter</span> открыть · <span className="font-mono">Esc</span> закрыть
        </p>
      </div>
    </div>
  );
};
