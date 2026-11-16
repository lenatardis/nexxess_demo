// Auth endpoints used by src/api/authApi.js (all public – no bearer token).
import { http, HttpResponse } from 'msw';
import { demoCode } from '../../settings/data';
import { getCollection, saveCollection } from '../db';
import { consultants } from '../data/consultants';
import { createUser, findUserByEmail, findUserById, saveUsers } from '../data/users';
import { createAccessToken, createRefreshToken, parseToken } from '../tokens';
import { API, errorResponse, paginate, readJson, unauthorized, withLatency } from './utils';

const tokensFor = (user) => ({
    access_token: createAccessToken(user.id),
    refresh_token: createRefreshToken(user.id),
});

// E-mails that passed the password step and wait for the code (kept in memory, as the form keeps
// its e-mail: a reload of the verification screen starts the login over).
const awaitingCode = new Set();

// Password reset links "sent" by the demo; they survive a reload, so the link can be opened in a new tab.
const RESET_LIFETIME_MS = 60 * 60 * 1000;
const resetTokens = () => getCollection('resetTokens', []);

const validPassword = (password) => typeof password === 'string' && password.length >= 10;

// Step 1 of the login: e-mail + password -> a code is "sent" (the demo accepts one fixed code).
const sendCode = http.post(
    `${API}/users/verification/send_code/`,
    withLatency(async ({ request }) => {
        const { email, password } = await readJson(request);
        const user = findUserByEmail(email);
        if (!user || user.password !== password) {
            return errorResponse(401, 'authentication_failed', 'Incorrect authentication credentials.');
        }
        awaitingCode.add(user.email);
        return HttpResponse.json({ success: true });
    }),
);

// Step 2 of the login: the code from the "e-mail".
const verifyCode = http.post(
    `${API}/users/verification/`,
    withLatency(async ({ request }) => {
        const { code, email } = await readJson(request);
        const user = findUserByEmail(email);
        if (!user || !awaitingCode.has(user.email) || String(code).trim() !== demoCode) {
            return errorResponse(400, 'invalid', 'Invalid verification code.', 'code');
        }
        awaitingCode.delete(user.email);
        return HttpResponse.json(tokensFor(user));
    }),
);

// Google sign-in: the frontend posts the Google profile; an unknown e-mail becomes a new customer.
const googleAuth = http.post(
    `${API}/users/google/auth/`,
    withLatency(async ({ request }) => {
        const { email, first_name, last_name } = await readJson(request);
        if (!email) return errorResponse(400, 'required', 'This field is required.', 'email');
        const user = findUserByEmail(email)
            || createUser({ email, first_name: first_name || '', last_name: last_name || '', password: null });
        return HttpResponse.json(tokensFor(user));
    }),
);

// Login by a link (/user_auth?user=<id>).
const userIdAuth = http.post(
    `${API}/users/user/auth/`,
    withLatency(async ({ request }) => {
        const { user_id } = await readJson(request);
        const user = findUserById(user_id);
        if (!user) return errorResponse(404, 'not_found', 'User not found.', 'user_id');
        return HttpResponse.json(tokensFor(user));
    }),
);

// Registration.
const signUp = http.post(
    `${API}/users/user/`,
    withLatency(async ({ request }) => {
        const body = await readJson(request);
        if (!body.email) return errorResponse(400, 'required', 'This field is required.', 'email');
        if (findUserByEmail(body.email)) {
            return errorResponse(400, 'unique', 'user with this email already exists.', 'email');
        }
        if (!validPassword(body.password)) {
            return errorResponse(400, 'invalid', 'Password must be at least 10 characters long.', 'password');
        }
        const text = (value) => (typeof value === 'string' ? value.trim() : '');
        // the form sends "+" for phones that were left empty
        const phone = (value) => (text(value) === '+' ? '' : text(value));
        const user = createUser({
            email: text(body.email),
            email_two: text(body.email_two),
            email_three: text(body.email_three),
            phone: phone(body.phone),
            phone_two: phone(body.phone_two),
            phone_three: phone(body.phone_three),
            first_name: text(body.first_name),
            last_name: text(body.last_name),
            country: text(body.country),
            city: text(body.city),
            password: body.password,
            consultant_id: consultants.some((item) => item.id === Number(body.b24_consultant_id))
                ? Number(body.b24_consultant_id)
                : undefined,
        });
        return HttpResponse.json({ id: user.id, email: user.email, ...tokensFor(user) }, { status: 201 });
    }),
);

// "Forgot password": nothing can be e-mailed, so the answer carries the reset token and the
// success screen shows the link as a demo hint.
const sendResetLink = http.post(
    `${API}/users/reset_password/send_link/`,
    withLatency(async ({ request }) => {
        const { email } = await readJson(request);
        const user = findUserByEmail(email);
        if (!user) return errorResponse(400, 'invalid', 'User with this email does not exist.', 'email');

        const token = `reset-${user.id}-${Math.random().toString(36).slice(2, 12)}`;
        const now = Date.now();
        const tokens = resetTokens();
        // drop expired links and the user's previous one
        tokens.splice(0, tokens.length, ...tokens.filter((item) => item.expires > now && item.userId !== user.id));
        tokens.push({ token, userId: user.id, expires: now + RESET_LIFETIME_MS });
        saveCollection('resetTokens');

        return HttpResponse.json({ success: true, demo_reset_token: token });
    }),
);

const resetPassword = http.post(
    `${API}/users/reset_password/`,
    withLatency(async ({ request }) => {
        const { token, new_password, confirm_password } = await readJson(request);
        const tokens = resetTokens();
        const entry = tokens.find((item) => item.token === token && item.expires > Date.now());
        const user = entry && findUserById(entry.userId);
        if (!user) return errorResponse(400, 'invalid', 'The reset link is invalid or has expired.', 'token');
        if (!validPassword(new_password)) {
            return errorResponse(400, 'invalid', 'Password must be at least 10 characters long.', 'new_password');
        }
        if (new_password !== confirm_password) {
            return errorResponse(400, 'invalid', 'Passwords do not match.', 'confirm_password');
        }
        user.password = new_password;
        saveUsers();
        tokens.splice(tokens.indexOf(entry), 1);
        saveCollection('resetTokens');
        return HttpResponse.json({ success: true });
    }),
);

// New access token for a valid refresh token; anything else is a 401 and the app logs out.
const refreshToken = http.post(
    `${API}/users/token/refresh/`,
    withLatency(async ({ request }) => {
        const { refresh } = await readJson(request);
        const userId = parseToken(refresh, 'refresh');
        if (!userId || !findUserById(userId)) return unauthorized();
        return HttpResponse.json({ access: createAccessToken(userId) });
    }),
);

// Consultants of the registration form; the list grows by asking a bigger page_size.
const consultantsList = http.get(
    `${API}/bitrix/consultants/`,
    withLatency(({ request }) => {
        const size = new URL(request.url).searchParams.get('page_size');
        const items = consultants.map((item) => ({
            consultant_id: item.id,
            consultant_name: `${item.first_name} ${item.last_name}`,
        }));
        return HttpResponse.json(paginate(items, 1, size));
    }),
);

export const authHandlers = [
    sendCode, verifyCode, googleAuth, userIdAuth, signUp, sendResetLink, resetPassword, refreshToken, consultantsList,
];
