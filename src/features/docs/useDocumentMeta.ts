import { useEffect } from 'react';

const SITE = 'https://munaiplan.com';

const setAttr = (selector: string, attr: 'content' | 'href', value: string): (() => void) => {
  const el = document.querySelector(selector);
  if (!el) return () => undefined;
  const previous = el.getAttribute(attr);
  el.setAttribute(attr, value);
  return () => { if (previous !== null) el.setAttribute(attr, previous); };
};

/**
 * Per-page <title>, meta description, canonical URL and Open Graph tags for the manual.
 * The landing page's values in index.html are restored when the manual is left.
 */
export const useDocumentMeta = (title: string, description: string, path: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    const restore = [
      setAttr('meta[name="description"]', 'content', description),
      setAttr('meta[property="og:title"]', 'content', title),
      setAttr('meta[property="og:description"]', 'content', description),
      setAttr('meta[property="og:url"]', 'content', `${SITE}${path}`),
      setAttr('link[rel="canonical"]', 'href', `${SITE}${path}`),
    ];
    return () => {
      document.title = previousTitle;
      restore.forEach((fn) => fn());
    };
  }, [title, description, path]);
};
