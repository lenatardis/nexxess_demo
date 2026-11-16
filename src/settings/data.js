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
