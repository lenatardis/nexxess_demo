// Header endpoints used by src/api/header.js (notifications; the global search comes later).
import { http, HttpResponse } from 'msw';
import { notifications, toNotification } from '../data/notifications';
import { API, withAuth } from './utils';

// The bell popup: the whole list, newest first.
const getNotifications = http.get(
    `${API}/users/notifications/`,
    withAuth(({ user }) => {
        const results = notifications.of(user).map(toNotification);
        return HttpResponse.json({ count: results.length, total_pages: 1, results });
    }),
);

// Asked on every route change – the number on the bell.
const getNewQuantity = http.get(
    `${API}/users/notifications/new-quantity/`,
    withAuth(({ user }) =>
        HttpResponse.json({ quantity: notifications.of(user).filter((item) => !item.is_opened).length }),
    ),
);

// Sent right after the popup has loaded the list: everything becomes read.
const readNotifications = http.post(
    `${API}/users/notifications/`,
    withAuth(({ user }) => {
        notifications.of(user).forEach((item) => {
            item.is_opened = true;
        });
        notifications.save();
        return HttpResponse.json({ is_opened: true });
    }),
);

export const headerHandlers = [getNewQuantity, getNotifications, readNotifications];
