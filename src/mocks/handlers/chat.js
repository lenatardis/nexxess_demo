// Demo only (src/api/pagesApi.js → getDemoChat, sendDemoChat): the local chat stub.
import { http, HttpResponse } from 'msw';
import { addMessage, messagesOf } from '../data/chat';
import { API, errorResponse, readJson, withAuth } from './utils';

const MAX_LENGTH = 1000;

const getMessages = http.get(
    `${API}/chat/messages/`,
    withAuth(({ user }) => {
        const results = messagesOf(user);
        return HttpResponse.json({ count: results.length, total_pages: 1, results });
    }),
);

const sendMessage = http.post(
    `${API}/chat/messages/`,
    withAuth(async ({ request, user }) => {
        const text = String((await readJson(request)).text || '').trim().slice(0, MAX_LENGTH);
        if (!text) return errorResponse(400, 'required', 'This field is required.', 'text');
        return HttpResponse.json({ results: addMessage(user, text) }, { status: 201 });
    }),
);

export const chatHandlers = [getMessages, sendMessage];
