import type { ReactNode } from 'react';
import type { DocSlug } from '../slugs';

/** Sidebar groups, in display order (see registry.ts). */
export type DocGroup =
  | 'start' | 'interface' | 'hierarchy' | 'import' | 'trajectory' | 'case' | 'td' | 'hydraulics' | 'admin' | 'reference';

/** One titled part of an article: an h2 (or an h3 inside `subsections`) with an anchor id. */
export interface DocSection {
  /** Anchor, e.g. "operations" in /docs/torque-drag#operations. Unique within the article; never rename a published id. */
  id: string;
  title: string;
  /** Extra words for search (synonyms, English terms). */
  keywords?: string[];
  body: ReactNode;
  subsections?: DocSection[];
}

export interface Article {
  slug: DocSlug;
  group: DocGroup;
  /** Page title (h1) and the first part of <title>. */
  title: string;
  /** One or two sentences: the lead paragraph and the meta description. */
  description: string;
  keywords?: string[];
  intro?: ReactNode;
  sections: DocSection[];
}
