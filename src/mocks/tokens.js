// Demo tokens: opaque strings that carry the token type, the user id and an expiry time.
// The access token is short-lived on purpose, so the refresh-and-retry path of the API modules
// (401 -> users/token/refresh/ -> retry) is really exercised in the demo.

const ACCESS_LIFETIME_MS = 5 * 60 * 1000;
const REFRESH_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

const createToken = (type, userId, lifetime) =>
    `demo.${type}.${userId}.${Date.now() + lifetime}.${Math.random().toString(36).slice(2, 10)}`;

export const createAccessToken = (userId) => createToken('access', userId, ACCESS_LIFETIME_MS);
export const createRefreshToken = (userId) => createToken('refresh', userId, REFRESH_LIFETIME_MS);

/** The user id inside a valid, unexpired token of the given type ('access' | 'refresh'), otherwise null. */
export const parseToken = (token, type) => {
    const [prefix, tokenType, userId, expires] = String(token || '').split('.');
    if (prefix !== 'demo' || tokenType !== type || !userId) return null;
    if (!(Number(expires) > Date.now())) return null;
    return Number(userId);
};
