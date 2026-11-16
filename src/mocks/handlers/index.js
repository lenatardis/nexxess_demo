import { http } from 'msw';
import { authHandlers } from './auth';
import { profileHandlers } from './profile';
import { API, notFound, withLatency } from './utils';

// Handlers are added here by area as the portal is restored: header, rightBar, pages are still to come.

// Last in the list: an API path that has no handler yet still gets a JSON answer in the backend's
// error format (the API modules expect JSON), and is reported in the console.
const notMockedYet = http.all(
    `${API}/*`,
    withLatency(({ request }) => {
        console.warn(`[demo] No mock for ${request.method} ${new URL(request.url).pathname}`);
        return notFound('This endpoint is not mocked yet.');
    }),
);

export const handlers = [...authHandlers, ...profileHandlers, notMockedYet];
