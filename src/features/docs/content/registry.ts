import type { DocSlug } from '../slugs';
import { admin } from './admin';
import { caseArticle } from './case';
import { comparison } from './comparison';
import { depthCharts } from './depth-charts';
import { formula } from './formula';
import { faq } from './faq';
import { fluidAndRig } from './fluid-and-rig';
import { glossaryArticle } from './glossary-article';
import { hierarchy } from './hierarchy';
import { holeAndString } from './hole-and-string';
import { hydraulics } from './hydraulics';
import { importArticle } from './import';
import { interfaceArticle } from './interface';
import { mobile } from './mobile';
import { quickStart } from './quick-start';
import { records } from './records';
import { shortcuts } from './shortcuts';
import { start } from './start';
import { torqueDrag } from './torque-drag';
import { trajectory } from './trajectory';
import type { Article, DocGroup } from './types';
import { units } from './units';

/**
 * The manual's table of contents. To add an article: add its slug to slugs.ts, write
 * content/<slug>.tsx exporting an `Article`, and list it here in its group.
 */
export const groups: { key: DocGroup; title: string; articles: Article[] }[] = [
  { key: 'start', title: 'Начало работы', articles: [start, quickStart] },
  { key: 'interface', title: 'Интерфейс', articles: [interfaceArticle, shortcuts, mobile] },
  { key: 'hierarchy', title: 'Иерархия данных', articles: [hierarchy, records] },
  { key: 'import', title: 'Импорт отчётов', articles: [importArticle] },
  { key: 'trajectory', title: 'Траектория', articles: [trajectory] },
  { key: 'case', title: 'Данные кейса', articles: [caseArticle, holeAndString, fluidAndRig] },
  { key: 'td', title: 'Torque & Drag', articles: [torqueDrag, formula, depthCharts, comparison] },
  { key: 'hydraulics', title: 'Гидравлика', articles: [hydraulics] },
  { key: 'admin', title: 'Администрирование', articles: [admin] },
  { key: 'reference', title: 'Справочник', articles: [units, glossaryArticle, faq] },
];

/** Every article in reading order (drives «Назад / Далее»). */
export const articles: Article[] = groups.flatMap((g) => g.articles);

export const articleBySlug = Object.fromEntries(articles.map((a) => [a.slug, a])) as Record<DocSlug, Article>;

export const groupTitle = (key: DocGroup) => groups.find((g) => g.key === key)?.title ?? '';
