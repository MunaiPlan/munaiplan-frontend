/**
 * Article slugs of the user manual at /docs. This file is tiny and has no content, so app screens
 * can link to the manual (HelpLink) without pulling the lazily loaded documentation into the app bundle.
 */
export const docSlugs = [
  'start', 'quick-start',
  'interface', 'shortcuts', 'mobile',
  'hierarchy', 'records',
  'import',
  'trajectory',
  'case', 'hole-and-string', 'fluid-and-rig',
  'torque-drag', 'depth-charts', 'comparison',
  'hydraulics',
  'admin',
  'units', 'glossary', 'faq',
] as const;

export type DocSlug = (typeof docSlugs)[number];

/** "/docs", "/docs/import" or "/docs/torque-drag#operations". */
export const docsHref = (slug?: DocSlug, anchor?: string): string =>
  `/docs${slug ? `/${slug}` : ''}${anchor ? `#${anchor}` : ''}`;
