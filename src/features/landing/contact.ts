/** Where access requests from the landing page go (confirmed by the owner). */
export const CONTACT_EMAIL = 'info@munaiplan.com';

/** A mailto link with a prefilled subject for access requests. */
export const accessRequestHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Доступ к MunaiPlan')}`;
