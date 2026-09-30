import { Link } from 'react-router-dom';
import { P } from '../components';
import { GlossaryGroup } from '../GlossaryGroup';
import { glossary, type TermKey } from './glossary';
import type { Article, DocSection } from './types';

/*
 * The glossary page is generated from glossary.ts: one section per initial letter, Latin terms first.
 * To add a term, edit glossary.ts only.
 */

const translit: Record<string, string> = {
  А: 'a', Б: 'b', В: 'v', Г: 'g', Д: 'd', Е: 'e', Ж: 'zh', З: 'z', И: 'i', К: 'k', Л: 'l', М: 'm', Н: 'n', О: 'o', П: 'p',
  Р: 'r', С: 's', Т: 't', У: 'u', Ф: 'f', Х: 'h', Ц: 'c', Ч: 'ch', Ш: 'sh', Э: 'eh', Ю: 'yu', Я: 'ya',
};

const sorted = (Object.keys(glossary) as TermKey[]).sort((a, b) => glossary[a].term.localeCompare(glossary[b].term, 'ru'));
const isLatin = (key: TermKey) => /^[A-Za-z]/.test(glossary[key].term);

const groups: { letter: string; id: string; keys: TermKey[] }[] = [];
const latin = sorted.filter(isLatin);
if (latin.length) groups.push({ letter: 'A–Z', id: 'latin', keys: latin });
sorted.filter((k) => !isLatin(k)).forEach((key) => {
  const letter = glossary[key].term[0].toUpperCase();
  const group = groups.find((g) => g.letter === letter);
  if (group) group.keys.push(key);
  else groups.push({ letter, id: `letter-${translit[letter] ?? letter}`, keys: [key] });
});

const sections: DocSection[] = groups.map((g) => ({
  id: g.id,
  title: g.letter,
  body: <GlossaryGroup keys={g.keys} />,
}));

export const glossaryArticle: Article = {
  slug: 'glossary',
  group: 'reference',
  title: 'Глоссарий',
  description: 'Все термины MunaiPlan от А до Я: короткое определение, английский термин, единица измерения и ссылка на раздел, где термин используется.',
  keywords: ['термины', 'словарь', 'определения', 'аббревиатуры'],
  intro: (
    <>
      <P>
        {sorted.length} терминов. Наведите на подчёркнутый пунктиром термин в любой статье, чтобы увидеть определение, или щёлкните,
        чтобы перейти сюда. Поиск по справке (<kbd className="font-mono text-xs">/</kbd>) тоже находит термины.
      </P>
      <nav aria-label="Алфавитный указатель" className="my-5 flex flex-wrap gap-1.5">
        {groups.map((g) => (
          <Link key={g.id} to={`#${g.id}`} className="flex h-8 min-w-[2rem] items-center justify-center rounded border border-ink-200 px-2 font-mono text-sm text-ink hover:border-ink hover:bg-ink hover:text-paper touch:h-11 touch:min-w-[2.75rem]">
            {g.letter}
          </Link>
        ))}
      </nav>
    </>
  ),
  sections,
};
