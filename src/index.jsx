import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './App';
import {BrowserRouter} from "react-router-dom"

import {store} from './store/store';
import {startMockBackend} from './mocks/browser';
import {startVersionCheck} from './utils/versionCheck';

const basePath = process.env.PUBLIC_URL;

if (basePath && window.location.pathname === basePath) {
    // Demo: the router leaves the home page as "/nexxess_demo" (no trailing slash), which is outside the mock
    // worker's scope ("/nexxess_demo/") – a reload there would not be mocked. GitHub Pages redirects this URL
    // itself; the dev server and other static hosts do not.
    window.location.replace(`${basePath}/${window.location.search}${window.location.hash}`);
} else {
    // Demo build: a tab running an outdated bundle reloads to the deployed one (src/utils/versionCheck.js)
    startVersionCheck();

    // Demo: the mock backend must be running before the app's first request (profile check in App.jsx)
    startMockBackend()
        .catch((error) => console.error('Mock backend failed to start:', error))
        .then(() => {
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <Provider store={store}>
                        <App/>
                    </Provider>
                </BrowserRouter>
            );
        });
}
