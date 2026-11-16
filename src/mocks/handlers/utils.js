import { HttpResponse, delay } from 'msw';
import { parseToken } from '../tokens';

// Same path the API layer uses (devUrl in src/settings/data.js, without the trailing slash).
// Handlers match `${API}/…` – the leading * covers any origin and the GitHub Pages sub-path.
export const API = '*/api/v1';

// Small artificial latency so skeletons and preloaders are visible, as with a real server.
const LATENCY_MS = 300;

/** Error body in the backend's format: {errors: [{code, detail, attr}]}. */
export const errorResponse = (status, code, detail, attr = null, statusText) =>
    HttpResponse.json({ errors: [{ code, detail, attr }] }, { status, ...(statusText && { statusText }) });

// The API modules detect an expired token by status 401 or `statusText === 'Unauthorized'`;
// pagesApi.js parses the body as JSON before looking at the status, so a 401 must be JSON too.
export const unauthorized = () =>
    errorResponse(401, 'authentication_failed', 'Given token not valid for any token type', null, 'Unauthorized');

export const notFound = (detail = 'Not found.') => errorResponse(404, 'not_found', detail, null, 'Not Found');

/** The user id behind the request's bearer token, or null (missing, malformed or expired token). */
export const getRequestUserId = (request) => {
    const header = request.headers.get('Authorization') || '';
    return header.startsWith('Bearer ') ? parseToken(header.slice(7), 'access') : null;
};

/** Wraps a resolver: adds latency and rejects requests without a valid demo access token. */
export const withAuth = (resolver) => async (info) => {
    await delay(LATENCY_MS);
    const userId = getRequestUserId(info.request);
    if (!userId) return unauthorized();
    return resolver({ ...info, userId });
};

/** Adds latency only (public endpoints: login, registration, token refresh, consultants list). */
export const withLatency = (resolver) => async (info) => {
    await delay(LATENCY_MS);
    return resolver(info);
};

/** One page of a list in the backend's format: {count, total_pages, results}. */
export const paginate = (items, page, pageSize = 10) => {
    const size = Math.max(1, Number(pageSize) || 10);
    const current = Math.max(1, Number(page) || 1);
    const start = (current - 1) * size;
    return {
        count: items.length,
        total_pages: Math.max(1, Math.ceil(items.length / size)),
        results: items.slice(start, start + size),
    };
};
