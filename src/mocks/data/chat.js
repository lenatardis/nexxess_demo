// Messages of the demo chat (stands in for the Bitrix24 live chat): kept per customer, the
// "consultant" answers every message with a canned reply.
import { nextId } from '../db';
import { perUser } from './perUser';

const chat = perUser('chat', {});

const REPLIES = [
    'Thank you for your message! This is a demo of the portal, so nobody is on the other side of this chat – in the real portal your consultant answered here.',
    'Got it. In the real portal I would now check your trust and come back to you with the details.',
    'Thanks! You can keep exploring: the Trust Process page shows every stage, and My Files holds the shared documents.',
];

const timestamp = () => new Date().toISOString();

export const messagesOf = (user) => chat.of(user);

/** Stores the customer's message and the consultant's canned reply; returns both. */
export const addMessage = (user, text) => {
    const messages = chat.of(user);
    const replyNumber = messages.filter((message) => message.from === 'consultant').length;
    const sent = { id: nextId(messages), from: 'client', text, created_date: timestamp() };
    messages.push(sent);
    const reply = {
        id: nextId(messages), from: 'consultant', text: REPLIES[replyNumber % REPLIES.length], created_date: timestamp(),
    };
    messages.push(reply);
    chat.save();
    return [sent, reply];
};
