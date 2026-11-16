// Mock backend of the demo: the original API no longer exists, so the requests made by src/api/*
// are answered in the browser by MSW (Mock Service Worker) with the handlers below.
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { keepMocking } from './mswRecovery';

export const worker = setupWorker(...handlers);

// keepMocking: re-activates mocking after the browser stopped the idle worker (./mswRecovery.js)
export const startMockBackend = () =>
    worker.start({
        // PUBLIC_URL keeps the worker reachable when the app is served from a sub-path (GitHub Pages)
        serviceWorker: { url: `${process.env.PUBLIC_URL}/mockServiceWorker.js` },
        // only API calls are worth a warning (assets, fonts, dev-server requests pass through silently)
        onUnhandledRequest(request, print) {
            if (new URL(request.url).pathname.includes('/api/v1/')) print.warning();
        },
    }).then((result) => {
        keepMocking();
        return result;
    });
