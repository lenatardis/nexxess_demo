// Keeps MSW mocking a page after the browser has stopped its idle service worker.
//
// Why: Chrome stops a service worker that has had nothing to do for ~30 s. MSW's page pings its worker every 5 s to
// prevent that, but timers are throttled in a hidden tab (say, while you work in another window), so the worker gets
// stopped. The restarted worker has forgotten which pages it mocks – it keeps them in memory (`activeClientIds` in
// public/mockServiceWorker.js) – and lets their API requests through to the static host: the data does not load
// until the page is reloaded.
//
// keepMocking() (called once the mock backend has started):
//   - when the tab is shown or focused again, it tells the worker again that this page is mocked – the same
//     "MOCK_ACTIVATE" message MSW sends when it starts – which also wakes the worker up;
//   - an API request that still gets a non-JSON answer (every mock answers JSON, or 204 without a body) never
//     reached a mock handler: mocking is re-activated and the request is sent once more. This also covers the
//     first visit, where Chrome restarts the freshly installed worker about a second after it took control
//     (seen 2026-11-16 in the production build: the first request after that restart went to the static host);
//   - if the second answer is not a mock answer either, a notice asks to reload the page.

const API_PATH = '/api/v1/';
const NOTICE_ID = 'demo-msw-notice';
const NOTICE_TEXT = 'Sorry, this demo runs on MSW (Mock Service Worker) and lost its connection after a pause. '
    + 'Reload the page to load the data.';

const reactivate = () => {
    try {
        navigator.serviceWorker?.controller?.postMessage('MOCK_ACTIVATE');
    } catch {
        // no worker to talk to
    }
};

const showReloadNotice = () => {
    if (document.getElementById(NOTICE_ID)) return;

    const notice = document.createElement('div');
    notice.id = NOTICE_ID;
    notice.setAttribute('role', 'alert');
    Object.assign(notice.style, {
        position: 'fixed',
        left: '16px',
        right: '16px',
        bottom: '16px',
        zIndex: '100000',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        maxWidth: '760px',
        margin: '0 auto',
        padding: '12px 16px',
        borderRadius: '8px',
        background: '#0C1D36',
        color: '#FFFFFF',
        fontSize: '14px',
        lineHeight: '1.4',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
    });

    const text = document.createElement('span');
    text.textContent = NOTICE_TEXT;
    text.style.flex = '1 1 260px';
    // set on the text itself, so a global `span { color }` rule cannot override the inherited white
    text.style.color = '#FFFFFF';

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Reload';
    Object.assign(button.style, {
        flex: 'none',
        padding: '8px 14px',
        border: 'none',
        borderRadius: '6px',
        background: '#FFFFFF',
        color: '#0C1D36',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    });
    button.addEventListener('click', () => window.location.reload());

    notice.append(text, button);
    document.body.append(notice);
};

const isOwnApiRequest = (input) => {
    try {
        const url = new URL(input instanceof Request ? input.url : String(input), window.location.href);
        return url.origin === window.location.origin && url.pathname.includes(API_PATH);
    } catch {
        return false;
    }
};

// Tells the worker again that this page is mocked and waits for its confirmation (or 1 s at most).
const reactivateAndWait = () =>
    new Promise((resolve) => {
        const container = navigator.serviceWorker;
        if (!container?.controller) {
            resolve();
            return;
        }
        const done = () => {
            container.removeEventListener('message', onMessage);
            clearTimeout(timer);
            resolve();
        };
        const onMessage = (event) => {
            if (event.data?.type === 'MOCKING_ENABLED') done();
        };
        const timer = setTimeout(done, 1000);
        container.addEventListener('message', onMessage);
        reactivate();
    });

const isMockAnswer = (response) =>
    response.status === 204 || (response.headers.get('content-type') || '').includes('json');

export const keepMocking = () => {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reactivate();
    });
    window.addEventListener('focus', reactivate);

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
        if (!isOwnApiRequest(input)) return originalFetch(input, init);

        // a Request object can be sent only once: keep a copy for the retry
        const retryInput = input instanceof Request ? input.clone() : input;
        const response = await originalFetch(input, init);
        if (isMockAnswer(response)) return response;

        // The answer came from the static host, so the request never reached a mock handler:
        // re-activate mocking and send it once more; only if that fails too, ask for a reload.
        await reactivateAndWait();
        const retried = await originalFetch(retryInput, init);
        if (!isMockAnswer(retried)) showReloadNotice();
        return retried;
    };
};
