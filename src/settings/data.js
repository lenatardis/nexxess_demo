// Demo config. The original backend no longer exists: requests go to a same-origin path
// that is answered in the browser by the mock backend (src/mocks/).
export const devUrl = '/api/v1/';

// Stands in for the answer of Google's userinfo endpoint: "Continue with Google" logs in
// this demo user through the mocked users/google/auth/ without contacting Google.
export const demoGoogleProfile = {
    email: 'daniel.harper@example.com',
    given_name: 'Daniel',
    family_name: 'Harper',
    name: 'Daniel Harper',
};

// Demo access shown as hints on the login screens (nothing can be e-mailed in the demo);
// the mock backend (src/mocks/data/users.js) seeds its users from the same values.
export const demoPassword = 'DemoPortal2026';
export const demoCode = '123456';
export const demoAccounts = [
    { email: 'olivia.bennett@example.com', name: 'Olivia Bennett', note: 'just started' },
    { email: 'daniel.harper@example.com', name: 'Daniel Harper', note: 'trust in progress' },
    { email: 'margaret.collins@example.com', name: 'Margaret Collins', note: 'trust completed' },
];
