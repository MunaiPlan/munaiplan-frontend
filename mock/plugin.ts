import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { caseChildren, comparison, formulaResult, ids, organizations, predictions, records, reference, tree } from './fixtures';

const json = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

const route = (req: IncomingMessage, res: ServerResponse): void => {
  const url = new URL(req.url ?? '/', 'http://mock');
  const path = url.pathname.replace(/^\/api\/v1/, '').replace(/\/$/, '');
  const method = req.method ?? 'GET';
  const now = Math.floor(Date.now() / 1000);

  if (path === '/users/sign-in') return json(res, 200, { success: true, token: 'mock-token', token_type: 'Bearer', expires_at: now + 86400,
    refresh_token: 'mock-refresh', refresh_token_type: 'Bearer', refresh_token_expires_at: now + 86400 * 30 });
  if (path === '/users/me') return json(res, 200, { id: 'u1', organization_id: 'o1', name: 'Демо', surname: 'Пользователь', email: 'demo@example.test', role: 'admin' });
  if (path === '/status') return json(res, 200, { api: 'ok', model: 'ready' });
  if (path === '/companies/tree') return json(res, 200, tree);
  if (path === '/admin/organizations') return method === 'GET' ? json(res, 200, organizations) : json(res, 201, {});
  if (/^\/admin\/organizations\/[^/]+\/users$/.test(path)) return json(res, 200, [{ id: 'u1', name: 'Демо', surname: 'Пользователь', email: 'demo@example.test', phone: '', role: 'admin' }]);
  if (path.startsWith('/torque-and-drag/comparison')) return url.searchParams.get('caseId') === ids.caseImported ? json(res, 200, comparison) : json(res, 404, { message: 'no reference' });
  if (path === '/torque-and-drag/formula') {
    if (url.searchParams.get('caseId') === ids.caseManual) return json(res, 422, { message: 'кейс не готов к расчёту Torque & Drag', problems: ['у кейса нет рабочей колонны'] });
    const bad = ['ff_cased', 'ff_open'].find((k) => url.searchParams.get(k) !== null && !(Number(url.searchParams.get(k)) >= 0 && Number(url.searchParams.get(k)) <= 1));
    if (bad) return json(res, 400, { message: 'Коэффициент трения: допустимо от 0 до 1' });
    return json(res, 200, formulaResult(url.searchParams));
  }
  const td = path.match(/^\/torque-and-drag\/([a-z-]+)$/);
  if (td) {
    if (url.searchParams.get('caseId') === ids.caseManual) return json(res, 422, { message: 'the case is not ready for Torque & Drag', problems: ['the case has no work string'] });
    return json(res, 200, predictions[td[1]] ?? {});
  }
  const ref = path.match(/^\/imports\/cases\/([^/]+)\/reference$/);
  if (ref) return ref[1] === ids.caseImported ? json(res, 200, reference) : json(res, 404, { message: 'no imported report data for this case' });
  if (path.startsWith('/imports')) return json(res, 400, { message: 'Импорт недоступен в режиме предпросмотра' });
  const item = path.match(/^\/[a-z-]+\/([0-9a-f-]{36})$/);
  if (item) {
    if (method !== 'GET') return json(res, 200, {});
    return records[item[1]] ? json(res, 200, records[item[1]]) : json(res, 404, { message: 'not found' });
  }
  const list = path.match(/^\/(strings|holes|fluids)$/);
  if (list && method === 'GET') return json(res, 200, url.searchParams.get('caseId') === ids.caseImported ? caseChildren[list[1]] : []);
  if (method === 'GET') return json(res, 200, []);
  return json(res, method === 'POST' ? 201 : 200, {});
};

/** Serves /api/v1 from synthetic fixtures so the UI can be previewed without a backend. */
export const mockApi = (): Plugin => ({
  name: 'munaiplan-mock-api',
  configureServer(server) {
    server.middlewares.use('/api/v1', (req, res) => { req.url = `/api/v1${req.url ?? ''}`; route(req, res); });
  },
});
