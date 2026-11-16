// Header endpoints used by src/api/header.js: notifications and the global search.
import { http, HttpResponse } from 'msw';
import { COURSES } from '../data/courses';
import { faq } from '../data/faq';
import { invoicesOf } from '../data/invoices';
import { notifications, toNotification } from '../data/notifications';
import { servicesOfCategory } from '../data/services';
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

// Global search of the header: the customer's invoices, the catalogue, FAQ questions and courses.
// A click on a result only opens the page of its type; `pk` makes the result clickable.
const SEARCH_LIMIT = 12;

const search = http.get(
    `${API}/search/`,
    withAuth(({ request, user }) => {
        const query = (new URL(request.url).searchParams.get('query') || '').trim().toLowerCase();
        if (!query) return HttpResponse.json({ count: 0, total_pages: 1, results: [] });

        const candidates = [
            ...invoicesOf(user).map((invoice) => ({
                type: 'Invoice', title: `Invoice ${invoice.invoice_id} – ${invoice.service.name}`, pk: invoice.invoice_id,
            })),
            ...servicesOfCategory().map((service) => ({ type: 'Service', title: service.name, pk: service.service_id })),
            ...faq.map((item, index) => ({ type: 'FAQ', title: item.question, pk: index + 1 })),
            ...COURSES.map((course) => ({ type: 'Course', title: course.title, pk: course.id })),
        ];
        const results = candidates.filter((item) => item.title.toLowerCase().includes(query)).slice(0, SEARCH_LIMIT);
        return HttpResponse.json({ count: results.length, total_pages: 1, results });
    }),
);

export const headerHandlers = [getNewQuantity, getNotifications, readNotifications, search];
