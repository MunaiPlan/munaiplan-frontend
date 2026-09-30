import { docsHref } from './slugs';
import { glossary, termAnchor, type TermKey } from './content/glossary';
import { articles, groupTitle } from './content/registry';
import type { DocSection } from './content/types';

/** Client-side search over article titles, headings and glossary terms. No external service. */
export interface SearchEntry {
  kind: 'article' | 'section' | 'term';
  title: string;
  /** Where the hit lives: the group for articles, the article for headings, the English term or unit for terms. */
  context: string;
  href: string;
  /** Normalized text matched against the query. */
  haystack: string;
  /** Normalized title, ranked above other matches. */
  key: string;
}

export const normalize = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/[«»"“”„()]/g, ' ').replace(/\s+/g, ' ').trim();

const flattenSections = (sections: DocSection[]): DocSection[] => sections.flatMap((s) => [s, ...flattenSections(s.subsections ?? [])]);

const build = (): SearchEntry[] => {
  const entries: SearchEntry[] = [];
  for (const a of articles) {
    entries.push({
      kind: 'article', title: a.title, context: groupTitle(a.group), href: docsHref(a.slug),
      haystack: normalize([a.title, a.description, ...(a.keywords ?? [])].join(' ')), key: normalize(a.title),
    });
    // Glossary letters are headings too, but single letters make poor search hits.
    if (a.slug === 'glossary') continue;
    for (const s of flattenSections(a.sections)) {
      entries.push({
        kind: 'section', title: s.title, context: a.title, href: docsHref(a.slug, s.id),
        haystack: normalize([s.title, ...(s.keywords ?? [])].join(' ')), key: normalize(s.title),
      });
    }
  }
  for (const key of Object.keys(glossary) as TermKey[]) {
    const t = glossary[key];
    const en = 'en' in t ? t.en : '';
    const unit = 'unit' in t && t.unit ? t.unit : '';
    entries.push({
      kind: 'term', title: t.term, context: [en, unit].filter(Boolean).join(' · ') || 'Глоссарий',
      href: docsHref('glossary', termAnchor(key)),
      haystack: normalize([t.term, en, t.definition].join(' ')), key: normalize([t.term, en].join(' ')),
    });
  }
  return entries;
};

let index: SearchEntry[] | null = null;

/** Every query word must appear; titles that start with the query rank first, then title matches, then the rest. */
export const search = (query: string, limit = 20): SearchEntry[] => {
  const q = normalize(query);
  if (!q) return [];
  index ??= build();
  const words = q.split(' ');
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of index) {
    if (!words.every((w) => entry.haystack.includes(w))) continue;
    let score = 0;
    if (entry.key.startsWith(q)) score += 100;
    else if (entry.key.split(' ').some((w) => w.startsWith(words[0]))) score += 60;
    if (words.every((w) => entry.key.includes(w))) score += 40;
    score += entry.kind === 'article' ? 8 : entry.kind === 'term' ? 5 : 0;
    scored.push({ entry, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.entry.title.length - b.entry.title.length).slice(0, limit).map((s) => s.entry);
};
